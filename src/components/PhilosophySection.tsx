import React from "react";
import { motion } from "framer-motion";

export default function PhilosophySection() {
  return (
    <section className="bg-background py-28 md:py-40 px-6 flex justify-center overflow-hidden">
      <div className="w-full max-w-6xl space-y-16 md:space-y-24">
        
        {/* Heading */}
        <motion.h2 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl text-white tracking-tight"
        >
          Cơ Chế Thị Trường{" "}
          <span className="font-serif italic text-white/40">x</span>{" "}
          Định Hướng XHCN
        </motion.h2>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          
          {/* Left: Video */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl overflow-hidden aspect-[4/3] relative border border-white/10 shadow-xl shadow-white/5 bg-stone-900"
          >
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            >
              <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4" type="video/mp4" />
            </video>
          </motion.div>

          {/* Right: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8 flex flex-col justify-center"
          >
            
            {/* Block 1 */}
            <div className="space-y-3">
              <span className="text-white/40 text-xs tracking-widest uppercase block">
                TỔNG HỢP BIỆN CHỨNG
              </span>
              <p className="text-white/70 text-sm md:text-base leading-relaxed">
                Nền kinh tế thị trường định hướng xã hội chủ nghĩa là một tất yếu lịch sử. Nó hòa hợp hiệu quả năng động của sản xuất hàng hóa với các nguyên tắc cốt lõi của công bằng xã hội, phúc lợi tập thể và sự điều tiết của Nhà nước.
              </p>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-white/10" />

            {/* Block 2 */}
            <div className="space-y-3">
              <span className="text-white/40 text-xs tracking-widest uppercase block">
                TĂNG TRƯỞNG LẤY CON NGƯỜI LÀM TRUNG TÂM
              </span>
              <p className="text-white/70 text-sm md:text-base leading-relaxed">
                Khác với chủ nghĩa tư bản thuần túy chỉ hướng tới tích lũy lợi nhuận, việc tích hợp các lý tưởng xã hội chủ nghĩa đảm bảo giá trị thặng dư kinh tế được tái đầu tư vào hạ tầng, giáo dục và phát triển con người, ngăn chặn sự tha hóa tột cùng.
              </p>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
