import React from "react";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw } from "lucide-react";
import type { SynthesisCard } from "../../lib/cardBattleTypes";

interface SynthesisResultProps {
  synthesisCard: SynthesisCard;
  thesisName: string;
  antithesisName: string;
  onReset: () => void;
}

export const SynthesisResult: React.FC<SynthesisResultProps> = ({
  synthesisCard,
  onReset
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 md:p-10 border border-white/10 bg-neutral-900/60 backdrop-blur-md rounded-3xl w-full shadow-2xl relative overflow-hidden"
    >
      {/* Decorative gradient light */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6 mb-6 relative z-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: "3s" }} />
            <span className="text-xs tracking-[0.3em] uppercase text-amber-400 font-extrabold">Dung Hợp Thành Công</span>
          </div>
          <h3
            className="text-3xl md:text-4xl text-white leading-tight"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            CHẤT MỚI: {synthesisCard.name}
          </h3>
        </div>

        <button
          onClick={onReset}
          className="self-start md:self-auto flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/10 hover:border-white/20 text-sm font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Vòng biện chứng mới
        </button>
      </div>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 items-start relative z-10">
        {/* Left: floating synthesis card */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="w-48 mx-auto md:mx-0 h-64 rounded-2xl border-2 border-amber-400/50 bg-gradient-to-br from-amber-500/80 via-orange-600/80 to-red-700/80 p-5 flex flex-col justify-between shadow-[0_10px_30px_rgba(245,158,11,0.25)] relative group shrink-0"
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

        {/* Right: Dialectical Breakdown */}
        {synthesisCard.struggleDetail && (
          <div className="space-y-4 text-left">
            <h4 className="font-extrabold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider text-[16px]">
              🍀 Phân Tích Bản Chất Biện Chứng
            </h4>

            <div className="space-y-4 bg-neutral-950/50 p-5 rounded-2xl border border-white/5">
              <div>
                <span className="font-extrabold text-red-400 text-[15px] block mb-1.5">🔥 MẶT ĐẤU TRANH (MÂU THUẪN):</span>
                <p className="text-[18px] text-neutral-300 leading-relaxed font-light">{synthesisCard.struggleDetail}</p>
              </div>

              <div className="border-t border-white/5 pt-4">
                <span className="font-extrabold text-blue-400 text-[15px] block mb-1.5">🤝 MẶT THỐNG NHẤT (ĐỒNG HÀNH):</span>
                <p className="text-[18px] text-neutral-300 leading-relaxed font-light">{synthesisCard.unityDetail}</p>
              </div>

              <div className="border-t border-white/5 pt-4">
                <span className="font-extrabold text-emerald-400 text-[15px] block mb-1.5">⚡ KẾT QUẢ (CHẤT MỚI):</span>
                <p className="text-[18px] text-neutral-200 font-medium leading-relaxed">{synthesisCard.outcomeDetail}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
