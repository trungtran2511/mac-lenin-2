import React, { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  ShieldAlert,
  Award,
  User,
  Bot,
  Send,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X,
  HelpCircle,
  TrendingUp,
  Building,
  Briefcase,
  Download,
  RotateCcw
} from "lucide-react";
/*
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
*/

import AboutSection from "./components/AboutSection";
import FeaturedVideoSection from "./components/FeaturedVideoSection";
import FloatingParticles from "./components/FloatingParticles";
import HomeFeatureCards from "./components/HomeFeatureCards";
import PhilosophySection from "./components/PhilosophySection";
import ServicesSection from "./components/ServicesSection";
import { SalaryCalculatorPanel } from "./components/SalaryCalculatorPanel";
import { loadCurriculumLessons, type ChapterLessons } from "./lib/curriculum";
import { askThayNamAI } from "./lib/ai";
import { ChapterSyllabusPanel } from "./components/ChapterSyllabusPanel";
import { SectionDetailPanel } from "./components/SectionDetailPanel";
import { InlineQuizChat } from "./components/InlineQuizChat";
import animeTeacher from "./assets/anime_teacher.png";
import chibiTeacher from "./assets/chibi_teacher.png";

const CardBattleArena = React.lazy(() => import("./components/card-battle/CardBattleArena"));
const DarkCeoGame = React.lazy(() => import("./components/dark-ceo/DarkCeoGame"));
const SimEconCity = React.lazy(() => import("./components/sim-econ/SimEconCity"));

// Define strict TypeScript contracts for safety
/*
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

interface DialecticalChartData {
  step: string;
  quantity: number;
  quality: number;
}

interface DialecticalDebate {
  id: string;
  title: string;
  description: string;
  side_a: string;
  side_b: string;
  side_a_arguments: string[];
  side_b_arguments: string[];
  resolution: {
    title: string;
    explanation: string;
  };
  chart_data: DialecticalChartData[];
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
  dialectical_debates: DialecticalDebate[];
  ethical_dilemmas: EthicalDilemma[];
  economic_sectors: EconomicSector[];
}
*/

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

interface FloatingChatPosition {
  x: number;
  y: number;
}

