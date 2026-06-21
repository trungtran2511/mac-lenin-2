const DEFAULT_MODEL = "gemini-2.5-flash";

const isLocalApiUrl = (url) =>
  /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)(:\d+)?(\/|$)/i.test(url);

const getGeminiErrorMessage = (payload) => {
  return payload?.error?.message
    || payload?.details?.error?.message
    || (typeof payload?.error === "string" ? payload.error : "")
    || "Gemini API request failed";
};

const getSdkErrorDetails = (error) => {
  if (!error || typeof error !== "object") {
    return {};
  }

  return {
    status: typeof error.status === "number" ? error.status : 500,
    message: typeof error.message === "string" ? error.message : "Chat API failed",
    details: error.details || error.errorDetails || null
  };
};

const getJsonBody = async (req) => {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    return JSON.parse(req.body || "{}");
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  return rawBody ? JSON.parse(rawBody) : {};
};

const cooldownsByKey = new Map();

// Helper to parse Retry-After or standard 1 minute
const getRetryDelay = (payload) => {
  const delayStr = payload?.error?.details?.find?.((detail) => detail.retryDelay)?.retryDelay;
  if (typeof delayStr === "string") {
    const seconds = parseFloat(delayStr.replace(/s$/i, ""));
    if (Number.isFinite(seconds) && seconds > 0) {
      return Math.ceil(seconds * 1000);
    }
  }
  return 60000;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKeys = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY1,
    process.env.GEMINI_API_KEY2,
    process.env.GOOGLE_API_KEY
  ].map(k => (k || "").trim()).filter(Boolean);

  const uniqueKeys = [...new Set(apiKeys)];

  if (uniqueKeys.length === 0) {
    return res.status(500).json({
      error: "Missing GEMINI_API_KEY server environment variable"
    });
  }

  const externalApiUrl = (process.env.GEMINI_API_URL || "").trim();

  if (externalApiUrl && isLocalApiUrl(externalApiUrl)) {
    return res.status(500).json({
      error: "Invalid GEMINI_API_URL",
      message: "Vercel cannot reach localhost/127.0.0.1 web2api endpoints. Use a public HTTPS endpoint, or remove GEMINI_API_URL and set GEMINI_API_KEY to a Google AI Studio key."
    });
  }

  const now = Date.now();
  const availableKeys = uniqueKeys.filter(key => (cooldownsByKey.get(key) || 0) <= now);

  if (availableKeys.length === 0) {
    return res.status(429).json({
      error: "All server keys are in cooldown state",
      message: "Vui lòng đợi ít phút trước khi thử lại."
    });
  }

  let body;
  try {
    body = await getJsonBody(req);
  } catch (err) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  const model = body.model || process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const messages = Array.isArray(body.messages) ? body.messages : [];
  const systemMessage = messages.find(message => message.role === "system")?.content || "";
  const userMessages = messages
    .filter(message => message.role !== "system")
    .map(message => message.content)
    .filter(Boolean);

  const promptText = userMessages.join("\n\n").trim();

  if (!promptText) {
    return res.status(400).json({ error: "Missing user message" });
  }

  let latestError = null;

  for (const apiKey of availableKeys) {
    try {
      if (externalApiUrl) {
        const externalResponse = await fetch(externalApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({ model, messages })
        });

        const externalText = await externalResponse.text();
        let externalJson = {};

        try {
          externalJson = externalText ? JSON.parse(externalText) : {};
        } catch {
          externalJson = { raw: externalText };
        }

        if (!externalResponse.ok) {
          if (externalResponse.status === 429) {
            cooldownsByKey.set(apiKey, Date.now() + getRetryDelay(externalJson));
            latestError = {
              status: 429,
              data: {
                error: "External AI endpoint request failed with 429",
                message: getGeminiErrorMessage(externalJson),
                details: externalJson
              }
            };
            continue;
          }

          return res.status(externalResponse.status).json({
            error: "External AI endpoint request failed",
            message: getGeminiErrorMessage(externalJson),
            details: externalJson
          });
        }

        return res.status(200).json(externalJson);
      }

      if (!(apiKey.startsWith("AIza") || apiKey.startsWith("AQ."))) {
        latestError = {
          status: 500,
          data: {
            error: "Invalid GEMINI_API_KEY",
            message: "Direct Google Gemini requests need a Google AI Studio key. Current valid keys typically start with AIza or AQ."
          }
        };
        continue;
      }

      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            ...(systemMessage
              ? { systemInstruction: { parts: [{ text: systemMessage }] } }
              : {})
          })
        }
      );

      const responseText = await geminiResponse.text();
      let responseJson = {};

      try {
        responseJson = responseText ? JSON.parse(responseText) : {};
      } catch {
        responseJson = { raw: responseText };
      }

      if (!geminiResponse.ok) {
        if (geminiResponse.status === 429) {
          cooldownsByKey.set(apiKey, Date.now() + getRetryDelay(responseJson));
          latestError = {
            status: 429,
            data: {
              error: "Gemini API request failed with 429",
              message: getGeminiErrorMessage(responseJson),
              details: responseJson
            }
          };
          continue;
        }

        return res.status(geminiResponse.status).json({
          error: "Gemini API request failed",
          message: getGeminiErrorMessage(responseJson),
          details: responseJson
        });
      }

      const text = responseJson.candidates?.[0]?.content?.parts?.[0]?.text || "";

      return res.status(200).json({
        choices: [{ message: { role: "assistant", content: text } }],
        candidates: responseJson.candidates
      });

    } catch (error) {
      console.error("Single key request failed", error);
      latestError = {
        status: 500,
        data: {
          error: "Chat API failed",
          message: error.message || "Request failed"
        }
      };
    }
  }

  if (latestError) {
    return res.status(latestError.status).json(latestError.data);
  }

  return res.status(500).json({ error: "Failed to process request with available keys" });
}
