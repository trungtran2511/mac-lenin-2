import type { AiContextRequest, AiContextResponse } from "./chapterToolTypes";

class AiRequestError extends Error {
  readonly status?: number;
  readonly retryAfterMs?: number;

  constructor(
    message: string,
    status?: number,
    retryAfterMs?: number
  ) {
    super(message);
    this.name = "AiRequestError";
    this.status = status;
    this.retryAfterMs = retryAfterMs;
  }
}

const quotaCooldownByKey = new Map<string, number>();

interface CacheEntry {
  response: string;
  timestamp: number;
}
const MEMORY_CACHE = new Map<string, CacheEntry>();
const CACHE_PREFIX = "thay_nam_ai_cache_";
const MAX_CACHE_ENTRIES = 50;

function getCacheKey(prompt: string, systemInstruction: string): string {
  const combined = `${systemInstruction}|||${prompt}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const chr = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return `${CACHE_PREFIX}${hash}`;
}

function getCachedResponse(prompt: string, systemInstruction: string): string | null {
  const key = getCacheKey(prompt, systemInstruction);
  const memEntry = MEMORY_CACHE.get(key);
  if (memEntry) {
    return memEntry.response;
  }
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const entry: CacheEntry = JSON.parse(raw);
      // Cache response for 30 days (2,592,000,000 ms) to maximize free API quota
      if (Date.now() - entry.timestamp < 2_592_000_000) {
        MEMORY_CACHE.set(key, entry);
        return entry.response;
      } else {
        localStorage.removeItem(key);
      }
    }
  } catch {}
  return null;
}

function saveResponseToCache(prompt: string, systemInstruction: string, response: string) {
  const key = getCacheKey(prompt, systemInstruction);
  const entry: CacheEntry = { response, timestamp: Date.now() };
  MEMORY_CACHE.set(key, entry);
  try {
    localStorage.setItem(key, JSON.stringify(entry));
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(CACHE_PREFIX)) {
        keys.push(k);
      }
    }
    if (keys.length > MAX_CACHE_ENTRIES) {
      const parsedKeys = keys.map(k => {
        try {
          const item = JSON.parse(localStorage.getItem(k) || "");
          return { key: k, timestamp: item.timestamp || 0 };
        } catch {
          return { key: k, timestamp: 0 };
        }
      });
      parsedKeys.sort((a, b) => a.timestamp - b.timestamp);
      const toRemove = parsedKeys.slice(0, parsedKeys.length - MAX_CACHE_ENTRIES);
      for (const item of toRemove) {
        localStorage.removeItem(item.key);
      }
    }
  } catch {}
}

const parseRetryDelayMs = (value: unknown): number | undefined => {
  if (typeof value !== "string") return undefined;
  const seconds = Number.parseFloat(value.replace(/s$/i, ""));
  return Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds * 1000) : undefined;
};

const isFallbackEligible = (error: unknown) => {
  if (!(error instanceof AiRequestError)) return true;
  if (error.status === undefined) return true;
  return error.status === 401 || error.status === 403 || error.status === 404 || error.status === 429 || error.status >= 500;
};

async function executeServerProxyRequest(prompt: string, systemInstruction: string, model: string): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: prompt }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Server returned error ${response.status}`);
  }

  const data = await response.json();
  const result = data.choices?.[0]?.message?.content || data.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("").trim();
  if (!result) {
    throw new Error("No valid content returned from server proxy");
  }
  return result;
}

async function executeGeminiRequest(apiKey: string, prompt: string, systemInstruction: string, model: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 4000
        }
      })
    });
  } catch {
    throw new AiRequestError("Không thể kết nối tới Gemini.");
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const retryDelay = payload.error?.details?.find?.((detail: { retryDelay?: string }) => detail.retryDelay)?.retryDelay;
    throw new AiRequestError(
      `Gemini trả về lỗi ${response.status}.`,
      response.status,
      parseRetryDelayMs(retryDelay)
    );
  }

  const data = await response.json();
  const result = data.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text || "")
    .join("\n")
    .trim();

  if (!result) {
    throw new AiRequestError("Gemini không trả về nội dung hợp lệ.");
  }

  return result;
}

