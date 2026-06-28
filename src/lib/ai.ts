import type { AiContextRequest, AiContextResponse } from "./chapterToolTypes";

// ─────────────────────────────────────────────
// Error class
// ─────────────────────────────────────────────

export class AiRequestError extends Error {
  readonly status?: number;
  readonly retryAfterMs?: number;
  /** Seconds until the earliest blocked key is available again (0 = not a cooldown error) */
  readonly cooldownSecondsRemaining: number;

  constructor(
    message: string,
    status?: number,
    retryAfterMs?: number,
    cooldownSecondsRemaining = 0
  ) {
    super(message);
    this.name = "AiRequestError";
    this.status = status;
    this.retryAfterMs = retryAfterMs;
    this.cooldownSecondsRemaining = cooldownSecondsRemaining;
  }
}

// ─────────────────────────────────────────────
// ApiKeyStatus — in-memory key manager
// ─────────────────────────────────────────────

interface ApiKeyStatus {
  key: string;
  label: string;
  isBlocked: boolean;
  blockedUntil: number; // Unix timestamp (ms)
}

const COOLDOWN_LS_KEY = "thay_nam_ai_key_cooldowns";

/** Initialise in-memory registry from env + persisted cooldowns */
function buildKeyRegistry(): ApiKeyStatus[] {
  const rawKeys = [
    { key: String(import.meta.env.VITE_GEMINI_API_KEY3 || "").trim(), label: "Key 4 (VITE_GEMINI_API_KEY3)" },
    { key: String(import.meta.env.VITE_GEMINI_API_KEY2 || "").trim(), label: "Key 3 (VITE_GEMINI_API_KEY2)" },
    { key: String(import.meta.env.VITE_GEMINI_API_KEY1 || "").trim(), label: "Key 2 (VITE_GEMINI_API_KEY1)" },
    { key: String(import.meta.env.VITE_GEMINI_API_KEY  || "").trim(), label: "Key 1 (VITE_GEMINI_API_KEY)"  },
  ];

  const seen = new Set<string>();
  const unique = rawKeys.filter(({ key }) => key && !seen.has(key) && seen.add(key));

  let persisted: Record<string, number> = {};
  try {
    const raw = localStorage.getItem(COOLDOWN_LS_KEY);
    persisted = raw ? JSON.parse(raw) : {};
  } catch { /* ignore */ }

  const now = Date.now();
  return unique.map(({ key, label }) => {
    const blockedUntil = persisted[key] || 0;
    return { key, label, isBlocked: now < blockedUntil, blockedUntil };
  });
}

// Singleton registry — rebuilt once per page load, then mutated in-memory
const KEY_REGISTRY: ApiKeyStatus[] = buildKeyRegistry();

/** Un-block any key whose penalty has expired, then return the first clean key */
function getAvailableKey(): ApiKeyStatus | null {
  const now = Date.now();
  for (const k of KEY_REGISTRY) {
    if (k.isBlocked && now > k.blockedUntil) {
      k.isBlocked = false;
      k.blockedUntil = 0;
      console.log(`[Thầy Nam AI] Key ${k.label} đã hết thời gian phạt — mở block.`);
    }
    if (!k.isBlocked) return k;
  }
  return null;
}

/** Block a key and persist the timestamp to localStorage */
function blockKey(entry: ApiKeyStatus, durationMs: number) {
  entry.isBlocked = true;
  entry.blockedUntil = Date.now() + durationMs;
  try {
    const persisted: Record<string, number> = {};
    for (const k of KEY_REGISTRY) {
      if (k.isBlocked) persisted[k.key] = k.blockedUntil;
    }
    localStorage.setItem(COOLDOWN_LS_KEY, JSON.stringify(persisted));
  } catch { /* ignore */ }
}

/** Seconds until the next key becomes available (0 if one is already free) */
function secondsUntilNextKey(): number {
  const now = Date.now();
  if (KEY_REGISTRY.some(k => !k.isBlocked || now > k.blockedUntil)) return 0;
  const earliest = Math.min(...KEY_REGISTRY.map(k => k.blockedUntil));
  return Math.max(0, Math.ceil((earliest - now) / 1000));
}

// ─────────────────────────────────────────────
// Cache
// ─────────────────────────────────────────────

