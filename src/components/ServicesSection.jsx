import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function ServicesSection() {
  return (
    <section className="bg-black py-28 md:py-40 px-6 flex justify-center overflow-hidden relative">
      {/* Subtle radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-6xl space-y-16 relative z-10">
        
        {/* Header Row */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex items-end justify-between border-b border-white/10 pb-6"
        >
          <h2 className="text-3xl md:text-5xl text-white tracking-tight">
            Trụ Cột Lý Luận Cốt Lõi
          </h2>
          <span className="text-white/40 text-sm hidden md:block uppercase tracking-widest font-mono">
            Kinh Tế Học Mác-Lênin
          </span>
        </motion.div>

        {/* Two-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          
          {/* Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="liquid-glass rounded-3xl overflow-hidden group border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            {/* Card Video Area */}
            <div className="aspect-video overflow-hidden relative">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                preload="auto"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              >
                <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Card Body */}
            <div className="p-6 md:p-8 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="uppercase tracking-widest text-white/40 text-xs font-mono">
                  LÝ THUYẾT SẢN XUẤT
                </span>
                <div className="liquid-glass rounded-full p-2.5 text-white border border-white/10 group-hover:bg-white group-hover:text-black transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-white text-xl md:text-2xl mb-3 tracking-tight">
                Hàng Hóa & Giá Trị
              </h3>
              <p className="text-white/50 text-xs md:text-sm leading-relaxed">
                Thấu hiểu cách lao động cụ thể và lao động trừu tượng tạo ra hàng hóa, và quy luật giá trị điều tiết cơ chế trao đổi trên thị trường.
              </p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="liquid-glass rounded-3xl overflow-hidden group border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            {/* Card Video Area */}
            <div className="aspect-video overflow-hidden relative">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                preload="auto"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              >
                <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Card Body */}
            <div className="p-6 md:p-8 relative">
              <div className="flex items-center justify-between mb-4">
                <span className="uppercase tracking-widest text-white/40 text-xs font-mono">
                  CÔNG BẰNG PHÂN PHỐI
                </span>
                <div className="liquid-glass rounded-full p-2.5 text-white border border-white/10 group-hover:bg-white group-hover:text-black transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-white text-xl md:text-2xl mb-3 tracking-tight">
                Phân Phối Lại Thặng Dư
              </h3>
              <p className="text-white/50 text-xs md:text-sm leading-relaxed">
                Phân tích thể chế về cách cấu trúc của cải quốc gia nhằm cân bằng giữa tăng trưởng công nghiệp và công bằng xã hội dân chủ.
              </p>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
