import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw, MessageSquareCode } from "lucide-react";
import type { SynthesisCard } from "../../lib/cardBattleTypes";
import { askThayNamAI } from "../../lib/ai";

interface SynthesisResultProps {
  synthesisCard: SynthesisCard;
  thesisName: string;
  antithesisName: string;
  onReset: () => void;
}

export const SynthesisResult: React.FC<SynthesisResultProps> = ({
  synthesisCard,
  thesisName,
  antithesisName,
  onReset
}) => {
  const [commentary, setCommentary] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function getAiCommentary() {
      const systemInstruction = `Bạn là Thầy Nam AI, giảng viên Kinh tế chính trị Mác - Lênin. 
Hãy bình luận ngắn gọn (2-3 câu), dí dỏm về sự phủ định biện chứng và sự dung hợp giữa hai yếu tố đối lập để tạo ra chất mới (sự phát triển). 
Sử dụng ngôn ngữ Gen Z thân thiện, hài hước, chèn emoji để kích thích tư duy sáng tạo của sinh viên.`;

      const prompt = `Hai mặt đối lập:
- Đề xuất (Thesis): "${thesisName}"
- Phản đề (Antithesis): "${antithesisName}"
Dung hợp thành Chất mới (Synthesis): "${synthesisCard.name}" (${synthesisCard.description})`;

      try {
        const response = await askThayNamAI(prompt, systemInstruction);
        if (active) {
          setCommentary(response);
          setIsLoading(false);
        }
      } catch (err) {
        if (active) {
          setCommentary("Chất mới đã được hình thành! Thầy Nam AI đang bận chấm bài thi, nhưng chúc mừng bạn đã thực hiện Bước Nhảy biện chứng thành công!");
          setIsLoading(false);
        }
      }
    }

    getAiCommentary();
    return () => {
      active = false;
    };
  }, [synthesisCard, thesisName, antithesisName]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-6 border border-white/10 bg-neutral-900/60 backdrop-blur-md rounded-3xl w-full max-w-xl mx-auto shadow-2xl relative overflow-hidden"
    >
      {/* Decorative gradient light */}
      <div className="absolute -top-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: "3s" }} />
        <span className="text-xs tracking-[0.3em] uppercase text-amber-400 font-extrabold">Dung Hợp Thành Công</span>
      </div>

      <h3 className="text-xl md:text-2xl font-black text-white text-center leading-tight mb-6">
        CHẤT MỚI: {synthesisCard.name}
      </h3>

      {/* Main synthesized card view */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="w-48 h-64 rounded-2xl border-2 border-amber-400/50 bg-gradient-to-br from-amber-500/80 via-orange-600/80 to-red-700/80 p-5 flex flex-col justify-between shadow-[0_10px_30px_rgba(245,158,11,0.25)] relative group"
      >
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />

        <div className="flex justify-between items-center">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/30 text-amber-200">
            Hợp đề (Synthesis)
          </span>
          <Sparkles className="w-4 h-4 text-amber-200" />
        </div>

        <div className="flex flex-col items-center text-center gap-3 my-auto">
          <div className="p-3 rounded-full bg-black/25">
            <Sparkles className="w-8 h-8 text-amber-200" />
          </div>
          <h4 className="text-base font-extrabold text-white leading-tight px-1">{synthesisCard.name}</h4>
        </div>

        <p className="text-[11px] text-amber-50/90 text-center leading-snug font-normal border-t border-white/10 pt-2">
          {synthesisCard.description}
        </p>
      </motion.div>

      {/* AI Commentary Bubble */}
      <div className="mt-8 w-full border-t border-white/10 pt-5">
        <div className="flex items-center gap-2 mb-3 text-neutral-400">
          <MessageSquareCode className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-bold text-neutral-300">Lời bình từ Thầy Nam AI:</span>
        </div>

        <div className="bg-black/30 rounded-2xl p-4 border border-white/5 min-h-[80px] flex items-center justify-center">
          {isLoading ? (
            <div className="flex items-center gap-1.5 py-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          ) : (
            <p className="text-sm md:text-base text-neutral-200 leading-relaxed font-normal text-left whitespace-pre-line w-full">
              {commentary}
            </p>
          )}
        </div>
      </div>

      {/* Detailed Dialectical Breakdown */}
      {synthesisCard.struggleDetail && (
        <div className="mt-6 w-full space-y-3 border-t border-white/10 pt-5 text-xs md:text-sm text-neutral-300">
          <h4 className="font-extrabold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider text-xs">
            🍀 Phân Tích Bản Chất Biện Chứng
          </h4>
          
          <div className="space-y-3 bg-neutral-950/50 p-4.5 rounded-2xl border border-white/5 text-left">
            <div>
              <span className="font-extrabold text-red-400 text-xs block mb-1">🔥 MẶT ĐẤU TRANH (MÂU THUẪN):</span>
              <p className="text-neutral-300 text-xs leading-relaxed font-light">{synthesisCard.struggleDetail}</p>
            </div>
            
            <div className="border-t border-white/5 pt-3">
              <span className="font-extrabold text-blue-400 text-xs block mb-1">🤝 MẶT THỐNG NHẤT (ĐỒNG HÀNH):</span>
              <p className="text-neutral-300 text-xs leading-relaxed font-light">{synthesisCard.unityDetail}</p>
            </div>
            
            <div className="border-t border-white/5 pt-3">
              <span className="font-extrabold text-emerald-400 text-xs block mb-1">⚡ KẾT QUẢ (CHẤT MỚI):</span>
              <p className="text-neutral-200 text-xs font-medium leading-relaxed">{synthesisCard.outcomeDetail}</p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onReset}
        className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/10 hover:border-white/20 text-sm font-bold transition-all hover:scale-105 active:scale-95"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Vòng biện chứng mới
      </button>
    </motion.div>
  );
};
