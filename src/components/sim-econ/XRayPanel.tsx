import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Sparkles, CheckCircle } from "lucide-react";
import type { EconomicSectorExtended } from "../../lib/simEconTypes";

interface XRayPanelProps {
  sector: EconomicSectorExtended | null;
  onClose: () => void;
}

export const XRayPanel: React.FC<XRayPanelProps> = ({ sector, onClose }) => {
  return (
    <AnimatePresence>
      {sector &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-lg border border-white/10 bg-neutral-900/90 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col gap-4 text-left"
            >
              {/* Glowing top line */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: sector.color }}
              />

              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <span
                    className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10"
                    style={{ color: sector.color }}
                  >
                    X-Ray Chẩn Đoán Cơ Cấu
                  </span>
                  <h3 className="text-xl font-black text-white mt-1.5">{sector.name}</h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Constitutional Role */}
              <div className="bg-neutral-950/40 border border-white/5 rounded-2xl p-4 flex gap-3">
                <Shield className="w-5 h-5 shrink-0 mt-0.5" style={{ color: sector.color }} />
                <div>
                  <h4 className="text-base font-bold text-white">Quy định Hiến pháp & Vai trò Chủ đạo</h4>
                  <p className="text-sm text-neutral-200 mt-1.5 leading-relaxed font-normal">
                    {sector.constitutional_role}
                  </p>
                </div>
              </div>

              {/* Key Industries */}
              <div className="flex flex-col gap-3">
                <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Các Ngành Hạt Nhân & Định Hướng Phát Triển
                </h4>

                <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {sector.keyIndustries.map((ind, i) => (
                    <div
                      key={i}
                      className="p-3 bg-neutral-950/20 border border-white/5 rounded-xl flex gap-3 items-start hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="text-lg mt-0.5 select-none">{ind.icon}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-base font-bold text-white">{ind.name}</span>
                          <span
                            className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                              ind.importance === "critical"
                                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                : ind.importance === "important"
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                : "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20"
                            }`}
                          >
                            {ind.importance === "critical"
                              ? "Sống còn"
                              : ind.importance === "important"
                              ? "Then chốt"
                              : "Bổ trợ"}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-300 mt-1.5 leading-relaxed font-normal">
                          {ind.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer status */}
              <div className="flex justify-between items-center text-xs text-neutral-400 border-t border-white/5 pt-4">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  Dữ liệu chuẩn hóa theo Hiến pháp 2013
                </span>
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/10 text-sm font-bold transition-all hover:scale-105 active:scale-95"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </motion.div>,
          document.body
        )}
    </AnimatePresence>
  );
};