/*
const FALLBACK_DATA: EconomyData = {
  "job_offers": [
    {
      "id": "student-tutor",
      "title": "Gia sư (Dạy kèm học sinh)",
      "salary": 2500000,
      "cost_of_living": 2000000,
      "hours_per_day": 4,
      "necessary_hours": 2.5,
      "surplus_hours": 1.5,
      "description": "Lương theo giờ của gia sư khá cao so với mặt bằng làm thêm của sinh viên. Tuy nhiên, bạn thường chịu chiết khấu 30-40% tháng lương đầu tiên cho trung tâm gia sư - một phần giá trị thặng dư bị chiếm đoạt trực tiếp bởi giới trung gian môi giới sức lao động."
    },
    {
      "id": "cafe-staff",
      "title": "Nhân viên phục vụ quán Cafe",
      "salary": 1800000,
      "cost_of_living": 2200000,
      "hours_per_day": 4,
      "necessary_hours": 3.2,
      "surplus_hours": 0.8,
      "description": "Mức lương theo giờ rất thấp (15k-18k/h), không đủ trang trải chi phí sinh hoạt tối thiểu để tái tạo sức lao động khỏe mạnh. Quán thu lợi nhuận lớn từ các cốc nước bạn pha chế và bưng bê, nhưng tiền lương của bạn chỉ tương xứng với một phần rất nhỏ của lượng giá trị mới mà bạn tạo ra."
    },
    {
      "id": "delivery-rider",
      "title": "Shipper công nghệ (Grab/Shopee Food)",
      "salary": 4500000,
      "cost_of_living": 4000000,
      "hours_per_day": 6,
      "necessary_hours": 5.0,
      "surplus_hours": 1.0,
      "description": "Bạn phải tự túc phương tiện làm việc (Tư bản bất biến - c) và chịu toàn bộ rủi ro hao mòn xe cộ, tai nạn đường phố. Ứng dụng công nghệ chiết khấu trực tiếp 20-30% doanh thu mỗi cuốc xe của bạn dưới dạng phí nền tảng."
    },
    {
      "id": "freelance-coder",
      "title": "Freelance Coder (Viết code thuê)",
      "salary": 5000000,
      "cost_of_living": 3500000,
      "hours_per_day": 6,
      "necessary_hours": 4.0,
      "surplus_hours": 2.0,
      "description": "Bạn tự đầu tư máy tính cấu hình cao (c) và chịu chi phí điện nước tại nhà. Sản phẩm phần mềm bạn viết ra mang lại giá trị sử dụng lớn cho khách hàng, nhưng qua tay các đầu mối thầu dự án trung gian, phần lớn giá trị thặng dư đã bị cắt xén."
    }
  ],
  "tech_scenarios": [
    {
      "id": "ai-copilot",
      "title": "Sử dụng Generative AI hỗ trợ công việc",
      "labor_reduction_pct": 50,
      "description": "Áp dụng AI giúp rút ngắn 50% thời gian lao động tất yếu (tạo ra lượng sản phẩm tương đương tiền lương). Thay vì được nghỉ ngơi sớm, bạn sẽ bị sếp giao thêm gấp đôi số task để gia tăng giá trị thặng dư tương đối."
    }
  ],
  "dialectical_debates": [
    {
      "id": "study-vs-work",
      "title": "Mâu thuẫn: Đi làm thêm sớm vs. Tập trung học tập",
      "description": "Sự giằng co giữa nhu cầu tài chính, trải nghiệm thực tế ngay lập tức và mục tiêu tích lũy tri thức chuyên môn dài hạn tại trường đại học.",
      "side_a": "Cực A: Đi làm kiếm tiền ngay (Vật chất ngắn hạn)",
      "side_b": "Cực B: Tập trung học tập (Tích lũy tri thức dài hạn)",
      "side_a_arguments": [
        "Có tiền trang trải chi phí sinh hoạt ngay lập tức, giảm bớt gánh nặng cho gia đình.",
        "Tiếp xúc sớm với môi trường xã hội, rèn luyện kỹ năng giao tiếp và xử lý tình huống.",
        "Có kinh nghiệm thực tế ghi vào CV trước khi ra trường."
      ],
      "side_b_arguments": [
        "Tập trung học tập đạt bằng cấp cao (Giỏi/Xuất sắc), mở ra cơ hội việc làm lương cao sau này.",
        "Có thời gian nghiên cứu khoa học, tham gia các hoạt động nghiên cứu học thuật sâu sắc.",
        "Tránh bị kiệt sức, stress hoặc sa sút học tập dẫn đến trượt môn, kéo dài thời gian ra trường."
      ],
      "resolution": {
        "title": "Giải quyết mâu thuẫn biện chứng theo Quy luật Lượng - Chất",
        "explanation": "Không được coi hai mặt đối lập này là loại trừ nhau hoàn toàn. Bản chất của sự phát triển là tích lũy dần về LƯỢNG (tri thức chuyên môn bền vững trên giảng đường + kỹ năng thực tế có được qua làm thêm chừng mực, hợp lý). Khi lượng tích lũy đủ lớn đến 'Điểm nút' (tốt nghiệp), bạn sẽ thực hiện 'Bước nhảy' biến đổi về CHẤT - từ một sinh viên thành một chuyên gia có giá trị lao động cao, thay vì sa đà làm việc chân tay giá trị thấp từ sớm."
      },
      "chart_data": [
        { "step": "Tuần 1", "quantity": 10, "quality": 2.0 },
        { "step": "Tuần 4", "quantity": 25, "quality": 2.1 },
        { "step": "Tuần 8", "quantity": 50, "quality": 2.3 },
        { "step": "Tuần 12 (Độ)", "quantity": 80, "quality": 2.5 },
        { "step": "Tuần 16 (Bước nhảy)", "quantity": 115, "quality": 3.6 },
        { "step": "Tuần 20 (Chất mới)", "quantity": 125, "quality": 3.8 }
      ]
    },
    {
      "id": "saving-vs-spending",
      "title": "Mâu thuẫn: Chi tiêu tiết kiệm tối đa vs. Nâng cao chất lượng sống",
      "description": "Sự mâu thuẫn giữa việc thắt lưng buộc bụng tích lũy tiền tệ phòng thân và việc chi tiền để nâng cấp bản thân, sức khỏe tinh thần.",
      "side_a": "Cực A: Tiết kiệm tối đa (Thắt lưng buộc bụng)",
      "side_b": "Cực B: Nâng cao chất lượng sống (Đầu tư trải nghiệm)",
      "side_a_arguments": [
        "Tích lũy quỹ dự phòng an toàn trước các rủi ro ốm đau, mất việc làm thêm.",
        "Rèn luyện lối sống tối giản, không bị lôi kéo bởi các trào lưu tiêu dùng lãng phí.",
        "Có một khoản vốn nhỏ sau khi tốt nghiệp để tự lập."
      ],
      "side_b_arguments": [
        "Đầu tư vào dinh dưỡng, chăm sóc sức khỏe thể chất và tinh thần tốt để làm việc hiệu quả.",
        "Mua sắm công cụ học tập tốt (máy tính, sách vở chất lượng, các khóa học kỹ năng).",
        "Tạo động lực tinh thần để học tập và làm việc thông qua các phần thưởng trải nghiệm."
      ],
      "resolution": {
        "title": "Giải quyết mâu thuẫn biện chứng theo Quy luật Mâu thuẫn",
        "explanation": "Tiết kiệm và Chi tiêu là hai mặt đối lập thống nhất trong cùng một chủ thể quản lý tài chính cá nhân. Giải quyết biện chứng ở đây không phải là chọn một bên cực đoan, mà là 'Đấu tranh và thống nhất': Sử dụng tiết kiệm như nền tảng để tạo sự an tâm, nhưng có kế hoạch chi tiêu thông minh hướng tới việc 'tái sản xuất sức lao động' (ăn uống đủ chất, mua sách vở, học tập). Sự cân bằng biện chứng này giúp sức lao động của bạn liên tục được nâng cấp giá trị."
      },
      "chart_data": [
        { "step": "Tháng 1", "quantity": 5, "quality": 1.5 },
        { "step": "Tháng 3", "quantity": 15, "quality": 1.6 },
        { "step": "Tháng 6", "quantity": 30, "quality": 1.8 },
        { "step": "Tháng 9 (Độ)", "quantity": 45, "quality": 2.0 },
        { "step": "Tháng 12 (Bước nhảy)", "quantity": 70, "quality": 3.5 },
        { "step": "Tháng 15 (Chất mới)", "quantity": 80, "quality": 3.7 }
      ]
    }
  ],
  "ethical_dilemmas": [
    {
      "id": "waste-dilemma",
      "scenario": "Nhà máy dệt nhuộm của bạn phát sinh lượng nước thải hóa chất lớn. Chi phí lắp đặt hệ thống lọc nước tuần hoàn đạt chuẩn bảo vệ môi trường của Nhà nước rất cao, ảnh hưởng trực tiếp tới lợi nhuận quý này.",
      "choices": [
        {
          "text": "Xả trộm nước thải ra sông vào đêm mưa để tiết kiệm tối đa chi phí sản xuất.",
          "impact": {
            "profit": 35,
            "competitiveness": 25,
            "social_responsibility": -45
          },
          "explanation": "Quy luật cạnh tranh buộc các nhà tư bản phải tìm mọi cách giảm chi phí cá biệt dưới mức chi phí xã hội để chiến thắng đối thủ. Tuy nhiên, việc hủy hoại môi trường sống của cộng đồng sẽ bị Nhà nước phát hiện và xử lý nghiêm khắc."
        },
        {
          "text": "Đầu tư hệ thống lọc nước tuần hoàn đạt chuẩn, chấp nhận giảm biên lợi nhuận ngắn hạn.",
          "impact": {
            "profit": -20,
            "competitiveness": -15,
            "social_responsibility": 45
          },
          "explanation": "Hành động này thể hiện đạo đức kinh doanh và trách nhiệm xã hội cao. Dù làm giảm tỷ suất giá trị thặng dư ngắn hạn, nó đảm bảo sự phát triển bền vững và uy tín lâu dài của doanh nghiệp trong nền kinh tế thị trường định hướng XHCN."
        }
      ]
    },
    {
      "id": "safety-dilemma",
      "scenario": "Công ty xây dựng của bạn đang đấu thầu dự án chung cư giá rẻ. Để chiến thắng thầu, bạn cần cắt giảm tối đa chi phí. Bạn có nên giảm bớt các tiêu chuẩn an toàn lao động và bảo hộ cho công nhân công trường?",
      "choices": [
        {
          "text": "Cắt bớt trang bị bảo hộ lao động và kéo dài giờ làm việc của công nhân.",
          "impact": {
            "profit": 30,
            "competitiveness": 30,
            "social_responsibility": -40
          },
          "explanation": "Bạn đang áp dụng phương pháp sản xuất giá trị thặng dư tuyệt đối (kéo dài ngày lao động) và tiết kiệm chi phí tư bản bất biến (trang thiết bị bảo hộ). Điều này gia tăng lợi nhuận nhanh chóng nhưng đẩy tính mạng công nhân vào nguy hiểm."
        },
        {
          "text": "Đảm bảo trang bị bảo hộ hiện đại và huấn luyện an toàn lao động đầy đủ.",
          "impact": {
            "profit": -15,
            "competitiveness": -10,
            "social_responsibility": 40
          },
          "explanation": "Hao phí để đảm bảo an toàn cho sức lao động thực chất là chi phí cần thiết để bảo toàn và phát triển lực lượng sản xuất cốt lõi. Sếp có trách nhiệm bảo vệ tính mạng người lao động trước áp lực tối đa hóa thặng dư."
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
      "description": "Kinh tế Nhà nước bao gồm tài sản công, đất đai, tài nguyên thiên nhiên và các Doanh nghiệp Nhà nước lớn (EVN, Viettel, Petrovietnam). Khối này giữ vai trò then chốt, là công cụ vật chất quan trọng để Nhà nước điều tiết vĩ mô, ổn định kinh tế và dẫn dắt các thành phần kinh tế khác phát triển theo định hướng XHCN."
    },
    {
      "id": "private-economy",
      "name": "Kinh tế Tư nhân",
      "gdp_contribution": 45.0,
      "constitutional_role": "Là một động lực quan trọng của nền kinh tế thị trường định hướng XHCN.",
      "description": "Bao gồm các hộ kinh doanh cá thể, các doanh nghiệp tư nhân trong nước (Vingroup, FPT, Hòa Phát). Khối này đóng vai trò năng động, thúc đẩy tính cạnh tranh của thị trường, đóng góp lớn vào GDP, tạo phần lớn việc làm cho người lao động Việt Nam và thúc đẩy đổi mới công nghệ."
    },
    {
      "id": "fdi-economy",
      "name": "Kinh tế FDI (Vốn nước ngoài)",
      "gdp_contribution": 25.5,
      "constitutional_role": "Là một bộ phận quan trọng được khuyến khích phát triển lâu dài.",
      "description": "Bao gồm các doanh nghiệp có vốn đầu tư trực tiếp từ nước ngoài (Samsung, Intel, LG). Khối này giúp Việt Nam thu hút nguồn vốn ngoại tệ lớn, chuyển giao công nghệ hiện đại, đào tạo kỹ năng quản lý tiên tiến và hội nhập sâu rộng vào chuỗi giá trị toàn cầu."
    }
  ]
};
*/

