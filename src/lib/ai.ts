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
    { key: String(import.meta.env.VITE_GEMINI_API_KEY2 || "").trim(), label: "Key 3 (VITE_GEMINI_API_KEY2)" },
    { key: String(import.meta.env.VITE_GEMINI_API_KEY1 || "").trim(), label: "Key 2 (VITE_GEMINI_API_KEY1)" },
    { key: String(import.meta.env.VITE_GEMINI_API_KEY  || "").trim(), label: "Key 1 (VITE_GEMINI_API_KEY)"  },
  ];

  // De-duplicate
  const seen = new Set<string>();
  const unique = rawKeys.filter(({ key }) => key && !seen.has(key) && seen.add(key));

  // Restore persisted cooldowns so page-refresh doesn't reset them
  let persisted: Record<string, number> = {};
  try {
    const raw = localStorage.getItem(COOLDOWN_LS_KEY);
    persisted = raw ? JSON.parse(raw) : {};
  } catch { /* ignore */ }

  const now = Date.now();
  return unique.map(({ key, label }) => {
    const blockedUntil = persisted[key] || 0;
    return {
      key,
      label,
      isBlocked: now < blockedUntil,
      blockedUntil,
    };
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
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12_000);

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 4000 },
      }),
    });
  } catch (err: any) {
    if (err.name === "AbortError") throw new AiRequestError("Kết nối tới Gemini bị quá thời gian (Timeout).", 408);
    throw new AiRequestError("Không thể kết nối tới Gemini.");
  } finally {
    clearTimeout(timeoutId);
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

async function executeServerProxyRequest(
  prompt: string,
  systemInstruction: string,
  model: string,
  blockedKeys?: string[]
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12_000);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt },
        ],
        cooldownKeys: blockedKeys,
      }),
    });

    if (!response.ok) throw new AiRequestError(`Server returned error ${response.status}`, response.status);

    const data = await response.json();
    const result =
      data.choices?.[0]?.message?.content ||
      data.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || "").join("").trim();

    if (!result) throw new AiRequestError("No valid content returned from server proxy");
    return result;
  } catch (err: any) {
    if (err.name === "AbortError") throw new AiRequestError("Yêu cầu tới Server Proxy bị quá thời gian (Timeout).", 408);
    if (err instanceof AiRequestError) throw err;
    throw new AiRequestError(err.message || "Không thể kết nối tới Server Proxy.");
  } finally {
    clearTimeout(timeoutId);
  }
}

// ─────────────────────────────────────────────
// Main entry point
// ─────────────────────────────────────────────