export async function askThayNamAI(prompt: string, systemInstruction: string): Promise<string> {
  const cached = getCachedResponse(prompt, systemInstruction);
  if (cached !== null) {
    return cached;
  }

  const keys = [
    String(import.meta.env.VITE_GEMINI_API_KEY || "").trim(),
    String(import.meta.env.VITE_GEMINI_API_KEY1 || "").trim(),
    String(import.meta.env.VITE_GEMINI_API_KEY2 || "").trim()
  ].filter((key, index, allKeys) => key && allKeys.indexOf(key) === index);

  const configModel = String(import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash").trim();
  const fallbackModels = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
  const models = [configModel, ...fallbackModels.filter(m => m !== configModel)];

  const now = Date.now();
  const availableKeys = keys.filter(key => (quotaCooldownByKey.get(key) || 0) <= now);

  let lastError: unknown = null;

  // 1. Nếu có key client, ưu tiên gọi trực tiếp từ client trước (không qua Server Proxy để tránh độ trễ)
  if (availableKeys.length > 0) {
    for (const key of availableKeys) {
      for (const model of models) {
        try {
          const result = await executeGeminiRequest(key, prompt, systemInstruction, model);
          saveResponseToCache(prompt, systemInstruction, result);
          return result;
        } catch (error) {
          lastError = error;
          if (error instanceof AiRequestError && error.status === 429) {
            quotaCooldownByKey.set(key, Date.now() + (error.retryAfterMs || 60_000));
          }
          if (!isFallbackEligible(error)) throw error;
        }
      }
    }
  }

  // 2. Nếu không có key client hoặc gọi client lỗi, chuyển sang gọi Server Proxy trên Vercel
  for (const model of models) {
    try {
      const result = await executeServerProxyRequest(prompt, systemInstruction, model);
      saveResponseToCache(prompt, systemInstruction, result);
      return result;
    } catch (serverError) {
      lastError = serverError;
      console.warn(`Server proxy failed for model ${model}`, serverError);
    }
  }

  throw lastError || new AiRequestError("Không thể kết nối tới Thầy Nam AI bằng bất kỳ key hay phương thức nào.");
}

export function parseAiJson<T>(value: string): T | null {
  const cleaned = value.replace(/```json/gi, "").replace(/```/g, "").trim();
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace < 0 || lastBrace < firstBrace) return null;

  try {
    return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1)) as T;
  } catch {
    return null;
  }
}

export async function askStructuredThayNam(req: AiContextRequest): Promise<AiContextResponse> {
  const systemInstruction = `Bạn là Thầy Nam AI, giảng viên Kinh tế chính trị Mác - Lênin.
Trả lời dựa trên ngữ cảnh giáo trình được cung cấp và chỉ trả về JSON theo schema answer, keyConcepts, nextStep.`;
  const prompt = `Chương: ${req.chapterId}
Chế độ: ${req.mode}
Trạng thái: ${req.currentStateSummary}
Ngữ cảnh giáo trình: ${req.curriculumContext}
Câu hỏi: ${req.userQuestion}
Định dạng: ${req.expectedFormat}`;

  try {
    const rawResult = await askThayNamAI(prompt, systemInstruction);
    const parsed = parseAiJson<AiContextResponse>(rawResult);
    return parsed && typeof parsed.answer === "string"
      ? parsed
      : { answer: rawResult, keyConcepts: [], nextStep: "Đặt một câu hỏi cụ thể hơn để tiếp tục ôn tập." };
  } catch {
    return {
      answer: "Chưa thể kết nối Thầy Nam AI lúc này. Kết quả và ngữ cảnh học tập của bạn vẫn được giữ nguyên.",
      keyConcepts: [],
      nextStep: "Thử lại sau ít phút."
    };
  }
}