interface CacheEntry {
  response: string;
  timestamp: number;
}
const MEMORY_CACHE = new Map<string, CacheEntry>();
const CACHE_PREFIX = "thay_nam_ai_cache_";
const MAX_CACHE_ENTRIES = 50;
const CACHE_TTL_MS = 2_592_000_000; // 30 days

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
  const mem = MEMORY_CACHE.get(key);
  if (mem) return mem.response;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const entry: CacheEntry = JSON.parse(raw);
      if (Date.now() - entry.timestamp < CACHE_TTL_MS) {
        MEMORY_CACHE.set(key, entry);
        return entry.response;
      }
      localStorage.removeItem(key);
    }
  } catch { /* ignore */ }
  return null;
}

function saveResponseToCache(prompt: string, systemInstruction: string, response: string) {
  const key = getCacheKey(prompt, systemInstruction);
  const entry: CacheEntry = { response, timestamp: Date.now() };
  MEMORY_CACHE.set(key, entry);
  try {
    localStorage.setItem(key, JSON.stringify(entry));
    const cacheKeys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(CACHE_PREFIX)) cacheKeys.push(k);
    }
    if (cacheKeys.length > MAX_CACHE_ENTRIES) {
      const parsed = cacheKeys.map(k => {
        try {
          const item = JSON.parse(localStorage.getItem(k) || "");
          return { key: k, timestamp: item.timestamp || 0 };
        } catch { return { key: k, timestamp: 0 }; }
      });
      parsed.sort((a, b) => a.timestamp - b.timestamp);
      parsed.slice(0, parsed.length - MAX_CACHE_ENTRIES).forEach(item => localStorage.removeItem(item.key));
    }
  } catch { /* ignore */ }
}

// ─────────────────────────────────────────────
// HTTP helpers
// ─────────────────────────────────────────────

const parseRetryDelayMs = (value: unknown): number | undefined => {
  if (typeof value !== "string") return undefined;
  const seconds = Number.parseFloat(value.replace(/s$/i, ""));
  return Number.isFinite(seconds) && seconds > 0 ? Math.ceil(seconds * 1000) : undefined;
};

async function executeGeminiRequest(
  apiKey: string,
  prompt: string,
  systemInstruction: string,
  model: string
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 4000 },
      }),
    });
  } catch (err: any) {
    throw new AiRequestError("Không thể kết nối tới Gemini.");
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const retryDelay = payload.error?.details?.find?.((d: { retryDelay?: string }) => d.retryDelay)?.retryDelay;
    throw new AiRequestError(
      `Gemini trả về lỗi ${response.status}.`,
      response.status,
      parseRetryDelayMs(retryDelay)
    );
  }

  const data = await response.json();
  const result = data.candidates?.[0]?.content?.parts
    ?.map((p: { text?: string }) => p.text || "")
    .join("\n")
    .trim();

  if (!result) throw new AiRequestError("Gemini không trả về nội dung hợp lệ.");
  return result;
}


// ─────────────────────────────────────────────
// Main entry point
// ─────────────────────────────────────────────

