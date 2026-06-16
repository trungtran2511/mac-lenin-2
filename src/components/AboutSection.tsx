import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      ref={ref}
      className="relative bg-background pt-32 md:pt-44 pb-10 md:pb-14 px-6 overflow-hidden flex flex-col items-center text-center"
    >
      {/* Subtle radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03)_0%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl relative z-10 space-y-6">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-white/40 text-sm tracking-widest uppercase block"
        >
          TRIẾT HỌC VỀ SỨC LAO ĐỘNG
        </motion.span>
        
        <motion.h2 
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight font-serif italic text-white/60"
        >
          Kẻ kiến tạo thế giới,
          <br className="hidden md:block" />
          hay quân cờ trong guồng quay của giá trị?
        </motion.h2>
      </div>
    </section>
  );
}
