import { motion } from "framer-motion";

export default function FeaturedVideoSection() {
  return (
    <section className="bg-background pt-6 md:pt-10 pb-20 md:pb-32 px-6 flex justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="w-full max-w-6xl rounded-3xl overflow-hidden aspect-video relative border border-white/10 shadow-2xl shadow-white/5"
      >
        {/* Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4" type="video/mp4" />
        </video>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Bottom Overlay Content */}
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 z-10">
          
          {/* Left: Glass Card */}
          <div className="liquid-glass rounded-2xl p-6 md:p-8 max-w-md border border-white/10">
            <span className="text-white/50 text-xs tracking-widest uppercase mb-3 block">
              BẢN CHẤT CỦA TƯ BẢN
            </span>
            <p className="text-white text-xs md:text-sm leading-relaxed">
              "Tư bản là lao động đã chết, giống như ma cà rồng, nó chỉ sống nhờ hút lao động sống, và càng sống khỏe khi càng hút được nhiều lao động. Bí mật của giá trị thặng dư nằm ở những giờ sáng tạo không được trả công của con người."
            </p>
          </div>

          {/* Right: Action Button */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="liquid-glass rounded-full px-8 py-3 text-white text-xs md:text-sm font-medium hover:bg-white/5 transition-colors duration-200 border border-white/10"
          >
            Nghiên Cứu Bộ Tư Bản
          </motion.button>

        </div>
      </motion.div>
    </section>
  );
}
