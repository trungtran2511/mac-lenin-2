import React from "react";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw, Zap, Sword, HeartHandshake } from "lucide-react";
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full relative"
    >
      {/* ── BIG HERO BANNER ── */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-950/80 via-orange-950/60 to-neutral-950/90 shadow-[0_0_80px_rgba(245,158,11,0.18)] mb-6">
        {/* Glow orbs */}
        <div className="absolute -top-32 -left-20 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-10 w-64 h-64 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">

          {/* ── CARD VISUAL (left) ── */}
          <motion.div
            animate={{ y: [0, -10, 0], rotateZ: [0, 1, -1, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="shrink-0 relative"
          >
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 blur-xl opacity-50 scale-110" />

            <div className="relative w-56 h-80 rounded-[24px] border-2 border-amber-300/60 bg-gradient-to-br from-amber-400 via-orange-600 to-red-700 p-6 flex flex-col justify-between shadow-[0_20px_60px_rgba(245,158,11,0.4)] overflow-hidden">
              {/* Holographic shimmer overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-200/80 to-transparent pointer-events-none" />

              {/* Card header */}
              <div className="flex justify-between items-center z-10">
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-widest bg-black/40 text-amber-100 backdrop-blur-sm border border-amber-200/20">
                  HỢP ĐỀ
                </span>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5 text-amber-100 drop-shadow-[0_0_6px_rgba(253,230,138,0.8)]" />
                </motion.div>
              </div>

              {/* Card center */}
              <div className="flex flex-col items-center text-center gap-3 z-10">
                <motion.div
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="p-4 rounded-full bg-black/30 border border-amber-200/30 shadow-[0_0_20px_rgba(253,230,138,0.3)]"
                >
                  <Sparkles className="w-10 h-10 text-amber-100" />
                </motion.div>
                <h4
                  className="text-xl font-black text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  {synthesisCard.name}
                </h4>
              </div>

              {/* Card footer */}
              <p className="text-[12px] text-amber-50/85 text-center leading-snug font-normal border-t border-white/15 pt-3 z-10">
                {synthesisCard.description}
              </p>
            </div>
          </motion.div>

          {/* ── HERO TEXT (right) ── */}
          <div className="flex flex-col gap-5 text-center md:text-left flex-1">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              <span className="text-sm tracking-[0.25em] uppercase text-amber-400 font-extrabold">
                Bước Nhảy Biện Chứng Thành Công
              </span>
            </div>

            <h2
              className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight drop-shadow-[0_4px_12px_rgba(245,158,11,0.3)]"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              CHẤT MỚI:{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-red-300">
                {synthesisCard.name}
              </span>
            </h2>

            <p className="text-[19px] text-amber-100/70 leading-relaxed font-light max-w-xl mx-auto md:mx-0">
              {synthesisCard.description}
            </p>

            <button
              onClick={onReset}
              className="self-center md:self-start mt-2 flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/18 text-white border border-white/20 hover:border-white/40 text-base font-bold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm shadow-lg"
            >
              <RefreshCw className="w-4 h-4" />
              Vòng biện chứng mới
            </button>
          </div>
        </div>
      </div>

      {/* ── DIALECTICAL BREAKDOWN CARDS ── */}
      {synthesisCard.struggleDetail && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {/* Mâu thuẫn */}
          <div className="relative rounded-2xl border border-red-500/25 bg-red-950/20 p-6 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-400/60 to-transparent" />
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-red-500/20 border border-red-500/30">
                <Sword className="w-4 h-4 text-red-400" />
              </div>
              <span className="font-extrabold text-red-400 text-[15px] uppercase tracking-wide">
                Mặt Đấu Tranh
              </span>
            </div>
            <p className="text-[18px] text-neutral-300 leading-relaxed font-light">
              {synthesisCard.struggleDetail}
            </p>
          </div>

          {/* Thống nhất */}
          <div className="relative rounded-2xl border border-blue-500/25 bg-blue-950/20 p-6 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-blue-500/20 border border-blue-500/30">
                <HeartHandshake className="w-4 h-4 text-blue-400" />
              </div>
              <span className="font-extrabold text-blue-400 text-[15px] uppercase tracking-wide">
                Mặt Thống Nhất
              </span>
            </div>
            <p className="text-[18px] text-neutral-300 leading-relaxed font-light">
              {synthesisCard.unityDetail}
            </p>
          </div>

          {/* Kết quả */}
          <div className="relative rounded-2xl border border-emerald-500/25 bg-emerald-950/20 p-6 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-extrabold text-emerald-400 text-[15px] uppercase tracking-wide">
                Kết Quả — Chất Mới
              </span>
            </div>
            <p className="text-[18px] text-neutral-200 font-semibold leading-relaxed">
              {synthesisCard.outcomeDetail}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
