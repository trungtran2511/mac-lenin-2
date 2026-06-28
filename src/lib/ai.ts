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

const COOLDOWN_LS_KEY = "thay_nam_ai_key_cooldowns";

function getKeyCooldowns(): Record<string, number> {
  try {
    const raw = localStorage.getItem(COOLDOWN_LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setKeyCooldown(key: string, durationMs: number) {
  try {
    const cooldowns = getKeyCooldowns();
    cooldowns[key] = Date.now() + durationMs;
    localStorage.setItem(COOLDOWN_LS_KEY, JSON.stringify(cooldowns));
  } catch { }
}

function isKeyOnCooldown(key: string): boolean {
  try {
    const cooldowns = getKeyCooldowns();
    const cooldownTime = cooldowns[key] || 0;
    return Date.now() < cooldownTime;
  } catch {
    return false;
  }
}

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
  } catch { }
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
  } catch { }
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

async function executeServerProxyRequest(prompt: string, systemInstruction: string, model: string, cooldownKeys?: string[]): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ],
        cooldownKeys
      })
    });

    if (!response.ok) {
      throw new AiRequestError(`Server returned error ${response.status}`, response.status);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || data.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("").trim();
    if (!result) {
      throw new AiRequestError("No valid content returned from server proxy");
    }
    return result;
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new AiRequestError("Yêu cầu tới Server Proxy bị quá thời gian (Timeout).", 408);
    }
    if (err instanceof AiRequestError) {
      throw err;
    }
    throw new AiRequestError(err.message || "Không thể kết nối tới Server Proxy.");
  } finally {
    clearTimeout(timeoutId);
  }
}

async function executeGeminiRequest(apiKey: string, prompt: string, systemInstruction: string, model: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: 4000
        }
      })
    });
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new AiRequestError("Kết nối tới Gemini bị quá thời gian (Timeout).", 408);
    }
    throw new AiRequestError("Không thể kết nối tới Gemini.");
  } finally {
    clearTimeout(timeoutId);
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

function getKeyLabel(key: string): string {
  if (key === String(import.meta.env.VITE_GEMINI_API_KEY2 || "").trim()) return "Key 3 (VITE_GEMINI_API_KEY2)";
  if (key === String(import.meta.env.VITE_GEMINI_API_KEY1 || "").trim()) return "Key 2 (VITE_GEMINI_API_KEY1)";
  if (key === String(import.meta.env.VITE_GEMINI_API_KEY || "").trim()) return "Key 1 (VITE_GEMINI_API_KEY)";
  return `Key ẩn (${key.substring(0, 6)}...${key.substring(key.length - 4)})`;
}

export async function askThayNamAI(prompt: string, systemInstruction: string): Promise<string> {
  const cached = getCachedResponse(prompt, systemInstruction);
  if (cached !== null) {
    console.log("[Thầy Nam AI] Đang trả về kết quả từ Cache (Không tiêu tốn API Key).");
    return cached;
  }

  // Gọi theo thứ tự: Key 3 (VITE_GEMINI_API_KEY2) -> Key 2 (VITE_GEMINI_API_KEY1) -> Key 1 (VITE_GEMINI_API_KEY)
  const keys = [
    String(import.meta.env.VITE_GEMINI_API_KEY2 || "").trim(),
    String(import.meta.env.VITE_GEMINI_API_KEY1 || "").trim(),
    String(import.meta.env.VITE_GEMINI_API_KEY || "").trim()
  ].filter((key, index, allKeys) => key && allKeys.indexOf(key) === index);

  const configModel = String(import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash").trim();
  const fallbackModels = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
  const models = [configModel, ...fallbackModels.filter(m => m !== configModel)];

  const availableKeys = keys.filter(key => !isKeyOnCooldown(key));

  let lastError: unknown = null;

  // 1. Nếu có key client, ưu tiên gọi trực tiếp từ client trước (không qua Server Proxy để tránh độ trễ)
  if (availableKeys.length > 0) {
    for (const key of availableKeys) {
      const label = getKeyLabel(key);
      for (const model of models) {
        try {
          console.log(`[Thầy Nam AI] Đang thử gọi trực tiếp bằng ${label} - Model: ${model}`);
          const result = await executeGeminiRequest(key, prompt, systemInstruction, model);
          console.log(`[Thầy Nam AI] Gọi trực tiếp thành công bằng ${label}!`);
          saveResponseToCache(prompt, systemInstruction, result);
          return result;
        } catch (error: any) {
          console.error(`[Thầy Nam AI] Lỗi khi gọi bằng ${label} (Model: ${model}):`, error.message || error);
          lastError = error;
          if (error instanceof AiRequestError && error.status === 429) {
            console.warn(`[Thầy Nam AI] Key ${label} bị giới hạn tốc độ (429). Đưa vào trạng thái chờ 60s.`);
            setKeyCooldown(key, error.retryAfterMs || 60_000);
            // Break model loop to immediately try the next key, saving waiting time
            break;
          }
          if (error instanceof AiRequestError && error.status === 408) {
            console.warn(`[Thầy Nam AI] Key ${label} bị quá thời gian (408). Đưa vào trạng thái chờ 30s.`);
            setKeyCooldown(key, 30_000);
            break;
          }
          if (!isFallbackEligible(error)) throw error;
        }
      }
    }
  }

  // 2. Nếu không có key client hoặc gọi client lỗi, chuyển sang gọi Server Proxy trên Vercel
  // Chỉ gọi Server Proxy một lần duy nhất với model cấu hình để tránh gửi các request dư thừa không cần thiết lên server khi các key đã bị rate limit
  const activeCooldownKeys = keys.filter(key => isKeyOnCooldown(key));
  console.log(`[Thầy Nam AI] Tất cả key client thất bại hoặc đang chờ. Đang gọi dự phòng qua Server Proxy...`);
  try {
    const result = await executeServerProxyRequest(prompt, systemInstruction, configModel, activeCooldownKeys);
    console.log(`[Thầy Nam AI] Gọi Server Proxy thành công!`);
    saveResponseToCache(prompt, systemInstruction, result);
    return result;
  } catch (serverError: any) {
    console.error(`[Thầy Nam AI] Gọi Server Proxy thất bại:`, serverError.message || serverError);
    lastError = serverError;
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
