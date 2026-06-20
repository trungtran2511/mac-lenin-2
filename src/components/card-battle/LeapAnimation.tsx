import React, { useEffect } from "react";
import { motion } from "framer-motion";

interface LeapAnimationProps {
  onComplete: () => void;
}

export const LeapAnimation: React.FC<LeapAnimationProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500); // Animation runs for 2.5 seconds
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Generate random particles
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    angle: (i * 360) / 40 + Math.random() * 20,
    distance: 120 + Math.random() * 180,
    delay: Math.random() * 0.3,
    size: 4 + Math.random() * 8,
    color: i % 2 === 0 ? "bg-amber-400" : i % 3 === 0 ? "bg-blue-400" : "bg-red-500"
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md overflow-hidden">
      {/* Screen flash white */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.6, times: [0, 0.2, 1] }}
        className="absolute inset-0 bg-white z-50 pointer-events-none"
      />

      {/* Screen shake container */}
      <motion.div
        animate={{
          x: [0, -10, 10, -8, 8, -5, 5, 0],
          y: [0, 5, -5, 4, -4, 2, -2, 0]
        }}
        transition={{ duration: 0.8 }}
        className="relative flex flex-col items-center justify-center"
      >
        {/* Core energy circle */}
        <motion.div
          initial={{ scale: 0.1, opacity: 0 }}
          animate={{
            scale: [0.1, 1.5, 30],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 blur-xl opacity-80"
        />

        {/* Text alert */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [0.5, 1.1, 1], opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "backOut" }}
          className="text-center z-10"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-amber-400 font-bold mb-2 block animate-pulse">
            Quy luật Lượng đổi - Chất đổi
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 drop-shadow-[0_5px_15px_rgba(245,158,11,0.3)] tracking-wider">
            BƯỚC NHẢY
          </h2>
          <p className="text-sm text-neutral-300 mt-4 max-w-sm mx-auto font-light leading-relaxed">
            Lượng đã tích lũy vượt điểm nút! Một hình thái và chất lượng mới đang được hình thành...
          </p>
        </motion.div>

        {/* Particles */}
        {particles.map((p) => {
          const rad = (p.angle * Math.PI) / 180;
          const x = Math.cos(rad) * p.distance;
          const y = Math.sin(rad) * p.distance;

          return (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{ x, y, scale: 0, opacity: 0 }}
              transition={{ duration: 1.2, delay: p.delay, ease: "easeOut" }}
              className={`absolute rounded-full ${p.color} z-20`}
              style={{
                width: p.size,
                height: p.size,
                boxShadow: "0 0 10px currentColor"
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
};
