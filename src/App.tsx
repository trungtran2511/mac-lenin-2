import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  ArrowRight,
  BookOpen,
  ShieldAlert,
  Award,
  ArrowUpRight,
  User,
  Bot,
  Send,
  CheckCircle2,
  AlertTriangle,
  Coffee,
  Film,
  Headphones,
  Menu,
  X,
  HelpCircle,
  TrendingUp,
  Building,
  Briefcase
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

import AboutSection from "./components/AboutSection";
import FeaturedVideoSection from "./components/FeaturedVideoSection";
import PhilosophySection from "./components/PhilosophySection";
import ServicesSection from "./components/ServicesSection";
import animeTeacher from "./assets/anime_teacher.png";

// Define strict TypeScript contracts for safety
interface JobOffer {
  id: string;
  title: string;
  salary: number;
  cost_of_living: number;
  hours_per_day: number;
  necessary_hours: number;
  surplus_hours: number;
  description: string;
}

interface TechScenario {
  id: string;
  title: string;
  labor_reduction_pct: number;
  description: string;
}

interface ChartDataPoint {
  month: string;
  original_value: number;
  market_price: number;
}

interface MarketEvent {
  id: string;
  title: string;
  description: string;
  chart_data: ChartDataPoint[];
}

interface Choice {
  text: string;
  impact: {
    profit: number;
    competitiveness: number;
    social_responsibility: number;
  };
  explanation: string;
}

interface EthicalDilemma {
  id: string;
  scenario: string;
  choices: Choice[];
}

interface EconomicSector {
  id: string;
  name: string;
  gdp_contribution: number;
  constitutional_role: string;
  description: string;
}

interface EconomyData {
  job_offers: JobOffer[];
  tech_scenarios: TechScenario[];
  market_events: MarketEvent[];
  ethical_dilemmas: EthicalDilemma[];
  economic_sectors: EconomicSector[];
}

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

const FALLBACK_DATA: EconomyData = {
  "job_offers": [
    {
      "id": "it-fresher",
      "title": "Kỹ sư IT Fresher",
      "salary": 12000000,
      "cost_of_living": 9500000,
      "hours_per_day": 8,
      "necessary_hours": 5.5,
      "surplus_hours": 2.5,
      "description": "Lương khởi điểm tốt tại Việt Nam, tuy nhiên bạn phải cống hiến giá trị thặng dư trực tiếp cho dự án phần mềm xuất khẩu của công ty."
    },
    {
      "id": "tech-driver",
      "title": "Tài xế công nghệ (Shipper/Grab)",
      "salary": 7000000,
      "cost_of_living": 8500000,
      "hours_per_day": 8,
      "necessary_hours": 7.2,
      "surplus_hours": 0.8,
      "description": "Thu nhập bấp bênh, thấp hơn chi phí sống tối thiểu để tái tạo sức lao động. Bạn chịu khấu hao xe cộ và rủi ro tự thân."
    },
    {
      "id": "office-staff",
      "title": "Nhân viên văn phòng hành chính",
      "salary": 9000000,
      "cost_of_living": 8000000,
      "hours_per_day": 8,
      "necessary_hours": 6.0,
      "surplus_hours": 2.0,
      "description": "Lương cơ bản của nhân viên hành chính sự vụ, đủ trang trải chi phí phòng trọ và ăn uống tối thiểu tại các đô thị lớn."
    }
  ],
  "tech_scenarios": [
    {
      "id": "ai-copilot",
      "title": "Tích hợp Generative AI vào quy trình code",
      "labor_reduction_pct": 50,
      "description": "Thời gian lao động tất yếu giảm một nửa nhờ AI hỗ trợ. Bạn sẽ bị ép nhận thêm gấp đôi số task để tối ưu hóa giá trị thặng dư tương đối."
    }
  ],
  "market_events": [
    {
      "id": "hanoi-apartments",
      "title": "Cơn sốt chung cư Hà Nội (Cung < Cầu)",
      "description": "Giá cả căn hộ chung cư tăng vọt ly khai khỏi giá trị thực tế do lượng cung khan hiếm và áp lực đầu cơ.",
      "chart_data": [
        { "month": "Tháng 1", "original_value": 100, "market_price": 100 },
        { "month": "Tháng 2", "original_value": 100, "market_price": 110 },
        { "month": "Tháng 3", "original_value": 102, "market_price": 135 },
        { "month": "Tháng 4", "original_value": 103, "market_price": 160 },
        { "month": "Tháng 5", "original_value": 105, "market_price": 185 },
        { "month": "Tháng 6", "original_value": 106, "market_price": 170 }
      ]
    },
    {
      "id": "it-layoffs",
      "title": "Làn sóng sa thải ngành IT (Cung > Cầu)",
      "description": "Thị trường công nghệ suy thoái làm giảm nhu cầu nhân sự. Lực lượng lao động dư thừa nhiều khiến lương khởi điểm sụt giảm.",
      "chart_data": [
        { "month": "Tháng 1", "original_value": 100, "market_price": 110 },
        { "month": "Tháng 2", "original_value": 100, "market_price": 100 },
        { "month": "Tháng 3", "original_value": 98, "market_price": 85 },
        { "month": "Tháng 4", "original_value": 97, "market_price": 75 },
        { "month": "Tháng 5", "original_value": 96, "market_price": 80 },
        { "month": "Tháng 6", "original_value": 96, "market_price": 82 }
      ]
    }
  ],
  "ethical_dilemmas": [
    {
      "id": "waste-dilemma",
      "scenario": "Nhà máy dệt nhuộm phát sinh lượng nước thải hóa chất lớn. Chi phí lắp hệ thống lọc tuần hoàn đạt chuẩn bảo vệ môi trường rất cao.",
      "choices": [
        {
          "text": "Xả trộm nước thải ra sông vào đêm mưa để tiết kiệm tối đa chi phí sản xuất.",
          "impact": {
            "profit": 35,
            "competitiveness": 25,
            "social_responsibility": -45
          },
          "explanation": "Quy luật cạnh tranh tư bản chủ nghĩa ép buộc bạn giảm chi phí để sinh tồn, tuy nhiên hành động này hủy hoại thiên nhiên."
        },
        {
          "text": "Đầu tư hệ thống lọc nước tuần hoàn đạt chuẩn ESG, chấp nhận giảm biên lợi nhuận.",
          "impact": {
            "profit": -20,
            "competitiveness": -15,
            "social_responsibility": 45
          },
          "explanation": "Doanh nghiệp thể hiện trách nhiệm xã hội cao, nhưng phải chịu áp lực tài chính ngắn hạn do giảm biên lợi nhuận thặng dư."
        }
      ]
    },
    {
      "id": "ai-replacement",
      "scenario": "Phần mềm AI mới có thể thay thế 70% công việc của bộ phận hỗ trợ khách hàng và soạn thảo giấy tờ văn phòng.",
      "choices": [
        {
          "text": "Sa thải lập tức các nhân viên cũ để cắt giảm chi phí lương và tăng lợi nhuận thặng dư.",
          "impact": {
            "profit": 40,
            "competitiveness": 30,
            "social_responsibility": -30
          },
          "explanation": "Tăng máy móc tư bản bất biến 'c' và giảm lao động sống tư bản khả biến 'v' giúp gia tăng năng suất và thặng dư siêu ngạch."
        },
        {
          "text": "Giữ lại nhân sự, đào tạo họ chuyển sang vai trò kiểm duyệt nội dung AI hoặc dịch vụ khách hàng cao cấp.",
          "impact": {
            "profit": -10,
            "competitiveness": -5,
            "social_responsibility": 35
          },
          "explanation": "Giúp bảo vệ an sinh xã hội cho người nghèo, tuy nhiên chi phí đào tạo làm tăng chi phí lưu thông của doanh nghiệp."
        }
      ]
    }
  ],
  "economic_sectors": [
    {
      "id": "state-economy",
      "name": "Kinh tế Nhà nước",
      "gdp_contribution": 29.5,
      "constitutional_role": "Giữ vai trò chủ đạo trong nền kinh tế quốc dân.",
      "description": "Bao gồm các tài sản công, đất đai, tài nguyên và Doanh nghiệp Nhà nước (như EVN, Viettel, Petrovietnam) giúp Nhà nước điều tiết vĩ mô theo định hướng XHCN."
    },
    {
      "id": "private-economy",
      "name": "Kinh tế Tư nhân",
      "gdp_contribution": 45.0,
      "constitutional_role": "Là một động lực quan trọng của nền kinh tế thị trường định hướng XHCN.",
      "description": "Bao gồm các hộ kinh doanh cá thể và doanh nghiệp tư nhân trong nước (như Vingroup, Hoà Phát, FPT), tạo đại đa số việc làm mới."
    },
    {
      "id": "fdi-economy",
      "name": "Kinh tế FDI",
      "gdp_contribution": 25.5,
      "constitutional_role": "Được khuyến khích và tạo điều kiện phát triển thuận lợi.",
      "description": "Bao gồm các tập đoàn đa quốc gia đầu tư nhà máy sản xuất (Samsung, Intel, LG), giúp kết nối Việt Nam với chuỗi cung ứng toàn cầu."
    }
  ]
};