const configModel = String(import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash").trim();
const fallbackModels = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
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

  // ── Step 1: Round-robin qua các key còn sạch
  // getAvailableKey() tự un-block key hết hạn cooldown rồi trả về key đầu tiên free
  let keyEntry = getAvailableKey();
  while (keyEntry !== null) {
    const entry = keyEntry; // capture for closure clarity

    // Với mỗi key, chỉ thử model đầu tiên trước.
    // Chỉ fallback sang model khác nếu lỗi không phải 429/408 (tức là lỗi của model, không phải key).
    for (const model of MODELS) {
      try {
        console.log(`[Thầy Nam AI] Thử Key ${entry.label} — Model: ${model}`);
        const result = await executeGeminiRequest(entry.key, prompt, systemInstruction, model);
        console.log(`[Thầy Nam AI] ✅ Thành công với Key ${entry.label} — Model: ${model}`);
        saveResponseToCache(prompt, systemInstruction, result);
        return result;
      } catch (error: any) {
        console.error(`[Thầy Nam AI] ❌ Key ${entry.label} / Model ${model}:`, error.message ?? error);
        lastError = error;

        if (error instanceof AiRequestError) {
          if (error.status === 429) {
            // Rate limit của KEY → block key, chuyển sang key tiếp theo ngay
            const cooldownMs = error.retryAfterMs ? error.retryAfterMs + 5_000 : 65_000;
            console.warn(
              `[Thầy Nam AI] Key ${entry.label} bị 429. Block ${Math.round(cooldownMs / 1000)}s — chuyển key.`
            );
            blockKey(entry, cooldownMs);
            break; // thoát vòng model, thử key tiếp theo
          }

          if (error.status === 408) {
            // Timeout → block ngắn rồi chuyển key
            console.warn(`[Thầy Nam AI] Key ${entry.label} timeout. Block 30s — chuyển key.`);
            blockKey(entry, 30_000);
            break;
          }

          // Lỗi 4xx khác (key hỏng, model bị tắt…) → thử model tiếp theo trên cùng key
          // (vòng for tự tiếp tục)
        }
      }
    }

    // Lấy key tiếp theo (getAvailableKey bỏ qua key vừa bị block)
    keyEntry = getAvailableKey();
  }

  // ── Step 2: Tất cả client key đang bị block
  // Nếu thời gian chờ ngắn (≤ AUTO_WAIT_LIMIT_S), tự động đợi key sớm nhất thay vì
  // bắt user phải bấm lại thủ công (tránh leo thang retryDelay từ Gemini).
  const AUTO_WAIT_LIMIT_S = 70;
  const waitSec = secondsUntilNextKey();

  if (waitSec > 0 && waitSec <= AUTO_WAIT_LIMIT_S) {
    const waitMs = waitSec * 1000 + 1_000; // +1s buffer
    console.log(
      `[Thầy Nam AI] Tất cả key đang block. Tự động chờ ${waitSec}s cho key sớm nhất (đừng bấm lại)...`
    );
    await new Promise<void>(resolve => setTimeout(resolve, waitMs));

    // Retry với key vừa được mở block
    const retryEntry = getAvailableKey();
    if (retryEntry !== null) {
      for (const model of MODELS) {
        try {
          console.log(`[Thầy Nam AI] 🔄 Retry sau chờ — Key ${retryEntry.label} / Model: ${model}`);
          const result = await executeGeminiRequest(retryEntry.key, prompt, systemInstruction, model);
          console.log(`[Thầy Nam AI] ✅ Retry thành công với Key ${retryEntry.label}!`);
          saveResponseToCache(prompt, systemInstruction, result);
          return result;
        } catch (retryError: any) {
          console.error(`[Thầy Nam AI] ❌ Retry thất bại Key ${retryEntry.label} / Model ${model}:`, retryError.message ?? retryError);
          lastError = retryError;
          if (retryError instanceof AiRequestError && (retryError.status === 429 || retryError.status === 408)) {
            const cooldownMs = retryError.retryAfterMs ? retryError.retryAfterMs + 5_000 : 65_000;
            blockKey(retryEntry, cooldownMs);
            break;
          }
        }
      }
    }
  } else if (waitSec > AUTO_WAIT_LIMIT_S) {
    // Thời gian chờ quá dài → không auto-wait, báo user ngay
    console.warn(`[Thầy Nam AI] Cooldown quá dài (${waitSec}s > ${AUTO_WAIT_LIMIT_S}s). Bỏ qua auto-wait.`);
  }

  // ── Step 3: Thử Server Proxy như phương án dự phòng cuối
  const blockedKeys = KEY_REGISTRY.filter(k => k.isBlocked).map(k => k.key);
  const finalWaitSec = secondsUntilNextKey(); // Tính lại sau auto-wait

  console.warn(
    `[Thầy Nam AI] Tất cả ${KEY_REGISTRY.length} key vẫn bị block. ` +
    (finalWaitSec > 0 ? `Key sớm nhất sẵn sàng sau ~${finalWaitSec}s. ` : "") +
    "Gọi Server Proxy..."
  );

  try {
    const result = await executeServerProxyRequest(prompt, systemInstruction, configModel, blockedKeys);
    console.log("[Thầy Nam AI] ✅ Server Proxy thành công!");
    saveResponseToCache(prompt, systemInstruction, result);
    return result;
  } catch (serverError: any) {
    console.error("[Thầy Nam AI] Server Proxy thất bại:", serverError.message ?? serverError);
    lastError = serverError;
  }

  // ── Step 4: Mọi phương thức đều thất bại → throw với thông tin cooldown cho UI
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
