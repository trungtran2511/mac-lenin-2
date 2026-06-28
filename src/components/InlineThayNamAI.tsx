import React, { useState } from "react";
import { Bot, Send, Loader2, RefreshCw } from "lucide-react";
import { askStructuredThayNam } from "../lib/ai";
import type { AiContextRequest, AiContextResponse } from "../lib/chapterToolTypes";

interface InlineThayNamAIProps {
  chapterId: number;
  mode: "quiz_explain" | "salary_explain" | "chapter_tool_explain";
  currentStateSummary: string;
  curriculumContext: string;
  placeholderText?: string;
  titleText?: string;
}

export function InlineThayNamAI({
  chapterId,
  mode,
  currentStateSummary,
  curriculumContext,
  placeholderText = "Đồng chí muốn hỏi thêm Thầy Nam AI điều gì về kết quả này?",
  titleText = "Tham vấn Thầy Nam AI (Giảng viên học thuật)"
}: InlineThayNamAIProps) {
  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState<AiContextResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    const requestPayload: AiContextRequest = {
      mode,
      chapterId,
      userQuestion: question,
      currentStateSummary,
      curriculumContext,
      expectedFormat: "JSON object with answer, keyConcepts, and nextStep keys"
    };

    try {
      const response = await askStructuredThayNam(requestPayload);
      setAiResponse(response);
    } catch (err) {
      setAiResponse({
        answer: `Lỗi kết nối AI: ${(err as Error).message}`,
        keyConcepts: [],
        nextStep: "Thử lại sau"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setQuestion("");
    setAiResponse(null);
  };

  return (
    <div className="mt-8 border border-white/10 bg-white/[0.02] backdrop-blur-md rounded-2xl p-5 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide">{titleText}</h4>
            <p className="text-xs text-white/40 font-mono">Chương {chapterId} • Inline Context Panel</p>
          </div>
        </div>
        {aiResponse && (
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
            title="Hỏi câu khác"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Answer Area */}
      {aiResponse && (
        <div className="space-y-4 animate-fade-rise">
          {/* Main Answer */}
          <div className="bg-neutral-900/40 border border-white/5 rounded-xl p-4 text-sm md:text-base text-white/90 leading-relaxed font-normal whitespace-pre-line">
            {aiResponse.answer}
          </div>

          {/* Key Concepts Tags */}
          {aiResponse.keyConcepts && aiResponse.keyConcepts.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-mono font-bold text-white/35 mr-1">Thuật ngữ:</span>
              {aiResponse.keyConcepts.map((concept, index) => (
                <span
                  key={index}
                  className="px-2.5 py-0.5 text-xs font-medium bg-white/5 border border-white/10 text-white/60 rounded-md"
                >
                  {concept}
                </span>
              ))}
            </div>
          )}

          {/* Next Step Suggestion */}
          {aiResponse.nextStep && (
            <div className="text-sm text-emerald-400/85 bg-emerald-500/5 border border-emerald-500/10 rounded-lg px-3 py-2 flex items-start gap-2">
              <span className="font-bold text-emerald-400">💡 Gợi ý tiếp theo:</span>
              <span className="italic">{aiResponse.nextStep}</span>
            </div>
          )}
        </div>
      )}

      {/* Input Form */}
      {!aiResponse && (
        <form onSubmit={handleAsk} className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={placeholderText}
            disabled={isLoading}
            className="flex-1 bg-neutral-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:bg-white/40 border-none cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-black" />
            ) : (
              <>
                <span>Hỏi</span>
                <Send className="w-3.5 h-3.5 text-black" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