export default function App() {
  const dragConstraintsRef = useRef<HTMLDivElement>(null);
  const floatingChatDragControls = useDragControls();
  // const [economyData, setEconomyData] = useState<EconomyData>(FALLBACK_DATA);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'home' | 'calculator' | 'ai-consultant' | 'market-dynamics' | 'ethical-challenge' | 'gdp-sectors' | 'self-study'>('home');

  // Mascot Hover states
  const [isMascotHovered, setIsMascotHovered] = useState(false);
  const [mascotBubbleText, setMascotBubbleText] = useState("");

  const MASCOT_DIALOGUES = [
    "Hôm nay học Triết nè! 📚",
    "Bạn đã ôn thi Chương 2 chưa đó? 🤔",
    "Bị sếp bóc lột? Hỏi thầy Nam AI ngay! 🛠️",
    "Tải Giáo trình Mác - Lênin về tự học nhé! 📥",
    "Tích lũy đủ về lượng sẽ biến đổi về chất! 📈",
    "Lao động thặng dư chính là... sếp thích điều này! 🤫",
    "Học tập giúp nâng cấp giá trị sức lao động đó! 💡",
    "Quy luật giá trị vận hành thế nào nhỉ? 📈"
  ];

  const handleMascotMouseEnter = () => {
    setIsMascotHovered(true);
    const randomIndex = Math.floor(Math.random() * MASCOT_DIALOGUES.length);
    setMascotBubbleText(MASCOT_DIALOGUES[randomIndex]);
  };

  // Curriculum Data states
  interface CurriculumChapter {
    id: number;
    title: string;
    summary: string;
  }
  interface QuizQuestion {
    id: string;
    chapter: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }
  interface CurriculumData {
    chapters: CurriculumChapter[];
    quiz_questions: QuizQuestion[];
  }

  const [curriculumData, setCurriculumData] = useState<CurriculumData | null>(null);
  const [lessons, setLessons] = useState<ChapterLessons[]>([]);

  // Self-study & practice quiz states
  const [quizSubTab, setQuizSubTab] = useState<'syllabus' | 'practice'>('syllabus');
  const [activeChapterId, setActiveChapterId] = useState<number | null>(1); // null means All Chapters
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [userSelectedOption, setUserSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showQuizSummary, setShowQuizSummary] = useState(false);
  const [selectedChapterDetails, setSelectedChapterDetails] = useState<number>(1);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number | null>(null);
  const [showInlineChat, setShowInlineChat] = useState(false);

  // Job offer page states (handled in child component)

  // AI Coach states
  const [aiMode, setAiMode] = useState<'academic' | 'practical'>('practical');
  const [aiGrievance, setAiGrievance] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Chào đồng chí trẻ! Tôi là Thầy Nam AI. Bạn đang gặp bất công gì ở chỗ làm thêm: Bị ép KPI vô lý, OT không lương hay quỵt hoa hồng? Hãy chia sẻ bên dưới, tôi sẽ cùng bạn bóc trần bản chất của sự bóc lột thặng dư bằng lý luận nhé! 🛠️"
    }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Dialectical Debate Board states
  // const [selectedDebateId, setSelectedDebateId] = useState("study-vs-work");

  // Ethical Dilemma states
  // const [dilemmaIndex, setDilemmaIndex] = useState(0);
  // const [bossScores, setBossScores] = useState({ profit: 50, competitiveness: 50, social: 50 });
  // const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);

  // Sectors states
  // const [selectedSectorId, setSelectedSectorId] = useState("state-economy");

  // Floating mascot chat overlay states
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);
  const [floatingAiGrievance, setFloatingAiGrievance] = useState("");
  const [floatingChatPosition, setFloatingChatPosition] = useState<FloatingChatPosition>({ x: 12, y: 12 });

  const getFloatingChatSize = () => {
    if (typeof window === "undefined") {
      return { width: 400, height: 620 };
    }

    if (window.innerWidth < 640) {
      return {
        width: Math.min(380, window.innerWidth - 24),
        height: Math.min(560, Math.round(window.innerHeight * 0.75))
      };
    }

    if (window.innerWidth < 768) {
      return { width: 380, height: 560 };
    }

    return { width: 400, height: 620 };
  };

  const clampFloatingChatPosition = (position: FloatingChatPosition) => {
    if (typeof window === "undefined") return position;

    const { width, height } = getFloatingChatSize();
    const margin = 12;
    const maxX = Math.max(margin, window.innerWidth - width - margin);
    const maxY = Math.max(margin, window.innerHeight - height - margin);

    return {
      x: Math.min(Math.max(position.x, margin), maxX),
      y: Math.min(Math.max(position.y, margin), maxY)
    };
  };

  const getDefaultFloatingChatPosition = () => {
    if (typeof window === "undefined") {
      return { x: 12, y: 12 };
    }

    const { width, height } = getFloatingChatSize();
    const mascotWidth = window.innerWidth >= 768 ? 192 : 160;
    const rightGap = window.innerWidth >= 768 ? 24 : 14;
    const rightInset = 16;
    const bottomInset = 24;

    return clampFloatingChatPosition({
      x: window.innerWidth - width - mascotWidth - rightGap - rightInset,
      y: window.innerHeight - height - bottomInset
    });
  };

  const handleResetQuiz = () => {
    setCurrentQuizIndex(0);
    setUserSelectedOption(null);
    setQuizScore(0);
    setShowQuizSummary(false);
  };

  // Reset reading detail section when switching chapters
  useEffect(() => {
    setSelectedSectionIndex(null);
  }, [selectedChapterDetails]);

  // Reset inline AI chat when switching quiz questions or active chapter quiz filter
  useEffect(() => {
    setShowInlineChat(false);
  }, [currentQuizIndex, activeChapterId]);

  // Update welcome message when AI Mode changes
  useEffect(() => {
    if (aiMode === "practical") {
      setChatMessages([
        {
          role: "assistant",
          text: "Chào đồng chí trẻ! Tôi là Thầy Nam AI. Bạn đang gặp bất công gì ở chỗ làm thêm: Bị ép KPI vô lý, OT không lương hay quỵt hoa hồng? Hãy chia sẻ bên dưới, tôi sẽ cùng bạn bóc trần bản chất của sự bóc lột thặng dư bằng lý luận nhé! 🛠️"
        }
      ]);
    } else {
      setChatMessages([
        {
          role: "assistant",
          text: "Chào đồng chí! Tôi là Thầy Nam AI. Bạn đang gặp khó khăn gì với bài tập ôn thi Kinh tế chính trị Mác - Lênin? Hãy nhập câu hỏi trắc nghiệm hoặc lý thuyết cần giải đáp chuẩn giáo trình vào đây nhé! 📚"
        }
      ]);
    }
  }, [aiMode]);

  useEffect(() => {
    if (!isFloatingChatOpen) return;

    setFloatingChatPosition(getDefaultFloatingChatPosition());
  }, [isFloatingChatOpen]);

  useEffect(() => {
    const handleWindowResize = () => {
      setFloatingChatPosition(prev => clampFloatingChatPosition(prev));
    };

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  // Load data from public folder
  useEffect(() => {
    /*
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
    */

    fetch("/curriculum_knowledge.json")
      .then(res => {
        if (!res.ok) throw new Error("Failed to load curriculum knowledge");
        return res.json();
      })
      .then(data => {
        setCurriculumData(data);
      })
      .catch(err => {
        console.error("Error loading curriculum knowledge:", err);
      });
      
    loadCurriculumLessons()
      .then(setLessons)
      .catch(err => console.error("Failed to load detailed lessons", err));
  }, []);

  // Job calculations (handled in child component)

  /*
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
  */

  const findOfflineAnswer = (message: string) => {
    if (!curriculumData) return null;
    const msgLower = message.toLowerCase().trim();

    // 1. Search in quiz questions for match
    for (const q of curriculumData.quiz_questions) {
      if (msgLower.includes(q.question.toLowerCase().trim()) || q.question.toLowerCase().includes(msgLower)) {
        return {
          type: "quiz",
          chapterId: q.chapter,
          title: `Câu hỏi trắc nghiệm Chương ${q.chapter}`,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          summary: ""
        };
      }
    }

    // 2. Mapping keywords to Chapter IDs
    const keywordMap = [
      {
        chapterId: 3,
        keywords: ["giá trị thặng dư", "tích lũy tư bản", "bóc lột", "ngày lao động", "thặng dư", "tích tụ", "tập trung", "m'", "sức lao động"]
      },
      {
        chapterId: 2,
        keywords: ["hàng hóa", "tiền tệ", "quy luật giá trị", "giá trị sử dụng", "lao động", "thị trường", "sản xuất hàng hóa"]
      },
      {
        chapterId: 4,
        keywords: ["độc quyền", "xuất khẩu tư bản", "độc quyền nhà nước", "tập trung sản xuất", "tổ chức độc quyền"]
      },
      {
        chapterId: 5,
        keywords: ["thành phần kinh tế", "kinh tế thị trường", "sở hữu", "xhcn", "định hướng xã hội chủ nghĩa"]
      },
      {
        chapterId: 6,
        keywords: ["công nghiệp hóa", "hiện đại hóa", "cnh", "hđh", "lợi ích kinh tế", "quan hệ lợi ích"]
      },
      {
        chapterId: 1,
        keywords: ["đối tượng nghiên cứu", "phương pháp nghiên cứu", "chức năng", "kinh tế chính trị học", "mác-lênin"]
      }
    ];

    for (const item of keywordMap) {
      if (item.keywords.some(kw => msgLower.includes(kw))) {
        const chapter = curriculumData.chapters.find(c => c.id === item.chapterId);
        if (chapter) {
          return {
            type: "chapter",
            chapterId: chapter.id,
            title: chapter.title,
            summary: chapter.summary,
            question: "",
            options: [] as string[],
            correctAnswer: 0,
            explanation: ""
          };
        }
      }
    }
    return null;
  };

  const isLikelyCurriculumQuestion = (message: string) => {
    if (!curriculumData) return false;
    const msgLower = message.toLowerCase().trim();
    const curriculumTerms = [
      "kinh tế chính trị", "mác", "lênin", "giáo trình", "trắc nghiệm", "ôn tập",
      "hàng hóa", "tiền tệ", "quy luật giá trị", "lao động", "thặng dư", "tư bản",
      "độc quyền", "kinh tế thị trường", "xhcn", "công nghiệp hóa", "hiện đại hóa",
      "hội nhập", "lợi ích kinh tế", "chương 1", "chương 2", "chương 3", "chương 4",
      "chương 5", "chương 6"
    ];

    return curriculumTerms.some(term => msgLower.includes(term))
      || curriculumData.chapters.some(chapter => msgLower.includes(`chương ${chapter.id}`))
      || curriculumData.quiz_questions.some(question =>
        msgLower.includes(question.question.toLowerCase().slice(0, 28))
      );
  };

  const handleSendChat = async (messageText: string) => {
    if (!messageText.trim()) return;

    setChatMessages(prev => [...prev, { role: "user", text: messageText }]);
    setIsAiLoading(true);

    // 1. Local Offline Curriculum Lookup first (only in academic mode to respect direct curriculum lookups)
    if (aiMode === "academic") {
      const offlineMatch = findOfflineAnswer(messageText);
      if (offlineMatch) {
        setTimeout(() => {
          let text = "";
          if (offlineMatch.type === "quiz") {
            const correctAnswerChar = String.fromCharCode(65 + offlineMatch.correctAnswer);
            text = `📖 **[Câu hỏi ôn tập khớp từ hệ thống - Chương ${offlineMatch.chapterId}]**\n\n**Câu hỏi:** ${offlineMatch.question}\n\n` +
                   offlineMatch.options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join("\n") +
                   `\n\n**Đáp án đúng:** ${correctAnswerChar}. ${offlineMatch.options[offlineMatch.correctAnswer]}` +
                   `\n\n**Luận giải:** ${offlineMatch.explanation}\n\n---\n*💡 Đồng chí cần hỏi giải thích sâu hơn hoặc khía cạnh ngoài giáo trình? Hãy nhập thêm chi tiết nhé! Thầy Nam AI luôn sẵn sàng.*`;
          } else {
            text = `📖 **[Thông tin chính thức từ Giáo trình - Chương ${offlineMatch.chapterId}]**\n\n*${offlineMatch.title}*\n\n${offlineMatch.summary}\n\n---\n*💡 Đồng chí cần hỏi giải thích sâu hơn hoặc khía cạnh ngoài giáo trình? Hãy nhập thêm chi tiết nhé! Thầy Nam AI luôn sẵn sàng.*`;
          }
          setChatMessages(prev => [...prev, {
            role: "assistant",
            text
          }]);
          setIsAiLoading(false);
        }, 600);
        return;
      }
    }

    const curriculumContext = curriculumData
      ? [
        curriculumData.chapters.map(c => `[${c.title}]: ${c.summary}`).join("\n\n"),
        "NGÂN HÀNG CÂU HỎI TRẮC NGHIỆM:",
        curriculumData.quiz_questions
          .map(q => `Chương ${q.chapter} - ${q.question}\nĐáp án đúng: ${String.fromCharCode(65 + q.correctAnswer)}. ${q.options[q.correctAnswer]}\nLuận giải: ${q.explanation}`)
          .join("\n\n")
      ].join("\n\n")
      : "";

    const curriculumScopeHint = aiMode === "academic" && !isLikelyCurriculumQuestion(messageText)
      ? "[Nội dung này nằm ngoài phạm vi giáo trình chính thức]\n"
      : "";

    const promptText = aiMode === "academic"
      ? `${curriculumScopeHint}Câu hỏi ôn tập hoặc lý thuyết trắc nghiệm Kinh tế chính trị Mác - Lênin: "${messageText}"`
      : `Nỗi uất ức đi làm thêm của sinh viên/người lao động: "${messageText}"`;

    const systemInstructionText = aiMode === "academic"
      ? `Bạn là Thầy Nam AI - giảng viên Kinh tế chính trị học Mác - Lênin thông thái, chuyên nghiệp và chuẩn xác. 
         Ưu tiên tuyệt đối dữ liệu Giáo trình Kinh tế Chính trị Mác - Lênin và ngân hàng trắc nghiệm dưới đây để trả lời câu hỏi ôn tập của người dùng.
         Nếu dữ liệu giáo trình không đủ để trả lời trực tiếp, bạn phải bắt đầu câu trả lời bằng đúng dòng: "[Nội dung này ngoài phạm vi giáo trình chính thức]".
         Khi có cảnh báo ngoài phạm vi, chỉ được bổ sung kiến thức chung thật ngắn gọn, trung lập, và phải nói rõ phần đó không phải trích từ giáo trình.
         Không được bịa số liệu, tác giả, chương mục hoặc đáp án trắc nghiệm không có trong dữ liệu.

         DỮ LIỆU GIÁO TRÌNH:
         ${curriculumContext}

         Hãy giải thích rõ ràng các khái niệm, quy luật bằng tiếng Việt khoa học, dễ hiểu nhất để sinh viên ôn thi đạt điểm cao. Tuyệt đối KHÔNG sử dụng bất kỳ định dạng markdown nào (như dấu sao đôi **, dấu thăng #, gạch đầu dòng, danh sách), chỉ trả về văn bản thuần túy không định dạng.`
      : "Bạn là Thầy Nam AI - cố vấn triết học Gen Z hài hước nhưng cực kỳ tích cực. Người dùng sẽ kể cho bạn nỗi đau đi làm thêm (bị quỵt lương, ép KPI, làm quá giờ không lương). Hãy dùng lý luận Kinh tế chính trị Mác - Lênin (bóc lột thặng dư tuyệt đối/tương đối, giá trị sức lao động, bản chất bóc lột của nhà tư bản) để giải thích tình trạng của họ bằng giọng điệu hài hước, dí dỏm, sử dụng slang Gen Z trẻ trung. Cuối cùng, hãy đưa ra lời khuyên tích cực, định hướng sinh viên tự chủ lao động, tập trung học tập nâng cao chất lượng bản thân và biết bảo vệ quyền lợi hợp pháp. Tuyệt đối KHÔNG sử dụng bất kỳ định dạng markdown nào (như dấu sao đôi **, dấu thăng #, gạch đầu dòng, danh sách), chỉ trả về văn bản thuần túy không định dạng.";

    try {
      const aiResponse = await askThayNamAI(promptText, systemInstructionText);
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

  const handleSendGrievance = () => {
    if (!aiGrievance.trim()) return;
    const query = aiGrievance;
    setAiGrievance("");
    handleSendChat(query);
  };

  const handleSendFloatingGrievance = () => {
    if (!floatingAiGrievance.trim()) return;
    const query = floatingAiGrievance;
    setFloatingAiGrievance("");
    handleSendChat(query);
  };

  const scrollToSection = (id: string) => {
    if (id === "theory") {
      setActiveView("home");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (id === "about-section") {
      setActiveView("home");
      setTimeout(() => {
        const el = document.getElementById("about-section");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else if (id === "surplus-value") {
      setActiveView("calculator");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (id === "marxist-ai") {
      setActiveView("ai-consultant");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (id === "self-study") {
      setActiveView("self-study");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (id === "market-dynamics") {
      setActiveView("market-dynamics");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (id === "ethical-challenge") {
      setActiveView("ethical-challenge");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (id === "gdp-sectors") {
      setActiveView("gdp-sectors");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const navLinks = [
    { label: "Trang Chủ", target: "theory", active: activeView === "home" },
    { label: "Tính Lương", target: "surplus-value", active: activeView === "calculator" },
    { label: "Tự Học", target: "self-study", active: activeView === "self-study" },
    { label: "Biện Chứng Kỳ Đài", target: "market-dynamics", active: activeView === "market-dynamics" },
    { label: "Giám Đốc Hắc Ám", target: "ethical-challenge", active: activeView === "ethical-challenge" },
    { label: "Kinh Tế Kỳ Thành", target: "gdp-sectors", active: activeView === "gdp-sectors" },
    { label: "Mác AI", target: "marxist-ai", active: activeView === "ai-consultant" },
  ];

  // const PIE_COLORS = ["#ffffff", "#a3a3a3", "#404040"];

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background antialiased font-sans overflow-x-hidden">
      <FloatingParticles />

      {/* 1. HERO SECTION & HEADER */}
      {activeView === "home" ? (
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
              <div className="hidden md:flex items-center gap-4 lg:gap-8">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => scrollToSection(link.target)}
                    className={`text-sm lg:text-base font-medium transition-colors duration-300 bg-transparent border-none outline-none cursor-pointer ${link.active
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
            <h1
              className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-7xl font-normal text-foreground select-text animate-fade-rise"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Nơi{" "}
              <em className="not-italic text-muted-foreground">giá trị thặng dư</em> được{" "}
              <em className="not-italic text-muted-foreground">thấu suốt qua lao động.</em>
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mt-5 leading-relaxed select-text animate-fade-rise-delay">
              Chúng tôi thiết kế công cụ trực quan hóa học thuyết kinh tế chính trị Mác - Lênin.
              Giữa guồng quay biến động của thị trường, bạn sẽ tìm thấy câu trả lời về bản chất thực sự của tiền lương và thặng dư.
            </p>
          </main>

          <div className="relative z-10 w-full py-4" />
        </header>
      ) : (
        /* Sticky Compact Navigation Bar for Subpages */
        <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-white/5">
          <nav className="flex flex-row justify-between items-center px-8 py-4 max-w-7xl mx-auto w-full">
            {/* Logo */}
            <button
              onClick={() => scrollToSection("theory")}
              className="text-3xl tracking-tight text-foreground bg-transparent border-none outline-none cursor-pointer"
              style={{ fontFamily: "'Instrument Serif', serif", marginLeft: "-100px" }}
            >
              Group 2 with love
            </button>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.target)}
                  className={`text-sm lg:text-base font-medium transition-colors duration-300 bg-transparent border-none outline-none cursor-pointer ${link.active
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

          {/* Mobile Menu Overlay for Subpages */}
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
        </div>
      )}

      {activeView === "home" && (
        <>
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

          <HomeFeatureCards onNavigate={scrollToSection} />

          {/* INTERACTIVE DASHBOARD GRID */}
          <section className="hidden">
            <div className="max-w-6xl w-full space-y-12">
              <div className="text-center space-y-3">
                <span className="text-white/40 text-xs tracking-widest uppercase block font-mono">Trải nghiệm thực nghiệm</span>
                <h2 className="text-4xl md:text-6xl text-white tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  Công Cụ Tương Tác
                </h2>
                <p className="text-white/50 text-xs md:text-sm max-w-xl mx-auto">
                  Chọn một công cụ trực quan hóa học thuyết kinh tế chính trị bên dưới để bắt đầu khám phá thực tiễn.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                
                {/* Card 1: Surplus Calculator */}
                <motion.div 
                  whileHover={{ scale: 1.03, borderColor: "rgba(255, 255, 255, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => scrollToSection("surplus-value")}
                  className="liquid-glass rounded-3xl p-8 border border-white/10 cursor-pointer flex flex-col justify-between space-y-6 hover:shadow-2xl hover:shadow-white/5 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white text-xl font-bold tracking-tight">Tính Lương & Thặng Dư</h3>
                    <p className="text-white/50 text-xs leading-relaxed">
                      Bóc tách ngày làm việc 8 tiếng thành giờ lao động tất yếu và thặng dư. Đo lường tỷ suất bóc lột thực tế trên đồng lương của bạn.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    Bắt đầu khám phá <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </motion.div>

                {/* Card 2: AI Consultant */}
                <motion.div 
                  whileHover={{ scale: 1.03, borderColor: "rgba(255, 255, 255, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => scrollToSection("marxist-ai")}
                  className="liquid-glass rounded-3xl p-8 border border-white/10 cursor-pointer flex flex-col justify-between space-y-6 hover:shadow-2xl hover:shadow-white/5 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white text-xl font-bold tracking-tight">Trợ Lý AI Thầy Nam</h3>
                    <p className="text-white/50 text-xs leading-relaxed">
                      Tâm sự nỗi đau đi làm, bị ép KPI hay OT không lương để nhận phân tích học thuật dí dỏm, thực tế bằng tiếng lóng Gen Z.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    Chat với Thầy Nam <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </motion.div>

                {/* Card 3: Market Dynamics */}
                <motion.div 
                  whileHover={{ scale: 1.03, borderColor: "rgba(255, 255, 255, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => scrollToSection("market-dynamics")}
                  className="liquid-glass rounded-3xl p-8 border border-white/10 cursor-pointer flex flex-col justify-between space-y-6 hover:shadow-2xl hover:shadow-white/5 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white text-xl font-bold tracking-tight">Biến Động Thị Trường</h3>
                    <p className="text-white/50 text-xs leading-relaxed">
                      Giải mã mối tương quan biện chứng giữa Giá cả thị trường và Giá trị thực tế dưới tác động của quy luật Cung - Cầu.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    Xem biểu đồ <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </motion.div>

                {/* Card 4: Boss Challenge */}
                <motion.div 
                  whileHover={{ scale: 1.03, borderColor: "rgba(255, 255, 255, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => scrollToSection("ethical-challenge")}
                  className="liquid-glass rounded-3xl p-8 border border-white/10 cursor-pointer flex flex-col justify-between space-y-6 hover:shadow-2xl hover:shadow-white/5 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                      <ShieldAlert className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white text-xl font-bold tracking-tight">Thử Thách Làm Sếp</h3>
                    <p className="text-white/50 text-xs leading-relaxed">
                      Nhập vai nhà quản trị điều hành doanh nghiệp trước những mâu thuẫn sinh tồn giữa tối đa hóa lợi nhuận và trách nhiệm xã hội.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    Chơi game ngay <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </motion.div>

                {/* Card 5: GDP Sectors Matrix */}
                <motion.div 
                  whileHover={{ scale: 1.03, borderColor: "rgba(255, 255, 255, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => scrollToSection("gdp-sectors")}
                  className="liquid-glass rounded-3xl p-8 border border-white/10 cursor-pointer flex flex-col justify-between space-y-6 hover:shadow-2xl hover:shadow-white/5 transition-all duration-300 md:col-span-2 lg:col-span-1"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white text-xl font-bold tracking-tight">Cơ Cấu GDP Việt Nam</h3>
                    <p className="text-white/50 text-xs leading-relaxed">
                      Phân tích cấu trúc kinh tế định hướng XHCN thông qua tỷ lệ đóng góp GDP thực tế của khối Nhà nước, Tư nhân và FDI.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    Xem phân tích <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </motion.div>

              </div>
            </div>
          </section>
        </>
      )}

      {/* ========================================================================= */}
      {/* ======================= INTERACTIVE FUNCTIONAL WIDGETS ================== */}
      {/* ========================================================================= */}

      {/* 6. SURPLUS VALUE CALCULATOR SECTION */}
      {activeView === "calculator" && (
        <section id="surplus-value" className="subpage-shell relative bg-background px-4 md:px-8 py-20 border-t border-white/10 flex flex-col items-center min-h-[75vh] w-full">
          <div className="max-w-[96%] w-full space-y-12 animate-fade-rise">

            {/* Back Button */}
            <div className="pb-4">
              <button
                onClick={() => scrollToSection("theory")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
              </button>
            </div>

            <SalaryCalculatorPanel onAskTeacher={() => scrollToSection("marxist-ai")} />

          </div>
        </section>
      )}

            {/* 6.5. SELF-STUDY & PRACTICE SECTION */}
      {activeView === "self-study" && (
        <section id="self-study" className="subpage-shell relative bg-background px-4 md:px-8 py-32 border-t border-white/10 flex flex-col items-center min-h-[75vh]">
          <div className="max-w-[95%] w-full space-y-12 animate-fade-rise">

            {/* Back Button */}
            <div className="pb-4">
              <button
                onClick={() => scrollToSection("theory")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
              </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
              <div>
                <span className="text-white/40 text-xs tracking-widest uppercase block mb-1 font-mono">Tự học lý luận & Giải trắc nghiệm</span>
                <h2 className="text-3xl md:text-5xl text-white tracking-tight flex items-center gap-3" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  <BookOpen className="text-white w-8 h-8" /> Tự Học & Ôn Tập Giáo Trình
                </h2>
                <p className="text-white/50 text-xs md:text-sm mt-1">
                  Đọc tóm tắt giáo trình lý thuyết và luyện tập bộ câu hỏi trắc nghiệm chuẩn xác.
                </p>
              </div>

              {/* Sub-tab Switcher */}
              <div className="flex w-full sm:w-auto bg-neutral-900 border border-white/10 rounded-xl p-1 gap-1">
                <button
                  onClick={() => setQuizSubTab("syllabus")}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${quizSubTab === "syllabus" ? "bg-white text-black font-bold" : "text-white/50 hover:text-white"}`}
                >
                  Tóm Tắt Giáo Trình
                </button>
                <button
                  onClick={() => setQuizSubTab("practice")}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${quizSubTab === "practice" ? "bg-white text-black font-bold" : "text-white/50 hover:text-white"}`}
                >
                  Trắc Nghiệm Ôn Luyện
                </button>
              </div>
            </div>

            {/* 📥 Download Curriculum Section */}
            <div className="liquid-glass border border-emerald-500/20 bg-emerald-500/5 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
                  <Download className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Tải Giáo Trình Đầy Đủ (PDF)</h3>
                  <p className="text-xs text-white/60 leading-relaxed mt-1">
                    Bản scan chất lượng cao của giáo trình chính thức môn Kinh tế chính trị Mác - Lênin (32.6 MB). Lưu trữ và học tập ngoại tuyến mọi lúc mọi nơi.
                  </p>
                </div>
              </div>
              <a
                href="/GIÁO TRÌNH FULL.pdf"
                download="GIÁO TRÌNH FULL.pdf"
                className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm text-center transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <Download className="w-4 h-4" /> Tải về ngay
              </a>
            </div>

            {/* Sub-tab 1: Syllabus summary */}
            {quizSubTab === "syllabus" && (
              <div className="grid grid-cols-1 md:grid-cols-10 gap-8">
                {/* Chapters list sidebar (40% width) */}
                <div className="md:col-span-4 space-y-3">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-wider block font-mono px-2">Danh sách chương học</span>
                  {curriculumData?.chapters.map(chapter => (
                    <button
                      key={chapter.id}
                      onClick={() => setSelectedChapterDetails(chapter.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex flex-col gap-1.5 cursor-pointer ${selectedChapterDetails === chapter.id ? "bg-white border-white text-black" : "bg-neutral-900/50 border-white/5 text-white/70 hover:bg-white/5 hover:text-white"}`}
                    >
                      <span className={`text-xs font-bold uppercase tracking-wider font-mono ${selectedChapterDetails === chapter.id ? "text-neutral-500" : "text-white/40"}`}>
                        Chương {chapter.id}
                      </span>
                      <h4 className="text-sm font-bold leading-snug">{chapter.title}</h4>
                    </button>
                  ))}
                </div>

                {/* Chapter details content panel (60% width) */}
                <div className="md:col-span-6 space-y-3">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-wider block font-mono px-2">Chi tiết chương học</span>
                  <div className="liquid-glass rounded-3xl p-8 border border-white/10 space-y-6 flex flex-col justify-start">
                    <ChapterSyllabusPanel
                      activeChapterId={selectedChapterDetails}
                      chapters={curriculumData?.chapters || []}
                      lessons={lessons}
                      selectedSectionIndex={selectedSectionIndex}
                      setSelectedSectionIndex={setSelectedSectionIndex}
                    />
                  </div>
                </div>
              </div>
            )}

            {quizSubTab === "syllabus" && selectedSectionIndex !== null && (
              <SectionDetailPanel
                activeChapterId={selectedChapterDetails}
                selectedSectionIndex={selectedSectionIndex}
                setSelectedSectionIndex={setSelectedSectionIndex}
                lessons={lessons}
                onPracticeQuiz={(chapterId) => {
                  setActiveChapterId(chapterId);
                  setQuizSubTab("practice");
                  handleResetQuiz();
                }}
              />
            )}

            {/* Sub-tab 2: Practice Quiz */}
            {quizSubTab === "practice" && (
              <div className="space-y-8">
                {/* Chapter selector filter */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900/60 p-4 rounded-2xl border border-white/5">
                  <div className="flex w-full min-w-0 flex-col sm:flex-row sm:items-center gap-3">
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wider font-mono">Chọn chương luyện tập:</label>
                    <select
                      value={activeChapterId === null ? "all" : activeChapterId}
                      onChange={e => {
                        const val = e.target.value;
                        setActiveChapterId(val === "all" ? null : parseInt(val));
                        handleResetQuiz();
                      }}
                      className="w-full sm:w-auto min-w-0 bg-neutral-950 rounded-xl text-xs md:text-sm font-semibold py-2 px-3 border border-white/10 text-white outline-none"
                    >
                      <option value="all">Tất cả các chương</option>
                      {curriculumData?.chapters.map(ch => (
                        <option key={ch.id} value={ch.id}>Chương {ch.id}: {ch.title.substring(0, 40)}...</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="text-xs font-semibold text-white/50 font-mono whitespace-nowrap">
                    Tổng số câu: {curriculumData ? (activeChapterId === null ? curriculumData.quiz_questions.length : curriculumData.quiz_questions.filter(q => q.chapter === activeChapterId).length) : 0} câu
                  </div>
                </div>

                {/* Show quiz questions or results */}
                {!curriculumData ? (
                  <div className="liquid-glass rounded-3xl p-12 text-center text-white/50 text-sm border border-white/10">
                    Đang tải danh sách câu hỏi học tập...
                  </div>
                ) : (activeChapterId === null ? curriculumData.quiz_questions : curriculumData.quiz_questions.filter(q => q.chapter === activeChapterId)).length === 0 ? (
                  <div className="liquid-glass rounded-3xl p-12 text-center text-white/50 text-sm border border-white/10">
                    Không tìm thấy câu hỏi luyện tập cho phần này.
                  </div>
                ) : showQuizSummary ? (
                  /* Quiz Score Summary View */
                  <div className="liquid-glass rounded-3xl p-8 border border-white/10 text-center space-y-6 max-w-xl mx-auto shadow-2xl animate-fade-rise">
                    <div className="w-20 h-20 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white">
                      <Award className="w-10 h-10 text-amber-400" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-serif text-white tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
                        Kết Quả Luyện Tập
                      </h3>
                      <p className="text-xs text-white/50 font-mono">
                        Chương: {activeChapterId === null ? "Tất cả các chương" : `Chương ${activeChapterId}`}
                      </p>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 max-w-xs mx-auto">
                      <div className="text-3xl font-serif text-white">
                        {quizScore} / {activeChapterId === null ? curriculumData.quiz_questions.length : curriculumData.quiz_questions.filter(q => q.chapter === activeChapterId).length}
                      </div>
                      <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono mt-1">Câu trả lời đúng</div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full mt-4 overflow-hidden">
                        <div
                          style={{ width: `${(quizScore / (activeChapterId === null ? curriculumData.quiz_questions.length : curriculumData.quiz_questions.filter(q => q.chapter === activeChapterId).length)) * 100}%` }}
                          className="bg-white h-full transition-all duration-500"
                        />
                      </div>
                    </div>

                    <p className="text-xs text-white/70 italic leading-relaxed max-w-md mx-auto">
                      {quizScore === (activeChapterId === null ? curriculumData.quiz_questions.length : curriculumData.quiz_questions.filter(q => q.chapter === activeChapterId).length)
                        ? "“Đồng chí đạt điểm tuyệt đối! Tích lũy về Lượng cực kỳ xuất sắc, sẵn sàng cho Bước nhảy về Chất ở bài thi chính thức rồi!” 🎓"
                        : quizScore >= (activeChapterId === null ? curriculumData.quiz_questions.length : curriculumData.quiz_questions.filter(q => q.chapter === activeChapterId).length) / 2
                        ? "“Lượng tri thức tích lũy khá tốt. Hãy tiếp tục ôn tập kỹ các lý luận cốt lõi để bài thi đạt kết quả xuất sắc nhất!” 🛠️"
                        : "“Lượng tích lũy chưa đủ để thực hiện bước nhảy chất lượng. Hãy đọc lại tóm tắt chương học hoặc hỏi Thầy Nam AI nhé đồng chí!” 📚"}
                    </p>

                    <div className="flex gap-4 justify-center pt-2">
                      <button
                        onClick={handleResetQuiz}
                        className="px-5 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition-all flex items-center gap-2 cursor-pointer border-none"
                      >
                        <RotateCcw className="w-4 h-4" /> Luyện tập lại
                      </button>
                      <button
                        onClick={() => setQuizSubTab("syllabus")}
                        className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs transition-all cursor-pointer"
                      >
                        Đọc lại giáo trình
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Question Display Card */
                  <div className="liquid-glass rounded-3xl p-5 md:p-8 border border-white/10 space-y-6 shadow-xl animate-fade-rise">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                      <span className="px-2.5 py-1 text-[9px] font-bold bg-white/10 text-white border border-white/15 rounded-md uppercase font-mono">
                        Câu hỏi {currentQuizIndex + 1} / {activeChapterId === null ? curriculumData.quiz_questions.length : curriculumData.quiz_questions.filter(q => q.chapter === activeChapterId).length}
                      </span>
                      <span className="text-[10px] text-white/40 font-mono">
                        Đang đạt: {quizScore} câu đúng
                      </span>
                    </div>

                    {(() => {
                      const questionsList = activeChapterId === null ? curriculumData.quiz_questions : curriculumData.quiz_questions.filter(q => q.chapter === activeChapterId);
                      const qObj = questionsList[currentQuizIndex];
                      if (!qObj) return null;

                      return (
                        <div className="space-y-4">
                          <h3 className="text-base font-semibold text-white leading-relaxed select-text">
                            {qObj.question}
                          </h3>
                          
                          {/* Options Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {qObj.options.map((option, idx) => {
                              const isSelected = userSelectedOption === idx;
                              const isCorrectOption = idx === qObj.correctAnswer;
                              const hasAnswered = userSelectedOption !== null;

                              let btnStyle = "bg-white/5 border-white/10 text-white/80 hover:bg-white/10";
                              if (hasAnswered) {
                                if (isCorrectOption) {
                                  btnStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-300 font-medium";
                                } else if (isSelected) {
                                  btnStyle = "bg-red-500/10 border-red-500 text-red-300 font-medium";
                                } else {
                                  btnStyle = "bg-white/[0.02] border-white/5 text-white/30 cursor-not-allowed";
                                }
                              }

                              return (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    if (userSelectedOption !== null) return;
                                    setUserSelectedOption(idx);
                                    if (idx === qObj.correctAnswer) {
                                      setQuizScore(prev => prev + 1);
                                    }
                                  }}
                                  disabled={hasAnswered}
                                  className={`text-left p-4 rounded-2xl border text-xs md:text-sm leading-relaxed transition-all flex items-start justify-between gap-3 cursor-pointer break-words ${btnStyle}`}
                                >
                                  <div className="flex min-w-0 gap-2.5">
                                    <span className="font-mono opacity-50">{String.fromCharCode(65 + idx)}.</span>
                                    <span className="min-w-0 overflow-wrap-anywhere">{option}</span>
                                  </div>
                                  {hasAnswered && isCorrectOption && (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                  )}
                                  {hasAnswered && isSelected && !isCorrectOption && (
                                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Feedback Explanation Panel */}
                          {userSelectedOption !== null && (
                            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 text-xs md:text-sm text-white/90 leading-relaxed animate-fade-rise space-y-4 mt-4">
                              <div className="flex items-center gap-2 text-[10px] font-bold font-mono tracking-wider text-white/50 uppercase">
                                <HelpCircle className="w-4 h-4" /> Luận giải học thuật của Thầy Nam:
                              </div>
                              <p className="font-light">{qObj.explanation}</p>

                              {showInlineChat && (
                                <InlineQuizChat
                                  question={qObj.question}
                                  options={qObj.options}
                                  correctAnswer={qObj.correctAnswer}
                                  explanation={qObj.explanation}
                                  chapterId={qObj.chapter}
                                />
                              )}

                              <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-white/5 mt-4">
                                {!showInlineChat ? (
                                  <button
                                    onClick={() => setShowInlineChat(true)}
                                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                  >
                                    <Bot className="w-4 h-4" /> Hỏi Thầy Nam AI câu này
                                  </button>
                                ) : (
                                  <div />
                                )}
                                <button
                                  onClick={() => {
                                    setUserSelectedOption(null);
                                    if (currentQuizIndex < questionsList.length - 1) {
                                      setCurrentQuizIndex(prev => prev + 1);
                                    } else {
                                      setShowQuizSummary(true);
                                    }
                                  }}
                                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none"
                                >
                                  {currentQuizIndex < questionsList.length - 1 ? "Câu tiếp theo" : "Hoàn thành ôn luyện"} <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

          </div>
        </section>
      )}

      {/* 7. MARXIST AI CONSULTANT SECTION */}
      {activeView === "ai-consultant" && (
        <section id="marxist-ai" className="subpage-shell relative bg-background px-6 md:px-28 py-32 border-t border-white/10 flex flex-col items-center min-h-[75vh]">
          <div className="max-w-5xl w-full space-y-12 animate-fade-rise">

            {/* Back Button */}
            <div className="pb-4">
              <button
                onClick={() => scrollToSection("theory")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
              </button>
            </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div>
              <span className="text-white/40 text-xs tracking-widest uppercase block mb-1 font-mono">Trợ lý học tập & Hướng nghiệp</span>
              <h2 className="text-3xl md:text-5xl text-white tracking-tight flex items-center gap-3" style={{ fontFamily: "'Instrument Serif', serif" }}>
                <Bot className="text-white w-8 h-8" /> Thầy Nam AI: Marxist Coach
              </h2>
              <p className="text-white/50 text-xs md:text-sm mt-1">
                Lý luận Mác - Lênin đồng hành cùng đời sống sinh viên.
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex bg-neutral-900 border border-white/10 rounded-xl p-1 gap-1">
              <button
                onClick={() => setAiMode("practical")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${aiMode === "practical" ? "bg-white text-black font-bold" : "text-white/50 hover:text-white"}`}
              >
                Góc Gỡ Rối (Gen Z Slang)
              </button>
              <button
                onClick={() => setAiMode("academic")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${aiMode === "academic" ? "bg-white text-black font-bold" : "text-white/50 hover:text-white"}`}
              >
                Ôn Tập & Giải Đề
              </button>
            </div>
          </div>

          {/* 💡 Layperson Simple Explanation Box */}
          <div className="liquid-glass border border-amber-500/20 bg-amber-500/5 text-amber-200 p-5 rounded-2xl flex items-start gap-3 shadow-md">
            <span className="text-xl">💡</span>
            <div>
              <strong className="font-semibold text-sm block">Khái niệm đơn giản dành cho bạn:</strong>
              <p className="text-xs mt-1 text-amber-300/80 leading-relaxed">
                {aiMode === "practical" 
                  ? "Bị sếp bắt tăng ca không lương (OT) là hình thức bóc lột thặng dư tuyệt đối (kéo dài thời gian làm việc). Bị sếp ép tăng KPI hoặc dùng công nghệ AI để bắt làm gấp đôi task trong cùng ca là bóc lột thặng dư tương đối."
                  : "Giáo trình Kinh tế chính trị học quy định chuẩn tắc các học thuyết lớn: Học thuyết giá trị (Hàng hóa, Tiền tệ, Quy luật giá trị), Học thuyết giá trị thặng dư (c, v, m, m', p), và Các thành phần kinh tế định hướng XHCN."}
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

                  <div className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed border whitespace-pre-line overflow-wrap-anywhere ${msg.role === "user"
                    ? "bg-white/5 border-white/10 text-white rounded-tr-none"
                    : "bg-neutral-900/50 border-white/5 text-white/80 rounded-tl-none"
                    }`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {isAiLoading && (
                <div className="flex flex-col gap-3 mr-auto max-w-[85%] animate-fade-rise">
                  <div className="flex gap-3 items-center">
                    <div className="rounded-xl bg-neutral-900 border border-white/5 text-white w-8 h-8 flex items-center justify-center overflow-hidden">
                      <img src={animeTeacher} alt="Thầy Nam AI" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-[10px] text-white/40 font-mono tracking-wider uppercase animate-pulse">
                      Thầy Nam AI đang phân tích...
                    </div>
                  </div>

                  <div className="pl-11 py-1">
                    <div className="Strich-container scale-[0.72] origin-left">
                      <div className="Strich1"></div>
                      <div className="Strich2"></div>
                      <div className="bubble"></div>
                      <div className="bubble1"></div>
                      <div className="bubble2"></div>
                      <div className="bubble3"></div>
                    </div>
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
      )}

      {/* 8. DIALECTICAL DEBATE SECTION */}
      {activeView === "market-dynamics" && (
        <section id="market-dynamics" className="subpage-shell relative bg-background px-2 md:px-4 pt-16 pb-20 border-t border-white/10 flex flex-col items-center min-h-[75vh]">
          <div className="max-w-[98%] w-full space-y-6 animate-fade-rise">

            {/* Back Button */}
            <div className="pb-4">
              <button
                onClick={() => scrollToSection("theory")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
              </button>
            </div>

            <Suspense fallback={
              <div className="flex flex-col items-center justify-center p-12 text-xs font-bold text-neutral-400 gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-t-transparent border-blue-500 animate-spin" />
                Đang tải Võ Đài Biện Chứng...
              </div>
            }>
              <CardBattleArena />
            </Suspense>

          </div>
        </section>
      )}

      {/* 9. ETHICAL BOSS CHALLENGE SECTION */}
      {activeView === "ethical-challenge" && (
        <section id="ethical-challenge" className="subpage-shell relative bg-background px-2 md:px-4 pt-16 pb-20 border-t border-white/10 flex flex-col items-center min-h-[75vh]">
          <div className="max-w-[98%] w-full space-y-6 animate-fade-rise">

            {/* Back Button */}
            <div className="pb-4">
              <button
                onClick={() => scrollToSection("theory")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
              </button>
            </div>

            <Suspense fallback={
              <div className="flex flex-col items-center justify-center p-12 text-xs font-bold text-neutral-400 gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-t-transparent border-blue-500 animate-spin" />
                Đang tải Giám Đốc Hắc Ám...
              </div>
            }>
              <DarkCeoGame />
            </Suspense>

          </div>
        </section>
      )}

      {/* 10. GDP SECTOR MATRIX SECTION */}
      {activeView === "gdp-sectors" && (
        <section id="gdp-sectors" className="subpage-shell relative bg-background px-2 md:px-4 pt-16 pb-20 border-t border-white/10 flex flex-col items-center min-h-[75vh]">
          <div className="max-w-[98%] w-full space-y-6 animate-fade-rise">

            {/* Back Button */}
            <div className="pb-4">
              <button
                onClick={() => scrollToSection("theory")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
              </button>
            </div>

            <Suspense fallback={
              <div className="flex flex-col items-center justify-center p-12 text-xs font-bold text-neutral-400 gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-t-transparent border-blue-500 animate-spin" />
                Đang tải Kinh Tế Kỳ Thành...
              </div>
            }>
              <SimEconCity />
            </Suspense>

          </div>
        </section>
      )}

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

      {/* Draggable Chibi Mascot & Quick Chat Overlay */}
      <div ref={dragConstraintsRef} className="fixed inset-0 pointer-events-none z-50">
        
        {/* Chat Window Panel */}
        <AnimatePresence>
          {isFloatingChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              drag
              dragControls={floatingChatDragControls}
              dragListener={false}
              dragConstraints={dragConstraintsRef}
              dragMomentum={false}
              dragElastic={0}
              onDragEnd={(_, info) => {
                setFloatingChatPosition(prev => clampFloatingChatPosition({
                  x: prev.x + info.offset.x,
                  y: prev.y + info.offset.y
                }));
              }}
              style={{ left: floatingChatPosition.x, top: floatingChatPosition.y }}
              className="pointer-events-auto absolute w-[min(380px,calc(100vw-24px))] h-[min(75vh,560px)] liquid-glass border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 bg-black/90 backdrop-blur-md sm:w-[380px] md:w-[400px] sm:h-[560px] md:h-[620px]"
            >
              {/* Header */}
              <div
                onPointerDown={event => floatingChatDragControls.start(event)}
                className="flex items-center justify-between px-4.5 py-3 border-b border-white/10 bg-white/5 cursor-grab active:cursor-grabbing select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full border border-white/20 overflow-hidden bg-neutral-900">
                    <img src={chibiTeacher} alt="Thầy Nam Chibi" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-[14px] md:text-[15px] tracking-wide font-sans">Thầy Nam AI Coach</h3>
                    <span className="text-[10px] md:text-[11px] text-emerald-400 font-medium font-sans flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Sẵn sàng trợ giúp
                    </span>
                  </div>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={() => setIsFloatingChatOpen(false)}
                  className="p-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Mode Toggle inside Floating Chat */}
              <div className="px-4.5 py-2.5 border-b border-white/5 bg-white/[0.01] flex items-center justify-between gap-4">
                <span className="text-[10px] uppercase font-sans tracking-wider text-white/40 font-bold">Chế độ hỏi đáp:</span>
                <div className="flex bg-neutral-950/80 border border-white/10 rounded-lg p-0.5">
                  <button
                    onClick={() => setAiMode("practical")}
                    className={`px-3.5 py-1 rounded-md text-xs font-bold tracking-wide transition-all cursor-pointer ${aiMode === "practical" ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
                  >
                    Góc Gỡ Rối
                  </button>
                  <button
                    onClick={() => setAiMode("academic")}
                    className={`px-3.5 py-1 rounded-md text-xs font-bold tracking-wide transition-all cursor-pointer ${aiMode === "academic" ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
                  >
                    Ôn Tập
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4.5 overflow-y-auto space-y-4 scrollbar-thin">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 max-w-[92%] sm:max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                  >
                    <div className={`rounded-xl flex-shrink-0 w-8 h-8 flex items-center justify-center border overflow-hidden ${msg.role === "user" ? "p-1.5 bg-white text-black border-white" : "p-0 bg-neutral-900 border-white/10"}`}>
                      {msg.role === "user" ? <User className="w-4 h-4" /> : <img src={chibiTeacher} alt="Thầy Nam" className="w-full h-full object-cover" />}
                    </div>

                    <div className={`p-3 px-3.5 rounded-2xl text-xs md:text-sm leading-relaxed tracking-wide font-sans font-normal border whitespace-pre-line overflow-wrap-anywhere ${msg.role === "user"
                      ? "bg-white/5 border-white/10 text-white rounded-tr-none"
                      : "bg-neutral-900/50 border-white/5 text-white/80 rounded-tl-none"}`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isAiLoading && (
                  <div className="flex flex-col gap-3 mr-auto items-start max-w-[85%] animate-fade-rise">
                    <div className="flex gap-3 items-center">
                      <div className="rounded-xl bg-neutral-900 border border-white/5 text-white w-8 h-8 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img src={chibiTeacher} alt="Thầy Nam" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-[11px] text-white/40 font-sans tracking-wider uppercase animate-pulse">
                        Thầy Nam AI đang suy ngẫm...
                      </div>
                    </div>
                    
                    {/* Shifting loading bubbles */}
                    <div className="pl-11 py-1">
                      <div className="Strich-container scale-[0.55] origin-left">
                        <div className="bubble"></div>
                        <div className="bubble1"></div>
                        <div className="bubble2"></div>
                        <div className="bubble3"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-3.5 bg-neutral-950/80 border-t border-white/10 flex gap-2.5 items-center">
                <input
                  type="text"
                  value={floatingAiGrievance}
                  onChange={e => setFloatingAiGrievance(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSendFloatingGrievance();
                    }
                  }}
                  placeholder={aiMode === "practical" ? "Bị sếp ép OT, quỵt lương... Hỏi thầy ngay!" : "Nhập câu hỏi trắc nghiệm hoặc lý thuyết..."}
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-xs md:text-sm text-white placeholder-white/35 focus:outline-none focus:border-white focus:bg-white/10 h-11 font-sans"
                />
                <button
                  disabled={isAiLoading || !floatingAiGrievance.trim()}
                  onClick={handleSendFloatingGrievance}
                  className="w-11 h-11 rounded-2xl bg-white hover:bg-stone-200 disabled:bg-neutral-800 disabled:text-neutral-500 text-black transition-all cursor-pointer flex items-center justify-center border-none flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Draggable Chibi Mascot Sticker - Magnified & Borderless */}
        {activeView === "home" && (
          <motion.div
            drag
            dragConstraints={dragConstraintsRef}
            dragMomentum={false}
            dragElastic={0.05}
            whileDrag={{ scale: 1.05, cursor: "grabbing" }}
            className="pointer-events-auto fixed z-50 w-40 h-52 md:w-48 md:h-60 cursor-grab"
            style={{ right: 16, bottom: 24 }}
            onTap={() => setIsFloatingChatOpen(prev => !prev)}
            onMouseEnter={handleMascotMouseEnter}
            onMouseLeave={() => setIsMascotHovered(false)}
          >
            <div className="relative w-full h-full group">
              {/* Speech Bubble */}
              <AnimatePresence>
                {isMascotHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 p-3 rounded-2xl bg-neutral-950/90 border border-white/20 text-white text-[11px] font-medium text-center shadow-2xl pointer-events-none"
                    style={{ backdropFilter: "blur(12px)" }}
                  >
                    {mascotBubbleText}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-3 h-3 rotate-45 bg-neutral-950/90 border-r border-b border-white/20"></div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chibi character sticker container - completely borderless with high-detail drop shadow */}
              <div className="relative w-full h-full overflow-visible flex items-center justify-center filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]">
                <img
                  src={chibiTeacher}
                  alt="Thầy Nam Chibi"
                  className="w-full h-full object-contain select-none pointer-events-none transform group-hover:scale-105 transition-transform"
                />
              </div>
              
              {/* Green circular indicator dot integrated directly above the character's right shoulder area */}
              <span className="absolute top-2 right-4 w-4 h-4 bg-emerald-400 border-2 border-background rounded-full shadow-md animate-pulse z-10"></span>
            </div>
          </motion.div>
        )}

      </div>

    </div>
  );
}
