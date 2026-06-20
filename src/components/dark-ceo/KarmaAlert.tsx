import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { ShieldAlert, Zap } from "lucide-react";

interface KarmaAlertProps {
  eventText: string;
  sourceChoiceText: string;
  onClose: () => void;
}

export const KarmaAlert: React.FC<KarmaAlertProps> = ({ eventText, sourceChoiceText, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4500); // Popup stays for 4.5 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  const alertContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md">
      {/* Screen flash red */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.5, times: [0, 0.2, 1] }}
        className="absolute inset-0 bg-red-950/40 z-[10000] pointer-events-none"
      />

      {/* Vibration box */}
      <motion.div
        animate={{
          x: [0, -12, 12, -10, 10, -6, 6, 0],
          y: [0, 8, -8, 6, -6, 3, -3, 0]
        }}
        transition={{ duration: 0.6 }}
        className="border-2 border-red-500/80 bg-neutral-900 rounded-3xl p-6 md:p-8 max-w-lg mx-4 text-center shadow-[0_0_30px_rgba(239,68,68,0.3)] relative z-10 overflow-hidden"
      >
        {/* Glowing backdrop circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-center mb-4">
          <div className="p-4 bg-red-500/20 rounded-full border border-red-500/30 animate-pulse">
            <Zap className="w-8 h-8 text-red-500 stroke-[2.2]" />
          </div>
        </div>

        <span className="text-[10px] tracking-[0.4em] uppercase text-red-400 font-extrabold mb-1.5 block">
          Luật Nhân Quả: Phủ định của Phủ định
        </span>
        <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-4 flex items-center justify-center gap-2">
          <ShieldAlert className="w-6 h-6 text-red-500" />
          QUẢ BÁO DOANH NGHIỆP
        </h2>

        {/* The Karma impact explanation */}
        <div className="bg-black/40 border border-white/5 rounded-2xl p-4 text-left my-4">
          <p className="text-xs md:text-sm text-red-200 leading-relaxed font-semibold">
            {eventText}
          </p>
        </div>

        {/* Source of the karma */}
        <div className="text-[10px] text-neutral-500 text-center leading-normal border-t border-white/5 pt-4">
          <span className="font-bold text-neutral-400 block mb-1">Nguồn gốc sự việc:</span>
          Hậu quả từ quyết định trước đó của bạn: <span className="italic text-neutral-400">"{sourceChoiceText}"</span>
        </div>

        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all hover:scale-105 active:scale-95"
        >
          Xác nhận hậu quả
        </button>
      </motion.div>
    </div>
  );

  return createPortal(alertContent, document.body);
};
