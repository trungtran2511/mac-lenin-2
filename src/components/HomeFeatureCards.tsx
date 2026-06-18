import { motion } from "framer-motion";
import { ArrowUpRight, Bot, Briefcase, Building, ShieldAlert, TrendingUp } from "lucide-react";

type HomeFeatureCardsProps = {
  onNavigate: (target: string) => void;
};

const featureCards = [
  {
    target: "surplus-value",
    eyebrow: "Lao động sinh viên",
    title: "Tính Lương & Thặng Dư Làm Thêm",
    description: "Khám phá bản chất lương làm thêm (Gia sư, Cafe, Shipper), phân tích giờ lao động tất yếu và giá trị thặng dư bị chiếm đoạt.",
    icon: Briefcase,
    visualClass: "feature-visual-labor",
  },
  {
    target: "marxist-ai",
    eyebrow: "Trợ lý học tập",
    title: "Thầy Nam AI: Ôn Thi & Gỡ Rối",
    description: "Hai chế độ: Giải đáp trắc nghiệm ôn tập triết học chuẩn giáo trình và gỡ rối nỗi uất ức đi làm bằng slang Gen Z.",
    icon: Bot,
    visualClass: "feature-visual-ai",
  },
  {
    target: "market-dynamics",
    eyebrow: "Quy luật biện chứng",
    title: "Võ Đài Biện Chứng Sinh Viên",
    description: "Giải quyết các mâu thuẫn nội tâm của sinh viên (Học vs Làm, Tiết kiệm vs Chi tiêu) bằng quy luật lượng chất.",
    icon: TrendingUp,
    visualClass: "feature-visual-market",
  },
  {
    target: "ethical-challenge",
    eyebrow: "Trò chơi đóng vai",
    title: "Thử Thách Làm Sếp: Đạo Đức vs Lợi Nhuận",
    description: "Nhập vai chủ doanh nghiệp để thấu hiểu áp lực sinh tồn của giới chủ trước quy luật cạnh tranh khốc liệt.",
    icon: ShieldAlert,
    visualClass: "feature-visual-ethics",
  },
  {
    target: "gdp-sectors",
    eyebrow: "Định hướng XHCN",
    title: "Thành Phần Kinh Tế & GDP Việt Nam",
    description: "Tìm hiểu cơ cấu kinh tế thị trường chuẩn hiến định qua vai trò dẫn dắt của Kinh tế Nhà nước.",
    icon: Building,
    visualClass: "feature-visual-gdp",
  },
];

export default function HomeFeatureCards({ onNavigate }: HomeFeatureCardsProps) {
  return (
    <section className="relative bg-background px-6 md:px-28 py-24 border-t border-white/10 flex flex-col items-center animate-fade-rise">
      <div className="max-w-6xl w-full space-y-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 border-b border-white/10 pb-6">
          <div>
            <span className="text-white/40 text-xs tracking-widest uppercase block mb-2 font-mono">
              Kinh te hoc Mac - Lenin
            </span>
            <h2 className="text-4xl md:text-6xl text-white tracking-normal" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Tru Cot Ly Luan Cot Loi
            </h2>
          </div>
          <p className="text-white/52 text-sm max-w-md leading-relaxed">
            Moi the la mot man hinh tuong tac rieng: bat dau tu khai niem trong giao trinh, roi di den vi du thuc tien de thuyet trinh de hieu hon.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {featureCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.button
                key={card.target}
                type="button"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: index * 0.05 }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => onNavigate(card.target)}
                className={`feature-gateway-card text-left ${index === 4 ? "lg:col-span-2" : ""}`}
              >
                <div className={`feature-gateway-media ${card.visualClass}`}>
                  <div className="feature-orbit" />
                  <Icon className="feature-media-icon" aria-hidden="true" />
                </div>

                <div className="feature-gateway-body">
                  <div className="flex items-center justify-between gap-4">
                    <span className="feature-gateway-eyebrow">{card.eyebrow}</span>
                    <span className="feature-gateway-action" aria-hidden="true">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
