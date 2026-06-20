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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const externalApiUrl = (process.env.GEMINI_API_URL || "").trim();

  if (!apiKey) {
    return res.status(500).json({
      error: "Missing GEMINI_API_KEY server environment variable"
    });
  }

  if (externalApiUrl && isLocalApiUrl(externalApiUrl)) {
    return res.status(500).json({
      error: "Invalid GEMINI_API_URL",
      message: "Vercel cannot reach localhost/127.0.0.1 web2api endpoints. Use a public HTTPS endpoint, or remove GEMINI_API_URL and set GEMINI_API_KEY to a Google AI Studio key."
    });
  }

  try {
    const body = await getJsonBody(req);
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
        return res.status(externalResponse.status).json({
          error: "External AI endpoint request failed",
          message: getGeminiErrorMessage(externalJson),
          details: externalJson
        });
      }

      return res.status(200).json(externalJson);
    }

    if (!(apiKey.startsWith("AIza") || apiKey.startsWith("AQ."))) {
      return res.status(500).json({
        error: "Invalid GEMINI_API_KEY",
        message: "Direct Google Gemini requests need a Google AI Studio key. Current valid keys typically start with AIza or AQ."
      });
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
    console.error("Chat API failed", error);
    const sdkError = getSdkErrorDetails(error);
    return res.status(sdkError.status || 500).json({
      error: "Chat API failed",
      message: sdkError.message,
      details: sdkError.details
    });
  }
}