export default function App() {
  const [economyData, setEconomyData] = useState<EconomyData>(FALLBACK_DATA);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // Job offer page states
  const [selectedJobId, setSelectedJobId] = useState("it-fresher");
  const [workMonths, setWorkMonths] = useState(1);
  const [isAiApplied, setIsAiApplied] = useState(false);

  // AI Consultant states
  const [aiGrievance, setAiGrievance] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Chào đồng chí trẻ! Tôi là Thầy Nam AI (được huấn luyện bởi lý luận Marxist chân chính). Bạn đang gặp bất công gì ở nơi công sở: Bị ép KPI vô lý, OT không lương hay quỵt hoa hồng? Hãy chia sẻ bên dưới, tôi sẽ cùng bạn bóc trần bản chất của sự bóc lột thặng dư nhé! 🛠️"
    }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Market events states
  const [selectedEventId, setSelectedEventId] = useState("hanoi-apartments");

  // Ethical Dilemma states
  const [dilemmaIndex, setDilemmaIndex] = useState(0);
  const [bossScores, setBossScores] = useState({ profit: 50, competitiveness: 50, social: 50 });
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);

  // Sectors states
  const [selectedSectorId, setSelectedSectorId] = useState("state-economy");

  // Hero search query state
  const [searchQuery, setSearchQuery] = useState("");

  // Load data from public folder
  useEffect(() => {
    fetch("/economy_data.json")
      .then(res => {
        if (!res.ok) throw new Error("Failed to load JSON");
        return res.json();
      })
      .then(data => {
        if (data.job_offers) {
          setEconomyData(data);
        }
      })
      .catch(err => {
        console.warn("Using embedded fallback data due to fetch error:", err);
      });
  }, []);

  // Job calculations
  const currentJob = economyData.job_offers.find(j => j.id === selectedJobId) || economyData.job_offers[0];

  const necessaryHours = isAiApplied
    ? currentJob.necessary_hours * (1 - economyData.tech_scenarios[0].labor_reduction_pct / 100)
    : currentJob.necessary_hours;
  const surplusHours = isAiApplied
    ? 8 - necessaryHours
    : currentJob.surplus_hours;

  const surplusRatio = (surplusHours / necessaryHours) * 100;
  const monthlySurplusValue = currentJob.salary * (surplusHours / necessaryHours);
  const accumulatedSurplus = Math.round(monthlySurplusValue * workMonths);

  const itemsEquivalent = {
    milktea: Math.round(accumulatedSurplus / 50000),
    movie: Math.round(accumulatedSurplus / 100000),
    headphone: Math.round(accumulatedSurplus / 500000)
  };

  const handleDilemmaChoice = (choice: Choice, index: number) => {
    setSelectedChoiceIndex(index);
    setBossScores(prev => ({
      profit: Math.max(0, Math.min(100, prev.profit + choice.impact.profit)),
      competitiveness: Math.max(0, Math.min(100, prev.competitiveness + choice.impact.competitiveness)),
      social: Math.max(0, Math.min(100, prev.social + choice.impact.social_responsibility))
    }));
  };

  const resetDilemma = () => {
    setSelectedChoiceIndex(null);
    setBossScores({ profit: 50, competitiveness: 50, social: 50 });
    setDilemmaIndex(0);
  };

  const handleSendGrievance = async () => {
    if (!aiGrievance.trim()) return;

    const userText = aiGrievance;
    setChatMessages(prev => [...prev, { role: "user", text: userText }]);
    setAiGrievance("");
    setIsAiLoading(true);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "AQ.Ab8RN6K-vxbvz_i4u7stZxySIhTLR8Y0YPEfTiHCTc3fv3e6g";
    const promptText = `Nỗi uất ức đi làm của sinh viên/người lao động: "${userText}"`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          systemInstruction: {
            parts: [{
              text: "Bạn là một nhà kinh tế chính trị học Marxist thông thái nhưng nói chuyện cực kỳ hài hước và bắt trend Gen Z Việt Nam. Người dùng sẽ kể cho bạn nỗi đau đi làm (ví dụ: bị quỵt lương, bắt tăng ca không lương, ép KPI vô lý). Hãy giải thích cho họ hiểu họ đang bị chiếm đoạt thặng dư thế nào (ví dụ: bóc lột thặng dư tuyệt đối qua tăng ca, bóc lột thặng dư tương đối qua ép năng suất) dựa trên lý thuyết của Các Mác. Dùng tiếng Việt trẻ trung, hài hước, ví von sinh động và kết thúc bằng một lời khuyên dí dỏm."
            }]
          }
        })
      });

      if (!response.ok) throw new Error("Failed to connect to AI");

      const resData = await response.json();
      const aiResponse = resData.candidates?.[0]?.content?.parts?.[0]?.text || "Mác AI đang suy ngẫm, vui lòng thử lại nhé đồng chí!";

      setChatMessages(prev => [...prev, { role: "assistant", text: aiResponse }]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, {
        role: "assistant",
        text: "⚠️ Lỗi hệ thống: Hiện tại AI đang bận đấu tranh giai cấp, tuy nhiên sếp bắt bạn tăng ca không lương chính là bóc lột giá trị thặng dư tuyệt đối bằng cách kéo dài ngày lao động vượt quá thời gian lao động tất yếu."
      }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase().trim();
    if (query.includes("lương") || query.includes("thặng dư") || query.includes("labor") || query.includes("salary") || query.includes("value")) {
      scrollToSection("surplus-value");
    } else if (query.includes("mác") || query.includes("ai") || query.includes("assistant") || query.includes("bot")) {
      scrollToSection("marxist-ai");
    } else if (query.includes("thị trường") || query.includes("cung cầu") || query.includes("market") || query.includes("price")) {
      scrollToSection("market-dynamics");
    } else if (query.includes("sếp") || query.includes("đạo đức") || query.includes("boss") || query.includes("ethical")) {
      scrollToSection("ethical-challenge");
    } else if (query.includes("thành phần") || query.includes("gdp") || query.includes("kinh tế") || query.includes("sector")) {
      scrollToSection("gdp-sectors");
    } else {
      scrollToSection("about-section");
    }
  };

  const navLinks = [
    { label: "Trang Chủ", target: "theory", active: true },
    { label: "Tính Lương", target: "surplus-value" },
    { label: "Lý Luận", target: "about-section" },
    { label: "Mác AI", target: "marxist-ai" },
    { label: "Cơ Cấu GDP", target: "gdp-sectors" },
  ];

  const PIE_COLORS = ["#ffffff", "#a3a3a3", "#404040"];

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background antialiased font-sans">

      {/* 1. HERO SECTION & HEADER */}
      <header id="theory" className="relative min-h-screen flex flex-col justify-between overflow-hidden">

        {/* Fullscreen Video Background */}
        <video
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          style={{ objectPosition: "center 80%" }}
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4" type="video/mp4" />
        </video>

        {/* Smooth Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent z-[1] pointer-events-none" />

        {/* Navigation Bar */}
        <div className="relative z-10 w-full">
          <nav className="flex flex-row justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full">

            {/* Logo */}
            <button
              onClick={() => scrollToSection("theory")}
              className="text-3xl tracking-tight text-foreground bg-transparent border-none outline-none cursor-pointer"
              style={{ fontFamily: "'Instrument Serif', serif", marginLeft: "-100px" }}
            >
              Group 2 with love
            </button>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.target)}
                  className={`text-base font-medium transition-colors duration-300 bg-transparent border-none outline-none cursor-pointer ${link.active
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* CTA Button & Mobile Menu Toggle */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => scrollToSection("surplus-value")}
                className="liquid-glass rounded-full px-7 py-3 text-base text-foreground font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-lg cursor-pointer bg-transparent border-none outline-none"
                style={{ marginRight: "-50px" }}
              >
                Khám Phá Ngay
              </button>

              {/* Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none outline-none"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

          </nav>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl p-8 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => { setMobileMenuOpen(false); scrollToSection("theory"); }}
                  className="text-3xl tracking-tight text-foreground bg-transparent border-none outline-none cursor-pointer"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  Group 2
                </button>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-none outline-none">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-8 text-3xl font-medium tracking-tight py-12">
                {navLinks.map(link => (
                  <button
                    key={link.label}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      scrollToSection(link.target);
                    }}
                    className="text-left text-muted-foreground hover:text-foreground transition-all bg-transparent border-none outline-none cursor-pointer"
                  >
                    {link.label}
                  </button>
                ))}
              </div>

              <div className="pb-8">
                <button
                  onClick={() => { setMobileMenuOpen(false); scrollToSection("surplus-value"); }}
                  className="w-full liquid-glass rounded-full py-4 text-center text-foreground font-medium text-lg border border-white/10 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 cursor-pointer bg-transparent"
                >
                  Khám Phá Ngay
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Section */}
        <main className="relative z-10 flex-1 flex flex-col justify-start items-center text-center px-6 pt-8 md:pt-12 pb-20">

          {/* Main Heading H1 */}
          <h1
            className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-7xl font-normal text-foreground select-text animate-fade-rise"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Nơi{" "}
            <em className="not-italic text-muted-foreground">giá trị thặng dư</em> được{" "}
            <em className="not-italic text-muted-foreground">thấu suốt qua lao động.</em>
          </h1>

          {/* Subtext Description */}
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mt-5 leading-relaxed select-text animate-fade-rise-delay">
            Chúng tôi thiết kế công cụ trực quan hóa học thuyết kinh tế chính trị Mác - Lênin.
            Giữa guồng quay biến động của thị trường, bạn sẽ tìm thấy câu trả lời về bản chất thực sự của tiền lương và thặng dư.
          </p>

        </main>

        {/* Footer spacer/pusher */}
        <div className="relative z-10 w-full py-4" />

      </header>

      {/* 2. ABOUT SECTION */}
      <div id="about-section">
        <AboutSection />
      </div>

      {/* 3. FEATURED VIDEO SECTION */}
      <FeaturedVideoSection />

      {/* 4. PHILOSOPHY SECTION */}
      <PhilosophySection />

      {/* 5. SERVICES SECTION */}
      <ServicesSection />

      {/* ========================================================================= */}
      {/* ======================= INTERACTIVE FUNCTIONAL WIDGETS ================== */}
      {/* ========================================================================= */}

      {/* 6. SURPLUS VALUE CALCULATOR SECTION */}
      <section id="surplus-value" className="relative bg-background px-6 md:px-28 py-32 border-t border-white/10 flex flex-col items-center">
        <div className="max-w-5xl w-full space-y-12">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-white/40 text-xs tracking-widest uppercase block mb-1 font-mono">Công cụ thực nghiệm</span>
              <h2 className="text-3xl md:text-5xl text-white tracking-tight flex items-center gap-3" style={{ fontFamily: "'Instrument Serif', serif" }}>
                <Briefcase className="text-white w-8 h-8" /> Sự Thật Về Tiền Lương & Thặng Dư
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wider font-mono">Chọn vị trí:</label>
              <select
                value={selectedJobId}
                onChange={e => setSelectedJobId(e.target.value)}
                className="liquid-glass rounded-xl text-xs md:text-sm font-medium py-2.5 px-4 pr-10 border border-white/10 text-white outline-none appearance-none"
              >
                {economyData.job_offers.map(job => (
                  <option key={job.id} value={job.id} className="bg-background text-white">{job.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 💡 Layperson Simple Explanation Box */}
          <div className="liquid-glass border border-amber-500/20 bg-amber-500/5 text-amber-200 p-5 rounded-2xl flex items-start gap-3 shadow-md">
            <span className="text-xl">💡</span>
            <div>
              <strong className="font-semibold text-sm block">Khái niệm đơn giản dành cho bạn:</strong>
              <p className="text-xs mt-1 text-amber-300/80 leading-relaxed">
                Sếp trả lương cho bạn dựa trên chi phí sinh hoạt tối thiểu để bạn có thể đi làm hằng ngày (giá trị sức lao động). Nhưng trong ngày làm việc 8 tiếng, bạn chỉ mất một phần thời gian (ví dụ 6 tiếng) để làm ra giá trị bằng lương của mình. Thời gian còn lại (2 tiếng) là thời gian bạn làm không công tạo ra <strong>giá trị thặng dư</strong> để sếp bỏ túi.
              </p>
            </div>
          </div>

          {/* Alert if below cost of living */}
          {currentJob.salary < currentJob.cost_of_living && (
            <div className="liquid-glass border border-red-500/20 bg-red-950/10 text-red-200 p-5 rounded-2xl flex items-start gap-3 shadow-md">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
              <div>
                <strong className="font-semibold text-sm block">Cảnh báo: Bán sức lao động dưới giá trị!</strong>
                <p className="text-xs mt-1 text-red-300/80 leading-relaxed">
                  Mức lương tháng này ({currentJob.salary.toLocaleString()} VND) không đủ bù đắp chi phí sinh hoạt tối thiểu cần có ({currentJob.cost_of_living.toLocaleString()} VND) để tái tạo đầy đủ hao phí lao động. Bạn đang bị khai thác ở mức đáng báo động!
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Input & Config Column */}
            <div className="liquid-glass rounded-3xl p-6 border border-white/10 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-white text-base">Cấu hình thời gian làm việc</h3>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-white/60 uppercase tracking-wide font-mono">
                    <span>Nhập số tháng cống hiến:</span>
                    <span className="text-white font-bold">{workMonths} tháng</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="36"
                    value={workMonths}
                    onChange={e => setWorkMonths(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                </div>
              </div>

              {/* AI Relative Surplus Value toggle */}
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 bg-white/10 rounded-lg text-white"><ArrowUpRight className="w-5 h-5" /></div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Cách mạng công nghệ & Giá trị thặng dư tương đối</h4>
                    <p className="text-[10px] text-white/50 mt-0.5">Năng suất lao động cá biệt tăng làm rút ngắn ngày lao động tất yếu.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAiApplied(!isAiApplied)}
                  className={`w-full py-2.5 rounded-full font-bold text-xs transition-all cursor-pointer border ${isAiApplied
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white border-white/20 hover:bg-white/5"
                    }`}
                >
                  {isAiApplied ? "Hủy áp dụng AI" : "Thử áp dụng AI (Relative Surplus)"}
                </button>
              </div>
            </div>

            {/* Calculations Visual Card */}
            <div className="lg:col-span-2 liquid-glass rounded-3xl p-8 border border-white/10 space-y-8 flex flex-col justify-between">

              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/5 pb-4">
                  <h3 className="font-semibold text-white text-sm uppercase tracking-wider font-mono">Phân tách ngày làm việc tiêu chuẩn 8 giờ</h3>
                  <div className="flex items-center gap-4 text-[10px] uppercase font-mono tracking-wider text-white/50">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-white rounded-full"></span> Tất yếu</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-neutral-600 rounded-full"></span> Thặng dư</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="w-full h-8 bg-neutral-950 rounded-full overflow-hidden flex p-1 border border-white/5">
                    <div
                      style={{ width: `${(necessaryHours / 8) * 100}%` }}
                      className="bg-white h-full rounded-full flex items-center justify-center text-[10px] font-bold text-black transition-all duration-300"
                    >
                      {necessaryHours.toFixed(1)} giờ
                    </div>
                    <div
                      style={{ width: `${(surplusHours / 8) * 100}%` }}
                      className="bg-neutral-600 h-full rounded-full flex items-center justify-center text-[10px] font-bold text-white transition-all duration-300 ml-1"
                    >
                      {surplusHours.toFixed(1)} giờ
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-white/40 uppercase tracking-widest font-mono">
                    <span>Vào làm (08:00)</span>
                    <span className="text-white font-semibold">
                      Đủ tiền công cá nhân ({(8 + necessaryHours).toFixed(1)}h)
                    </span>
                    <span>Tan làm (17:00)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5 pt-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block font-mono">Tỷ suất giá trị thặng dư (m')</span>
                  <div className="text-3xl font-serif text-white">{surplusRatio.toFixed(1)}%</div>
                  <p className="text-xs text-white/50 leading-relaxed mt-1">
                    Cứ mỗi đồng lương bạn được nhận về tay, bạn đã làm lợi không công cho doanh nghiệp thêm {surplusRatio.toFixed(0)} đồng thặng dư.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block font-mono">Mô tả lý luận thực tế</span>
                  <p className="text-xs text-white/50 leading-relaxed mt-1">{currentJob.description}</p>
                </div>
              </div>

            </div>

          </div>

          {/* Equivalent items display */}
          <div className="liquid-glass rounded-3xl p-8 border border-white/10 space-y-6">
            <div>
              <span className="text-white/40 text-[10px] tracking-widest uppercase font-mono block mb-1">Mảng quy đổi</span>
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <Coffee className="w-5 h-5 text-white" /> Quy Đổi Thặng Dư Đời Sống
              </h3>
              <div className="flex flex-col md:flex-row items-baseline gap-2 mt-4 bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-xs text-white/50 uppercase font-semibold">Tổng giá trị thặng dư tích luỹ từ bạn:</span>
                <span className="text-3xl font-serif text-white">{accumulatedSurplus.toLocaleString()} VND</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">

              <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/5 text-white rounded-xl"><Coffee className="w-5 h-5" /></div>
                  <div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wider font-mono">Trà sữa trân châu</div>
                    <div className="text-lg font-bold text-white">{itemsEquivalent.milktea} ly</div>
                  </div>
                </div>
                <p className="text-xs text-white/40 leading-relaxed italic">
                  Chủ lao động được hưởng thêm {itemsEquivalent.milktea} ly trà sữa từ thời gian làm việc chưa trả công của bạn.
                </p>
              </div>

              <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/5 text-white rounded-xl"><Film className="w-5 h-5" /></div>
                  <div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wider font-mono">Vé xem phim IMAX</div>
                    <div className="text-lg font-bold text-white">{itemsEquivalent.movie} vé</div>
                  </div>
                </div>
                <p className="text-xs text-white/40 leading-relaxed italic">
                  Cống hiến {itemsEquivalent.movie} chiếc vé IMAX để giới chủ sở hữu hưởng thụ nghỉ ngơi.
                </p>
              </div>

              <div className="bg-white/[0.02] p-5 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/5 text-white rounded-xl"><Headphones className="w-5 h-5" /></div>
                  <div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wider font-mono">Tai nghe Bluetooth</div>
                    <div className="text-lg font-bold text-white">{itemsEquivalent.headphone} chiếc</div>
                  </div>
                </div>
                <p className="text-xs text-white/40 leading-relaxed italic">
                  Chuyển hóa thặng dư tương đương tích lũy thành {itemsEquivalent.headphone} chiếc tai nghe.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 7. MARXIST AI CONSULTANT SECTION */}
      <section id="marxist-ai" className="relative bg-background px-6 md:px-28 py-32 border-t border-white/10 flex flex-col items-center">
        <div className="max-w-5xl w-full space-y-12">

          <div className="border-b border-white/10 pb-6">
            <span className="text-white/40 text-xs tracking-widest uppercase block mb-1 font-mono">Trợ lý học tập</span>
            <h2 className="text-3xl md:text-5xl text-white tracking-tight flex items-center gap-3" style={{ fontFamily: "'Instrument Serif', serif" }}>
              <Bot className="text-white w-8 h-8" /> Trợ Lý AI: Giải Mã Nỗi Đau Đi Làm
            </h2>
            <p className="text-white/50 text-xs md:text-sm mt-1">
              Phân tích sự chiếm đoạt thặng dư tại nơi công sở bằng tiếng lóng sinh viên.
            </p>
          </div>

          {/* 💡 Layperson Simple Explanation Box */}
          <div className="liquid-glass border border-amber-500/20 bg-amber-500/5 text-amber-200 p-5 rounded-2xl flex items-start gap-3 shadow-md">
            <span className="text-xl">💡</span>
            <div>
              <strong className="font-semibold text-sm block">Khái niệm đơn giản dành cho bạn:</strong>
              <p className="text-xs mt-1 text-amber-300/80 leading-relaxed">
                Bị sếp bắt tăng ca không lương (OT) là hình thức <strong>bóc lột thặng dư tuyệt đối</strong> (kéo dài thời gian làm việc). Bị sếp ép tăng KPI hoặc dùng công nghệ AI để bắt làm gấp đôi task trong cùng 8 tiếng là hình thức <strong>bóc lột thặng dư tương đối</strong> (nâng cao năng suất lao động để rút ngắn thời gian làm cho bản thân).
              </p>
            </div>
          </div>

          <div className="liquid-glass rounded-3xl border border-white/10 flex flex-col overflow-hidden h-[500px]">
            {/* Chat Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                    }`}
                >
                  <div className={`rounded-xl flex-shrink-0 w-8 h-8 flex items-center justify-center border overflow-hidden ${msg.role === "user" ? "p-2 bg-white text-black border-white" : "p-0 bg-neutral-900 text-white border-white/10 cursor-zoom-in hover:border-white/30 transition-colors"
                    }`}
                    onClick={() => {
                      if (msg.role !== "user") setIsAvatarModalOpen(true);
                    }}>
                    {msg.role === "user" ? <User className="w-4 h-4" /> : <img src={animeTeacher} alt="Thầy Nam AI" className="w-full h-full object-cover" />}
                  </div>

                  <div className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed border ${msg.role === "user"
                    ? "bg-white/5 border-white/10 text-white rounded-tr-none"
                    : "bg-neutral-900/50 border-white/5 text-white/80 rounded-tl-none"
                    }`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {isAiLoading && (
                <div className="flex gap-3 mr-auto max-w-[85%]">
                  <div className="rounded-xl bg-neutral-900 border border-white/5 text-white w-8 h-8 flex items-center justify-center overflow-hidden">
                    <img src={animeTeacher} alt="Thầy Nam AI" className="w-full h-full object-cover animate-pulse" />
                  </div>
                  <div className="p-4 rounded-2xl text-xs bg-white/5 border border-white/5 text-white/50 italic">
                    Thầy Nam AI đang phân tích hiện tượng thặng dư...
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-background border-t border-white/10 flex gap-3 items-center">
              <textarea
                rows={1}
                value={aiGrievance}
                onChange={e => setAiGrievance(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendGrievance();
                  }
                }}
                placeholder="Bị sếp ép OT không lương hay quỵt tiền hoa hồng? Hãy chia sẻ vào đây..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-white/35 focus:outline-none focus:border-white focus:bg-white/10 resize-none h-12"
              />
              <button
                disabled={isAiLoading || !aiGrievance.trim()}
                onClick={handleSendGrievance}
                className="p-3.5 rounded-xl bg-white hover:bg-stone-200 disabled:bg-neutral-800 disabled:text-neutral-500 text-black transition-all cursor-pointer flex items-center justify-center border-none"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 8. MARKET DECODER SECTION */}
      <section id="market-dynamics" className="relative bg-background px-6 md:px-28 py-32 border-t border-white/10 flex flex-col items-center">
        <div className="max-w-5xl w-full space-y-12">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-white/40 text-xs tracking-widest uppercase block mb-1 font-mono">Quy luật thị trường</span>
              <h2 className="text-3xl md:text-5xl text-white tracking-tight flex items-center gap-3" style={{ fontFamily: "'Instrument Serif', serif" }}>
                <TrendingUp className="text-white w-8 h-8" /> Giải Mã Biến Động Thị Trường
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wider font-mono">Chọn hiện tượng:</label>
              <select
                value={selectedEventId}
                onChange={e => setSelectedEventId(e.target.value)}
                className="liquid-glass rounded-xl text-xs md:text-sm font-medium py-2.5 px-4 pr-10 border border-white/10 text-white outline-none appearance-none"
              >
                {economyData.market_events.map(ev => (
                  <option key={ev.id} value={ev.id} className="bg-background text-white">{ev.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 💡 Layperson Simple Explanation Box */}
          <div className="liquid-glass border border-amber-500/20 bg-amber-500/5 text-amber-200 p-5 rounded-2xl flex items-start gap-3 shadow-md">
            <span className="text-xl">💡</span>
            <div>
              <strong className="font-semibold text-sm block">Khái niệm đơn giản dành cho bạn:</strong>
              <p className="text-xs mt-1 text-amber-300/80 leading-relaxed">
                Giá cả của chung cư hay lương IT biến động lên xuống mỗi ngày là do sự thay đổi của Cung và Cầu trên thị trường. Tuy nhiên, dù giá cả có trồi sụt thế nào thì về lâu dài nó vẫn luôn xoay quanh <strong>giá trị thực tế</strong> của hàng hóa (tức là lượng công sức lao động cần thiết để sản xuất ra nó).
              </p>
            </div>
          </div>

          {/* Chart & Explanation */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 liquid-glass rounded-3xl p-6 border border-white/10 space-y-4">
              <h3 className="font-semibold text-white text-sm uppercase tracking-wider font-mono">
                Tương quan Đường Giá cả & Đường Giá trị
              </h3>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={economyData.market_events.find(e => e.id === selectedEventId)?.chart_data || []}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis dataKey="month" stroke="rgba(255, 255, 255, 0.4)" fontSize={11} />
                    <YAxis stroke="rgba(255, 255, 255, 0.4)" fontSize={11} />
                    <ChartTooltip
                      contentStyle={{ backgroundColor: "rgba(10, 31, 53, 0.95)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px" }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, color: "#fff" }} />
                    <Line
                      type="monotone"
                      dataKey="original_value"
                      name="Giá trị thực tế (Hao phí lao động)"
                      stroke="#ffffff"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="market_price"
                      name="Giá cả thị trường"
                      stroke="#a3a3a3"
                      strokeDasharray="5 5"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="liquid-glass rounded-3xl p-6 border border-white/10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-white" /> Phân Tích Cung Cầu
                </h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  {economyData.market_events.find(e => e.id === selectedEventId)?.description}
                </p>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <strong className="text-xs text-white font-bold block mb-1">Mác luận giải:</strong>
                  <p className="text-xs text-white/50 leading-relaxed italic">
                    "Sự mất cân đối tạm thời giữa Cung và Cầu làm nảy sinh chênh lệch giá cả, nhưng về lâu dài, giá trị thực tế vẫn đóng vai trò là trục định tâm cân bằng thị trường."
                  </p>
                </div>
              </div>

              <div className="text-[10px] text-white/30 tracking-wider font-mono">
                *Mô phỏng quy luật kinh tế học chính trị.
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 9. ETHICAL BOSS CHALLENGE SECTION */}
      <section id="ethical-challenge" className="relative bg-background px-6 md:px-28 py-32 border-t border-white/10 flex flex-col items-center">
        <div className="max-w-5xl w-full space-y-12">

          <div className="border-b border-white/10 pb-6">
            <span className="text-white/40 text-xs tracking-widest uppercase block mb-1 font-mono">Trò chơi đóng vai</span>
            <h2 className="text-3xl md:text-5xl text-white tracking-tight flex items-center gap-3" style={{ fontFamily: "'Instrument Serif', serif" }}>
              <ShieldAlert className="text-white w-8 h-8" /> Thử Thách Làm Sếp: Đạo Đức vs Lợi Nhuận
            </h2>
            <p className="text-white/50 text-xs md:text-sm mt-1">
              Nhập vai nhà điều hành để trải nghiệm các mâu thuẫn sinh tồn của doanh nghiệp trong thị trường cạnh tranh.
            </p>
          </div>

          {/* 💡 Layperson Simple Explanation Box */}
          <div className="liquid-glass border border-amber-500/20 bg-amber-500/5 text-amber-200 p-5 rounded-2xl flex items-start gap-3 shadow-md">
            <span className="text-xl">💡</span>
            <div>
              <strong className="font-semibold text-sm block">Khái niệm đơn giản dành cho bạn:</strong>
              <p className="text-xs mt-1 text-amber-300/80 leading-relaxed">
                Trong nền kinh tế thị trường, các ông chủ không hẳn là người xấu xa bẩm sinh, mà họ bị ép buộc bởi <strong>quy luật cạnh tranh khốc liệt</strong>. Nếu không tìm mọi cách cắt giảm chi phí (sa thải nhân viên, xả nước thải bẩn), họ sẽ bị các đối thủ cạnh tranh đè bẹp và phá sản. Đó là lý do Nhà nước cần can thiệp để bảo vệ người lao động và môi trường.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Stats Panel */}
            <div className="liquid-glass rounded-3xl p-6 border border-white/10 space-y-6">
              <h3 className="font-semibold text-white text-sm uppercase tracking-wider font-mono">Chỉ số doanh nghiệp</h3>

              <div className="space-y-5">

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Lợi nhuận doanh thu</span>
                    <span className="text-white font-bold">{bossScores.profit}%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div style={{ width: `${bossScores.profit}%` }} className="bg-white h-full transition-all duration-300"></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Sức cạnh tranh sản phẩm</span>
                    <span className="text-white font-bold">{bossScores.competitiveness}%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div style={{ width: `${bossScores.competitiveness}%` }} className="bg-neutral-400 h-full transition-all duration-300"></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Trách nhiệm xã hội</span>
                    <span className="text-white font-bold">{bossScores.social}%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div style={{ width: `${bossScores.social}%` }} className="bg-neutral-600 h-full transition-all duration-300"></div>
                  </div>
                </div>

              </div>

              <div className="pt-4 border-t border-white/5 flex justify-center">
                <button
                  onClick={resetDilemma}
                  className="px-5 py-2.5 rounded-full bg-white text-black text-xs font-bold hover:bg-stone-200 transition-all cursor-pointer border-none"
                >
                  Khởi động lại
                </button>
              </div>
            </div>

            {/* Scenario & Choices */}
            <div className="lg:col-span-2 liquid-glass rounded-3xl p-6 border border-white/10 flex flex-col justify-between space-y-6">

              <div className="space-y-4">
                <span className="px-2.5 py-1 text-[10px] font-bold bg-white/10 text-white border border-white/20 rounded-md uppercase font-mono">
                  Tình huống {dilemmaIndex + 1}
                </span>
                <p className="text-white text-sm md:text-base font-semibold leading-relaxed">
                  {economyData.ethical_dilemmas[dilemmaIndex]?.scenario}
                </p>
              </div>

              <div className="space-y-3">
                {economyData.ethical_dilemmas[dilemmaIndex]?.choices.map((choice, idx) => (
                  <button
                    key={idx}
                    disabled={selectedChoiceIndex !== null}
                    onClick={() => handleDilemmaChoice(choice, idx)}
                    className={`w-full text-left p-4 rounded-xl text-xs md:text-sm transition-all duration-200 border cursor-pointer ${selectedChoiceIndex === idx
                      ? "bg-white text-black border-white font-medium"
                      : selectedChoiceIndex !== null
                        ? "opacity-40 border-white/5 text-white/30"
                        : "bg-white/5 border-white/10 hover:border-white hover:bg-white/10 text-white"
                      }`}
                  >
                    {choice.text}
                  </button>
                ))}
              </div>

              {selectedChoiceIndex !== null && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-white text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" /> Bản chất quy luật kinh tế
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {economyData.ethical_dilemmas[dilemmaIndex]?.choices[selectedChoiceIndex]?.explanation}
                  </p>

                  {dilemmaIndex < economyData.ethical_dilemmas.length - 1 ? (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          setDilemmaIndex(prev => prev + 1);
                          setSelectedChoiceIndex(null);
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-stone-200 text-black text-xs font-bold transition-all cursor-pointer border-none"
                      >
                        Tình huống tiếp theo <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2 text-center text-xs text-white font-bold tracking-wider font-mono">
                      🎉 Hoàn thành kịch bản quản trị!
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* 10. GDP SECTOR MATRIX SECTION */}
      <section id="gdp-sectors" className="relative bg-background px-6 md:px-28 py-32 border-t border-white/10 flex flex-col items-center">
        <div className="max-w-5xl w-full space-y-12">

          <div className="border-b border-white/10 pb-6">
            <span className="text-white/40 text-xs tracking-widest uppercase block mb-1 font-mono">Cơ Cấu Hiến Định</span>
            <h2 className="text-3xl md:text-5xl text-white tracking-tight flex items-center gap-3" style={{ fontFamily: "'Instrument Serif', serif" }}>
              <Building className="text-white w-8 h-8" /> Thành Phần Kinh Tế Việt Nam
            </h2>
            <p className="text-white/50 text-xs md:text-sm mt-1">
              Phân tích cơ cấu định hướng XHCN thông qua tỷ trọng đóng góp GDP.
            </p>
          </div>

          {/* 💡 Layperson Simple Explanation Box */}
          <div className="liquid-glass border border-amber-500/20 bg-amber-500/5 text-amber-200 p-5 rounded-2xl flex items-start gap-3 shadow-md">
            <span className="text-xl">💡</span>
            <div>
              <strong className="font-semibold text-sm block">Khái niệm đơn giản dành cho bạn:</strong>
              <p className="text-xs mt-1 text-amber-300/80 leading-relaxed">
                Việt Nam không đi theo con đường chủ nghĩa tư bản thuần túy, mà phát triển <strong>Kinh tế thị trường định hướng XHCN</strong>. Nghĩa là nền kinh tế vẫn vận hành theo quy luật thị trường, có sự đóng góp mạnh mẽ của khối Tư nhân và nước ngoài (FDI), nhưng Nhà nước (qua kinh tế Nhà nước giữ vai trò chủ đạo) sẽ điều tiết vĩ mô để đảm bảo công bằng xã hội, giàu mạnh và dân chủ.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 liquid-glass rounded-3xl p-8 border border-white/10 flex flex-col items-center justify-center space-y-6">
              <h3 className="font-semibold text-white text-sm uppercase tracking-wider font-mono">Đóng góp GDP thành phần</h3>

              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={economyData.economic_sectors}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={6}
                      dataKey="gdp_contribution"
                      nameKey="name"
                    >
                      {economyData.economic_sectors.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                          className="cursor-pointer outline-none focus:outline-none"
                          onClick={() => setSelectedSectorId(entry.id)}
                        />
                      ))}
                    </Pie>
                    <ChartTooltip
                      contentStyle={{ backgroundColor: "rgba(10, 31, 53, 0.95)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap gap-6 justify-center text-xs font-semibold">
                {economyData.economic_sectors.map((entry, index) => (
                  <button
                    key={entry.id}
                    onClick={() => setSelectedSectorId(entry.id)}
                    className={`flex items-center gap-2 transition-all cursor-pointer bg-transparent border-none ${selectedSectorId === entry.id ? "opacity-100 scale-105" : "opacity-40 hover:opacity-80"
                      }`}
                  >
                    <span style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} className="w-3.5 h-3.5 rounded-full border border-white/10"></span>
                    <span>{entry.name} ({entry.gdp_contribution}%)</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Detail Panel */}
            <div className="liquid-glass rounded-3xl p-6 border border-white/10 flex flex-col justify-between space-y-6">
              {(() => {
                const sector = economyData.economic_sectors.find(s => s.id === selectedSectorId) || economyData.economic_sectors[0];
                return (
                  <div className="space-y-5">
                    <span className="px-3 py-1 text-[10px] font-bold bg-white/10 text-white border border-white/15 rounded-md uppercase font-mono">
                      Hiến pháp Việt Nam
                    </span>

                    <h3 className="text-xl font-bold text-white tracking-tight">{sector.name}</h3>

                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <strong className="text-[10px] text-white/60 uppercase font-mono block mb-1">Quy định hiến định:</strong>
                      <p className="text-xs text-white/80 leading-relaxed italic">
                        "{sector.constitutional_role}"
                      </p>
                    </div>

                    <div className="space-y-1">
                      <strong className="text-[10px] text-white/40 uppercase font-mono block">Vai trò kinh tế thực tiễn:</strong>
                      <p className="text-xs text-white/60 leading-relaxed">
                        {sector.description}
                      </p>
                    </div>
                  </div>
                );
              })()}

              <div className="text-[10px] text-white/30 font-mono">
                *Định hướng kinh tế thị trường XHCN.
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="px-6 md:px-28 py-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 bg-background z-10 relative text-white/40 text-xs">
        <div>
          &copy; 2026 Dialectics Marxist Economics. All rights reserved.
        </div>
        <div className="flex gap-6 font-medium">
          <a href="#theory" className="hover:text-white transition-colors">Manifesto</a>
          <a href="#theory" className="hover:text-white transition-colors">Principles</a>
          <a href="#theory" className="hover:text-white transition-colors">Contact</a>
        </div>
      </footer>

      {/* SVG Sharpen Filter Definition — Unsharp Mask for 1080p-like clarity */}
      <svg className="hidden" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="sharpen-filter" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="linearRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" result="blurred" />
            <feComposite in="SourceGraphic" in2="blurred" operator="arithmetic"
              k1="0" k2="2.2" k3="-1.2" k4="0" result="sharpened" />
            <feConvolveMatrix in="sharpened" order="3"
              kernelMatrix="0 -0.5 0   -0.5 3 -0.5   0 -0.5 0"
              result="convolved" />
            <feBlend in="convolved" in2="SourceGraphic" mode="normal" result="output" />
          </filter>
        </defs>
      </svg>

      {/* Avatar zoom-in lightbox/modal */}
      <AnimatePresence>
        {isAvatarModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAvatarModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md cursor-zoom-out p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-lg w-full max-h-[85vh] aspect-square rounded-3xl overflow-hidden border border-white/20 shadow-2xl p-2 bg-neutral-900"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={animeTeacher}
                alt="Thầy Nam"
                className="w-full h-full object-cover rounded-2xl animate-fade-in"
              />
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 border border-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-6 left-6 right-6 text-center bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 rounded-xl">
                <h3 className="text-lg font-serif font-semibold text-white">Thầy Nam</h3>
                <p className="text-xs text-white/60">Giảng Viên Hướng Dẫn - Cố Vấn Triết Học</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
