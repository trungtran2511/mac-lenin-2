export const config = {
  runtime: "nodejs"
};

const DEFAULT_MODEL = "gemini-2.5-flash";

const isLocalApiUrl = (url) =>
  /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)(:\d+)?(\/|$)/i.test(url);

const getGeminiErrorMessage = (payload) => {
  return payload?.error?.message
    || payload?.details?.error?.message
    || (typeof payload?.error === "string" ? payload.error : "")
    || "Gemini API request failed";
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

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", "Allow": "POST" }
    });
  }

  const apiKeys = [
    process.env.GEMINI_API_KEY2,
    process.env.GEMINI_API_KEY1,
    process.env.GEMINI_API_KEY,
    process.env.GOOGLE_API_KEY
  ].map(k => (k || "").trim()).filter(Boolean);

  const uniqueKeys = [...new Set(apiKeys)];

  if (uniqueKeys.length === 0) {
    return new Response(JSON.stringify({
      error: "Missing GEMINI_API_KEY server environment variable"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  const externalApiUrl = (process.env.GEMINI_API_URL || "").trim();

  if (externalApiUrl && isLocalApiUrl(externalApiUrl)) {
    return new Response(JSON.stringify({
      error: "Invalid GEMINI_API_URL",
      message: "Vercel cannot reach localhost/127.0.0.1 web2api endpoints. Use a public HTTPS endpoint, or remove GEMINI_API_URL and set GEMINI_API_KEY to a Google AI Studio key."
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  const now = Date.now();
  const availableKeys = uniqueKeys.filter(key => (cooldownsByKey.get(key) || 0) <= now);

  if (availableKeys.length === 0) {
    return new Response(JSON.stringify({
      error: "All server keys are in cooldown state",
      message: "Vui lòng đợi ít phút trước khi thử lại."
    }), {
      status: 429,
      headers: { "Content-Type": "application/json" }
    });
  }

  let body;
  try {
    body = await req.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const configModel = body.model || process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const fallbackModels = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
  const models = [configModel, ...fallbackModels.filter(m => m !== configModel)];

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const systemMessage = messages.find(message => message.role === "system")?.content || "";
  const userMessages = messages
    .filter(message => message.role !== "system")
    .map(message => message.content)
    .filter(Boolean);

  const promptText = userMessages.join("\n\n").trim();

  if (!promptText) {
    return new Response(JSON.stringify({ error: "Missing user message" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  let latestError = null;

  for (const apiKey of availableKeys) {
    for (const model of models) {
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

            return new Response(JSON.stringify({
              error: "External AI endpoint request failed",
              message: getGeminiErrorMessage(externalJson),
              details: externalJson
            }), {
              status: externalResponse.status,
              headers: { "Content-Type": "application/json" }
            });
          }

          return new Response(JSON.stringify(externalJson), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
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

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);
        let geminiResponse;
        try {
          geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": apiKey
              },
              signal: controller.signal,
              body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }],
                ...(systemMessage
                  ? { systemInstruction: { parts: [{ text: systemMessage }] } }
                  : {}),
                generationConfig: {
                  maxOutputTokens: 4000
                }
              })
            }
          );
        } catch (fetchErr) {
          if (fetchErr.name === "AbortError") {
            latestError = {
              status: 408,
              data: {
                error: "Gemini request timeout",
                message: "Kết nối tới Gemini bị quá thời gian (Timeout)."
              }
            };
            break;
          }
          throw fetchErr;
        } finally {
          clearTimeout(timeoutId);
        }

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
            break;
          }

          return new Response(JSON.stringify({
            error: "Gemini API request failed",
            message: getGeminiErrorMessage(responseJson),
            details: responseJson
          }), {
            status: geminiResponse.status,
            headers: { "Content-Type": "application/json" }
          });
        }

        const text = responseJson.candidates?.[0]?.content?.parts
          ?.map(part => part.text || "")
          .join("")
          .trim() || "";

        return new Response(JSON.stringify({
          choices: [{ message: { role: "assistant", content: text } }],
          candidates: responseJson.candidates
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
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
  }

  if (latestError) {
    return new Response(JSON.stringify(latestError.data), {
      status: latestError.status,
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify({ error: "Failed to process request with available keys" }), {
    status: 500,
    headers: { "Content-Type": "application/json" }
  });
}
