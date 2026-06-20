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

async function executeGeminiRequest(apiKey: string, prompt: string, systemInstruction: string): Promise<string> {
  const model = String(import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash").trim();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }]
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
  const keys = [
    String(import.meta.env.VITE_GEMINI_API_KEY || "").trim(),
    String(import.meta.env.VITE_GEMINI_API_KEY1 || "").trim(),
    String(import.meta.env.VITE_GEMINI_API_KEY2 || "").trim()
  ].filter((key, index, allKeys) => key && allKeys.indexOf(key) === index);

  if (keys.length === 0) {
    throw new AiRequestError("Chưa cấu hình Gemini API key.");
  }

  const now = Date.now();
  const availableKeys = keys.filter(key => (quotaCooldownByKey.get(key) || 0) <= now);
  if (availableKeys.length === 0) {
    throw new AiRequestError("Các Gemini API key đang trong thời gian chờ quota.", 429);
  }

  let latestError: unknown;
  for (const key of availableKeys) {
    try {
      return await executeGeminiRequest(key, prompt, systemInstruction);
    } catch (error) {
      latestError = error;
      if (error instanceof AiRequestError && error.status === 429) {
        quotaCooldownByKey.set(key, Date.now() + (error.retryAfterMs || 60_000));
      }
      if (!isFallbackEligible(error)) throw error;
    }
  }

  throw latestError instanceof Error
    ? latestError
    : new AiRequestError("Không thể gọi Gemini bằng các API key đã cấu hình.");
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