const configModel = String(import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash").trim();
// Fallback models theo thứ tự ưu tiên: 2.5-flash → 2.0-flash (khi 2.5 overload/503)
const fallbackModels = ["gemini-2.5-flash", "gemini-2.0-flash"];
const MODELS = [configModel, ...fallbackModels.filter(m => m !== configModel)];

export async function askThayNamAI(prompt: string, systemInstruction: string): Promise<string> {
  // ── Step 0: Cache hit → free, instant
  const cached = getCachedResponse(prompt, systemInstruction);
  if (cached !== null) {
    console.log("[Thầy Nam AI] Cache hit — không tiêu tốn API Key.");
    return cached;
  }

  console.log(
    `[Thầy Nam AI] Khởi chạy request. Registry: ${KEY_REGISTRY.length} key(s). ` +
    `Available: ${KEY_REGISTRY.filter(k => !k.isBlocked || Date.now() > k.blockedUntil).length}`
  );

  let lastError: unknown = null;

  // ── Helper: round-robin qua TẤT CẢ key đang free
  // Dùng snapshot tại thời điểm gọi để đảm bảo mọi key đều được thử,
  // kể cả khi key trước đó hết model nhưng chưa bị block (503/404)
  async function tryAllAvailableKeys(phase: "initial" | "retry"): Promise<string | null> {
    // Lấy snapshot các key có sẵn (bao gồm cả việc tự mở block hết hạn)
    const now = Date.now();
    const candidates: ApiKeyStatus[] = [];
    for (const k of KEY_REGISTRY) {
      if (k.isBlocked && now > k.blockedUntil) {
        k.isBlocked = false;
        k.blockedUntil = 0;
        console.log(`[Thầy Nam AI] Key ${k.label} đã hết thời gian phạt — mở block.`);
      }
      if (!k.isBlocked) candidates.push(k);
    }

    // Thử từng key trong snapshot (for..of đảm bảo Key1 luôn được thử dù Key2 hết model)
    for (const current of candidates) {
      if (current.isBlocked) continue; // bỏ qua nếu bị block trong vòng này

      for (const model of MODELS) {
        try {
          console.log(`[Thầy Nam AI] ${phase === "retry" ? "🔄 Retry" : "Thử"} Key ${current.label} — Model: ${model}`);
          const result = await executeGeminiRequest(current.key, prompt, systemInstruction, model);
          console.log(`[Thầy Nam AI] ✅ Thành công với Key ${current.label} — Model: ${model}`);
          saveResponseToCache(prompt, systemInstruction, result);
          return result;
        } catch (error: any) {
          console.error(`[Thầy Nam AI] ❌ Key ${current.label} / Model ${model}:`, error.message ?? error);
          lastError = error;

          if (error instanceof AiRequestError) {
            if (error.status === 429) {
              const cooldownMs = error.retryAfterMs ? error.retryAfterMs + 5_000 : 65_000;
              console.warn(`[Thầy Nam AI] Key ${current.label} bị 429. Block ${Math.round(cooldownMs / 1000)}s — chuyển key.`);
              blockKey(current, cooldownMs);
              break; // thoát vòng model, for..of tự chuyển sang key tiếp theo
            }
            // 503, 404, 5xx khác hoặc lỗi kết nối → thử model tiếp theo trên cùng key
          }
        }
      }
      // Hết model trên key này → for..of tự chuyển sang key tiếp theo trong candidates
    }
    return null;
  }

  // ── Step 1: Thử tất cả key đang free ngay lập tức
  // Ghi nhận số key có sẵn TRƯỚC khi Step 1 chạy để quyết định có nên auto-wait không
  const availableBeforeStep1 = KEY_REGISTRY.filter(
    k => !k.isBlocked || Date.now() > k.blockedUntil
  ).length;

  const result1 = await tryAllAvailableKeys("initial");
  if (result1 !== null) return result1;

  // ── Step 2: Auto-wait + retry
  // CHỈ auto-wait nếu keys đã bị block từ TRƯỚC khi request này bắt đầu
  // (tức là Step 1 không có key nào để thử, hoặc chờ sẽ có ích).
  // Nếu Step 1 vừa đốt hết cả 3 key → KHÔNG retry (tránh tốn thêm 3 API calls vô nghĩa)
  const AUTO_WAIT_LIMIT_S = 70;
  const waitSec = secondsUntilNextKey();

  const allJustBlocked = availableBeforeStep1 > 0 && waitSec > 0;
  if (allJustBlocked) {
    // Step 1 vừa bắn hết quota → throw ngay, không retry
    console.warn(
      `[Thầy Nam AI] Tất cả ${KEY_REGISTRY.length} key vừa bị 429 trong lần này. ` +
      `Không retry để tiết kiệm quota. Thử lại sau ~${waitSec}s.`
    );
  } else if (waitSec > 0 && waitSec <= AUTO_WAIT_LIMIT_S) {
    // Keys đã bị block từ trước → auto-wait rồi retry có ý nghĩa
    const waitMs = waitSec * 1000 + 1_000; // +1s buffer
    console.log(
      `[Thầy Nam AI] Keys đã blocked từ trước. Tự động chờ ${waitSec}s — retry TẤT CẢ key sau cooldown...`
    );
    await new Promise<void>(resolve => setTimeout(resolve, waitMs));

    const result2 = await tryAllAvailableKeys("retry");
    if (result2 !== null) return result2;
  } else if (waitSec > AUTO_WAIT_LIMIT_S) {
    console.warn(`[Thầy Nam AI] Cooldown quá dài (${waitSec}s > ${AUTO_WAIT_LIMIT_S}s). Bỏ qua auto-wait.`);
  }

  // ── Step 3: Mọi phương thức đều thất bại → throw với thông tin cooldown cho UI
  const finalWaitSec = secondsUntilNextKey();
  throw new AiRequestError(
    finalWaitSec > 0
      ? `Tất cả API key đang bị giới hạn tốc độ. Vui lòng thử lại sau ~${finalWaitSec} giây.`
      : "Không thể kết nối tới Thầy Nam AI bằng bất kỳ key hay phương thức nào.",
    429,
    undefined,
    finalWaitSec
  );
}

// ─────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────

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
      nextStep: "Thử lại sau ít phút.",
    };
  }
}
