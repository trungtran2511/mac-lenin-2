import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import {
  Compass,
  ArrowRight,
  ArrowLeft,
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
  Briefcase,
  Download,
  RotateCcw
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
import FloatingParticles from "./components/FloatingParticles";
import HomeFeatureCards from "./components/HomeFeatureCards";
import PhilosophySection from "./components/PhilosophySection";
import RainbowPreloader from "./components/RainbowPreloader";
import ServicesSection from "./components/ServicesSection";
import animeTeacher from "./assets/anime_teacher.png";
import chibiTeacher from "./assets/chibi_teacher.png";

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

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

interface FloatingChatPosition {
  x: number;
  y: number;
}

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

export default function App() {
  const dragConstraintsRef = useRef<HTMLDivElement>(null);
  const floatingChatDragControls = useDragControls();
  const [economyData, setEconomyData] = useState<EconomyData>(FALLBACK_DATA);
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

  // Self-study & practice quiz states
  const [quizSubTab, setQuizSubTab] = useState<'syllabus' | 'practice'>('syllabus');
  const [activeChapterId, setActiveChapterId] = useState<number | null>(1); // null means All Chapters
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [userSelectedOption, setUserSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showQuizSummary, setShowQuizSummary] = useState(false);
  const [selectedChapterDetails, setSelectedChapterDetails] = useState<number>(1);

  // Job offer page states
  const [selectedJobId, setSelectedJobId] = useState("student-tutor");
  const [workMonths, setWorkMonths] = useState(1);
  const [isAiApplied, setIsAiApplied] = useState(false);

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
  const [selectedDebateId, setSelectedDebateId] = useState("study-vs-work");

  // Ethical Dilemma states
  const [dilemmaIndex, setDilemmaIndex] = useState(0);
  const [bossScores, setBossScores] = useState({ profit: 50, competitiveness: 50, social: 50 });
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);

  // Sectors states
  const [selectedSectorId, setSelectedSectorId] = useState("state-economy");

  // Hero search query state
  const [searchQuery, setSearchQuery] = useState("");

  // Floating mascot chat overlay states
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);
  const [floatingAiGrievance, setFloatingAiGrievance] = useState("");
  const [floatingChatPosition, setFloatingChatPosition] = useState<FloatingChatPosition>({ x: 12, y: 12 });

  const getFloatingChatSize = () => {
    if (typeof window === "undefined") {
      return { width: 540, height: 750 };
    }

    if (window.innerWidth < 640) {
      return {
        width: Math.min(480, window.innerWidth - 24),
        height: Math.min(675, Math.round(window.innerHeight * 0.78))
      };
    }

    if (window.innerWidth < 768) {
      return { width: 480, height: 650 };
    }

    return { width: 540, height: 750 };
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
  }, []);

  // Job calculations
  const currentJob = economyData.job_offers.find(j => j.id === selectedJobId) || economyData.job_offers[0];

  const necessaryHours = isAiApplied
    ? currentJob.necessary_hours * (1 - economyData.tech_scenarios[0].labor_reduction_pct / 100)
    : currentJob.necessary_hours;
  const surplusHours = isAiApplied
    ? (currentJob.hours_per_day) - necessaryHours
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

  const findOfflineAnswer = (message: string) => {
    if (!curriculumData) return null;
    const msgLower = message.toLowerCase().trim();

    // Mapping keywords to Chapter IDs
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
            chapterId: chapter.id,
            title: chapter.title,
            summary: chapter.summary
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
          setChatMessages(prev => [...prev, {
            role: "assistant",
            text: `📖 **[Thông tin chính thức từ Giáo trình - Chương ${offlineMatch.chapterId}]**\n\n*${offlineMatch.title}*\n\n${offlineMatch.summary}\n\n---\n*💡 Đồng chí cần hỏi giải thích sâu hơn hoặc khía cạnh ngoài giáo trình? Hãy nhập thêm chi tiết nhé! Thầy Nam AI luôn sẵn sàng.*`
          }]);
          setIsAiLoading(false);
        }, 600);
        return;
      }
    }

    // 2. Call API (Google Gemini API or Web2API endpoint)
    const apiUrl = import.meta.env.VITE_GEMINI_API_URL || "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    const isGoogleDirect = apiUrl.includes("generativelanguage.googleapis.com");

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
         Nếu dữ liệu giáo trình không đủ để trả lời trực tiếp, bạn phải bắt đầu câu trả lời bằng đúng dòng: "[Nội dung này nằm ngoài phạm vi giáo trình chính thức]".
         Khi có cảnh báo ngoài phạm vi, chỉ được bổ sung kiến thức chung thật ngắn gọn, trung lập, và phải nói rõ phần đó không phải trích từ giáo trình.
         Không được bịa số liệu, tác giả, chương mục hoặc đáp án trắc nghiệm không có trong dữ liệu.

         DỮ LIỆU GIÁO TRÌNH:
         ${curriculumContext}

         Hãy giải thích rõ ràng các khái niệm, quy luật bằng tiếng Việt khoa học, dễ hiểu nhất để sinh viên ôn thi đạt điểm cao.`
      : "Bạn là Thầy Nam AI - cố vấn triết học Gen Z hài hước nhưng cực kỳ tích cực. Người dùng sẽ kể cho bạn nỗi đau đi làm thêm (bị quỵt lương, ép KPI, làm quá giờ không lương). Hãy dùng lý luận Kinh tế chính trị Mác - Lênin (bóc lột thặng dư tuyệt đối/tương đối, giá trị sức lao động, bản chất bóc lột của nhà tư bản) để giải thích tình trạng của họ bằng giọng điệu hài hước, dí dỏm, sử dụng slang Gen Z trẻ trung. Cuối cùng, hãy đưa ra lời khuyên tích cực, định hướng sinh viên tự chủ lao động, tập trung học tập nâng cao chất lượng bản thân và biết bảo vệ quyền lợi hợp pháp.";

    try {
      let response;
      if (isGoogleDirect) {
        response = await fetch(`${apiUrl}?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            systemInstruction: {
              parts: [{ text: systemInstructionText }]
            }
          })
        });
      } else {
        response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash",
            messages: [
              { role: "system", content: systemInstructionText },
              { role: "user", content: promptText }
            ]
          })
        });
      }

      if (!response.ok) throw new Error("Failed to connect to AI");

      const resData = await response.json();
      let aiResponse = "";
      if (isGoogleDirect) {
        aiResponse = resData.candidates?.[0]?.content?.parts?.[0]?.text || "Mác AI đang suy ngẫm, vui lòng thử lại nhé đồng chí!";
      } else {
        aiResponse = resData.choices?.[0]?.message?.content || resData.candidates?.[0]?.content?.parts?.[0]?.text || "Mác AI đang suy ngẫm, vui lòng thử lại nhé đồng chí!";
      }

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase().trim();
    if (query.includes("lương") || query.includes("thặng dư") || query.includes("labor") || query.includes("salary") || query.includes("value")) {
      scrollToSection("surplus-value");
    } else if (query.includes("mác") || query.includes("ai") || query.includes("assistant") || query.includes("bot")) {
      scrollToSection("marxist-ai");
    } else if (query.includes("tự học") || query.includes("trắc nghiệm") || query.includes("giáo trình") || query.includes("study") || query.includes("quiz")) {
      scrollToSection("self-study");
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
    { label: "Trang Chủ", target: "theory", active: activeView === "home" },
    { label: "Tính Lương", target: "surplus-value", active: activeView === "calculator" },
    { label: "Tự Học", target: "self-study", active: activeView === "self-study" },
    { label: "Lý Luận", target: "about-section", active: false },
    { label: "Mác AI", target: "marxist-ai", active: activeView === "ai-consultant" },
    { label: "Cơ Cấu GDP", target: "gdp-sectors", active: activeView === "gdp-sectors" },
  ];

  const PIE_COLORS = ["#ffffff", "#a3a3a3", "#404040"];

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
        <section id="surplus-value" className="subpage-shell relative bg-background px-6 md:px-28 py-32 border-t border-white/10 flex flex-col items-center min-h-[75vh]">
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
                  <h3 className="font-semibold text-white text-sm uppercase tracking-wider font-mono">Phân tách ngày làm việc tiêu chuẩn {currentJob.hours_per_day} giờ</h3>
                  <div className="flex items-center gap-4 text-[10px] uppercase font-mono tracking-wider text-white/50">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-white rounded-full"></span> Tất yếu (v)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-neutral-600 rounded-full"></span> Thặng dư (m)</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="w-full h-8 bg-neutral-950 rounded-full overflow-hidden flex p-1 border border-white/5">
                    <div
                      style={{ width: `${(necessaryHours / currentJob.hours_per_day) * 100}%` }}
                      className="bg-white h-full rounded-full flex items-center justify-center text-[10px] font-bold text-black transition-all duration-300"
                    >
                      {necessaryHours.toFixed(1)} giờ
                    </div>
                    <div
                      style={{ width: `${(surplusHours / currentJob.hours_per_day) * 100}%` }}
                      className="bg-neutral-600 h-full rounded-full flex items-center justify-center text-[10px] font-bold text-white transition-all duration-300 ml-1"
                    >
                      {surplusHours.toFixed(1)} giờ
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-white/40 uppercase tracking-widest font-mono">
                    <span>Bắt đầu ca làm</span>
                    <span className="text-white font-semibold">
                      Đạt đủ giá trị sức lao động tại {necessaryHours.toFixed(1)}h
                    </span>
                    <span>Kết thúc ca</span>
                  </div>
                </div>
              </div>

              {/* Detailed Academic Definitions Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/5 pt-6">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="text-[10px] font-bold text-white/40 uppercase font-mono">Tư bản khả biến (v)</div>
                  <div className="text-xs font-semibold text-white mt-1">{(currentJob.salary).toLocaleString()} đ</div>
                  <div className="text-[9px] text-white/30 mt-0.5 leading-tight">Tiền công/lương hàng tháng của bạn</div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="text-[10px] font-bold text-white/40 uppercase font-mono">Tư bản bất biến (c)</div>
                  <div className="text-xs font-semibold text-white mt-1">
                    {selectedJobId === "delivery-rider" ? "Xe máy, xăng xe" : selectedJobId === "freelance-coder" ? "Laptop, điện nước" : "Chủ quán trang bị"}
                  </div>
                  <div className="text-[9px] text-white/30 mt-0.5 leading-tight">Công cụ tư liệu lao động tự túc</div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="text-[10px] font-bold text-white/40 uppercase font-mono">Tất yếu (t)</div>
                  <div className="text-xs font-semibold text-white mt-1">{necessaryHours.toFixed(1)} giờ</div>
                  <div className="text-[9px] text-white/30 mt-0.5 leading-tight">Thời gian làm bù đắp sức lao động</div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="text-[10px] font-bold text-white/40 uppercase font-mono">Thặng dư (t')</div>
                  <div className="text-xs font-semibold text-white mt-1">{surplusHours.toFixed(1)} giờ</div>
                  <div className="text-[9px] text-white/30 mt-0.5 leading-tight">Thời gian làm lợi không công cho sếp</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5 pt-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block font-mono">Tỷ suất giá trị thặng dư (m')</span>
                  <div className="text-3xl font-serif text-white">{surplusRatio.toFixed(1)}%</div>
                  <p className="text-xs text-white/50 leading-relaxed mt-1">
                    Trình độ bóc lột sức lao động của giới chủ là {surplusRatio.toFixed(0)}%. Bạn đang làm lợi thêm {surplusRatio.toFixed(0)}% giá trị bên ngoài tiền lương.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block font-mono">Mác luận giải thực tế</span>
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

            {/* Positive Bulletin: Knowledge is Power */}
            <div className="border-t border-white/5 pt-6 mt-4">
              <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Bản tin tích cực: Sức mạnh tri thức lao động
                  </span>
                  <h4 className="text-white font-bold text-sm">Nâng cao Giá Trị Sức Lao Động của Bản Thân!</h4>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Theo lý thuyết của Các Mác, tiền lương đại diện cho giá trị sức lao động để duy trì cuộc sống. Để giảm bớt sự bóc lột thặng dư và nâng tầm vị thế bản thân, con đường bền vững nhất là <strong>tập trung học tập tích lũy tri thức chuyên môn sâu sắc</strong>. Khi chất lượng sức lao động của bạn tăng lên (CHẤT), giá trị trao đổi của nó trên thị trường lao động sẽ tăng vọt, biến bạn thành lực lượng lao động chất lượng cao tự chủ!
                  </p>
                </div>
                <button
                  onClick={() => scrollToSection("marxist-ai")}
                  className="px-5 py-3 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10 whitespace-nowrap cursor-pointer flex items-center gap-2"
                >
                  Tham khảo Thầy Nam AI <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>
      )}

      {/* 6.5. SELF-STUDY & PRACTICE SECTION */}
      {activeView === "self-study" && (
        <section id="self-study" className="subpage-shell relative bg-background px-6 md:px-28 py-32 border-t border-white/10 flex flex-col items-center min-h-[75vh]">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Chapters list sidebar */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block font-mono px-2">Danh sách chương học</span>
                  {curriculumData?.chapters.map(chapter => (
                    <button
                      key={chapter.id}
                      onClick={() => setSelectedChapterDetails(chapter.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex flex-col gap-1.5 cursor-pointer ${selectedChapterDetails === chapter.id ? "bg-white border-white text-black" : "bg-neutral-900/50 border-white/5 text-white/70 hover:bg-white/5 hover:text-white"}`}
                    >
                      <span className={`text-[10px] font-bold uppercase tracking-wider font-mono ${selectedChapterDetails === chapter.id ? "text-neutral-500" : "text-white/40"}`}>
                        Chương {chapter.id}
                      </span>
                      <h4 className="text-xs font-bold leading-tight">{chapter.title}</h4>
                    </button>
                  ))}
                </div>

                {/* Chapter details content panel */}
                <div className="md:col-span-2 liquid-glass rounded-3xl p-8 border border-white/10 space-y-6 flex flex-col justify-between">
                  {(() => {
                    const activeCh = curriculumData?.chapters.find(c => c.id === selectedChapterDetails);
                    if (!activeCh) return null;
                    return (
                      <>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                            <span className="px-2.5 py-1 text-[9px] font-bold bg-white/10 text-white border border-white/15 rounded-md uppercase font-mono">
                              Hệ thống tri thức
                            </span>
                            <span className="text-white/40 text-[10px] font-mono">Chương {activeCh.id}</span>
                          </div>
                          
                          <h3 className="text-xl font-bold text-white tracking-tight leading-snug">{activeCh.title}</h3>
                          
                          <div className="text-xs text-white/70 leading-relaxed space-y-4 whitespace-pre-line font-light">
                            {activeCh.summary}
                          </div>
                        </div>

                        <div className="border-t border-white/5 pt-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <span className="text-[10px] text-white/30 font-mono italic">
                            *Tóm tắt cô đọng theo giáo trình của Bộ Giáo dục & Đào tạo.
                          </span>
                          <button
                            onClick={() => {
                              setActiveChapterId(activeCh.id);
                              setQuizSubTab("practice");
                              handleResetQuiz();
                            }}
                            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
                          >
                            Luyện trắc nghiệm Chương {activeCh.id} <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
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
                            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 text-xs md:text-sm text-white/90 leading-relaxed animate-fade-rise space-y-2 mt-4">
                              <div className="flex items-center gap-2 text-[10px] font-bold font-mono tracking-wider text-white/50 uppercase">
                                <HelpCircle className="w-4 h-4" /> Luận giải học thuật của Thầy Nam:
                              </div>
                              <p className="font-light">{qObj.explanation}</p>
                              <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-white/5 mt-4">
                                <button
                                  onClick={() => {
                                    setAiMode("academic");
                                    setActiveView("ai-consultant");
                                    handleSendChat(`Tôi đang học câu trắc nghiệm này: "${qObj.question}". Các đáp án là: A. ${qObj.options[0]}, B. ${qObj.options[1]}, C. ${qObj.options[2]}, D. ${qObj.options[3]}. Bạn giải thích kỹ hơn giùm tôi lý thuyết liên quan đến câu này được không?`);
                                  }}
                                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <Bot className="w-4 h-4" /> Hỏi Thầy Nam AI câu này
                                </button>
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
        <section id="market-dynamics" className="subpage-shell relative bg-background px-6 md:px-28 py-32 border-t border-white/10 flex flex-col items-center min-h-[75vh]">
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

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-white/40 text-xs tracking-widest uppercase block mb-1 font-mono">Quy luật mâu thuẫn & Lượng - Chất</span>
              <h2 className="text-3xl md:text-5xl text-white tracking-tight flex items-center gap-3" style={{ fontFamily: "'Instrument Serif', serif" }}>
                <TrendingUp className="text-white w-8 h-8" /> Võ Đài Biện Chứng Sinh Viên
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wider font-mono">Chọn mâu thuẫn:</label>
              <select
                value={selectedDebateId}
                onChange={e => setSelectedDebateId(e.target.value)}
                className="liquid-glass rounded-xl text-xs md:text-sm font-medium py-2.5 px-4 pr-10 border border-white/10 text-white outline-none appearance-none"
              >
                {economyData.dialectical_debates.map(deb => (
                  <option key={deb.id} value={deb.id} className="bg-background text-white">{deb.title}</option>
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
                Thế giới quan Marxist coi <strong>mâu thuẫn biện chứng</strong> là nguồn gốc của sự phát triển. Các mặt đối lập không tiêu diệt nhau hoàn toàn mà vừa đấu tranh vừa thống nhất. Đồng thời, sự tích lũy dần về <strong>LƯỢNG</strong> (ví dụ: số tuần học tập và rèn luyện) khi đạt đến 'Điểm nút' sẽ dẫn đến bước nhảy biến đổi về <strong>CHẤT</strong> (nâng tầm trình độ bản sắc).
              </p>
            </div>
          </div>

          {/* Two Opposing Forces */}
          {(() => {
            const currentDebate = economyData.dialectical_debates.find(d => d.id === selectedDebateId) || economyData.dialectical_debates[0];
            return (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Side A */}
                  <div className="liquid-glass rounded-3xl p-6 border border-white/10 bg-white/[0.01] space-y-4">
                    <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                      <h3 className="font-bold text-white text-sm uppercase tracking-wider font-mono">{currentDebate.side_a}</h3>
                    </div>
                    <ul className="space-y-3">
                      {currentDebate.side_a_arguments.map((arg, idx) => (
                        <li key={idx} className="text-xs text-white/70 leading-relaxed flex items-start gap-2">
                          <span className="text-red-400/80 mt-0.5">•</span>
                          <span>{arg}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Side B */}
                  <div className="liquid-glass rounded-3xl p-6 border border-white/10 bg-white/[0.01] space-y-4">
                    <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                      <h3 className="font-bold text-white text-sm uppercase tracking-wider font-mono">{currentDebate.side_b}</h3>
                    </div>
                    <ul className="space-y-3">
                      {currentDebate.side_b_arguments.map((arg, idx) => (
                        <li key={idx} className="text-xs text-white/70 leading-relaxed flex items-start gap-2">
                          <span className="text-blue-400/80 mt-0.5">•</span>
                          <span>{arg}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recharts Chart: Lượng và Chất */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 liquid-glass rounded-3xl p-6 border border-white/10 space-y-4">
                    <h3 className="font-semibold text-white text-sm uppercase tracking-wider font-mono">
                      Biểu đồ Biện Chứng: Tích lũy Lượng - Biến đổi Chất
                    </h3>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={currentDebate.chart_data}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                          <XAxis dataKey="step" stroke="rgba(255, 255, 255, 0.4)" fontSize={11} />
                          <YAxis yAxisId="left" stroke="rgba(255, 255, 255, 0.4)" fontSize={11} label={{ value: 'Lượng (Tích lũy)', angle: -90, position: 'insideLeft', fill: 'rgba(255, 255, 255, 0.4)', offset: 10 }} />
                          <YAxis yAxisId="right" orientation="right" stroke="rgba(52, 211, 153, 0.6)" fontSize={11} label={{ value: 'Chất (Trình độ/Giá trị)', angle: 90, position: 'insideRight', fill: 'rgba(52, 211, 153, 0.6)', offset: 10 }} />
                          <ChartTooltip
                            contentStyle={{ backgroundColor: "rgba(10, 31, 53, 0.95)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px" }}
                          />
                          <Legend wrapperStyle={{ fontSize: 11, color: "#fff" }} />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="quantity"
                            name="Lượng tích lũy"
                            stroke="#ffffff"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="quality"
                            name="Chất mới phát triển"
                            stroke="#34d399"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Resolution card */}
                  <div className="liquid-glass rounded-3xl p-6 border border-white/10 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-bold text-white flex items-center gap-2">
                        <Award className="w-5 h-5 text-white" /> Khối Hợp Nhất (Synthesis)
                      </h3>
                      <strong className="text-xs text-white font-bold block mb-1">
                        {currentDebate.resolution.title}
                      </strong>
                      <p className="text-xs text-white/60 leading-relaxed">
                        {currentDebate.resolution.explanation}
                      </p>
                    </div>

                    <div className="text-[10px] text-white/30 tracking-wider font-mono">
                      *Minh họa trực quan Quy luật Lượng - Chất của phép biện chứng duy vật.
                    </div>
                  </div>
                </div>
              </>
            );
          })()}

          </div>
        </section>
      )}

      {/* 9. ETHICAL BOSS CHALLENGE SECTION */}
      {activeView === "ethical-challenge" && (
        <section id="ethical-challenge" className="subpage-shell relative bg-background px-6 md:px-28 py-32 border-t border-white/10 flex flex-col items-center min-h-[75vh]">
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
      )}

      {/* 10. GDP SECTOR MATRIX SECTION */}
      {activeView === "gdp-sectors" && (
        <section id="gdp-sectors" className="subpage-shell relative bg-background px-6 md:px-28 py-32 border-t border-white/10 flex flex-col items-center min-h-[75vh]">
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
              className="pointer-events-auto absolute w-[min(480px,calc(100vw-24px))] h-[min(78vh,675px)] liquid-glass border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 bg-black/90 backdrop-blur-md sm:w-[480px] md:w-[540px] sm:h-[650px] md:h-[750px]"
            >
              {/* Header */}
              <div
                onPointerDown={event => floatingChatDragControls.start(event)}
                className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5 cursor-grab active:cursor-grabbing select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden bg-neutral-900">
                    <img src={chibiTeacher} alt="Thầy Nam Chibi" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm tracking-wide">Thầy Nam AI Coach</h3>
                    <span className="text-[10px] text-emerald-400 font-medium font-mono flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Sẵn sàng trợ giúp
                    </span>
                  </div>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={() => setIsFloatingChatOpen(false)}
                  className="p-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mode Toggle inside Floating Chat */}
              <div className="px-4 py-2 border-b border-white/5 bg-white/[0.01] flex items-center justify-between gap-4">
                <span className="text-[10px] uppercase font-mono tracking-wider text-white/40 font-semibold">Chế độ hỏi đáp:</span>
                <div className="flex bg-neutral-950/80 border border-white/10 rounded-lg p-0.5">
                  <button
                    onClick={() => setAiMode("practical")}
                    className={`px-3 py-1 rounded-md text-[9px] font-bold tracking-wide transition-all cursor-pointer ${aiMode === "practical" ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
                  >
                    Góc Gỡ Rối
                  </button>
                  <button
                    onClick={() => setAiMode("academic")}
                    className={`px-3 py-1 rounded-md text-[9px] font-bold tracking-wide transition-all cursor-pointer ${aiMode === "academic" ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
                  >
                    Ôn Tập
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 scrollbar-thin">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 max-w-[92%] sm:max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                  >
                    <div className={`rounded-xl flex-shrink-0 w-7 h-7 flex items-center justify-center border overflow-hidden ${msg.role === "user" ? "p-1.5 bg-white text-black border-white" : "p-0 bg-neutral-900 border-white/10"}`}>
                      {msg.role === "user" ? <User className="w-3.5 h-3.5" /> : <img src={chibiTeacher} alt="Thầy Nam" className="w-full h-full object-cover" />}
                    </div>

                    <div className={`p-3 rounded-2xl text-xs leading-relaxed border whitespace-pre-line overflow-wrap-anywhere ${msg.role === "user"
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
                      <div className="rounded-xl bg-neutral-900 border border-white/5 text-white w-7 h-7 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img src={chibiTeacher} alt="Thầy Nam" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-[10px] text-white/40 font-mono tracking-wider uppercase animate-pulse">
                        Thầy Nam AI đang suy ngẫm...
                      </div>
                    </div>
                    
                    {/* Shifting loading bubbles */}
                    <div className="pl-10 py-1">
                      <div className="Strich-container scale-[0.6] origin-left">
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
              <div className="p-3 bg-neutral-950/80 border-t border-white/10 flex gap-2 items-center">
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
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-white/35 focus:outline-none focus:border-white focus:bg-white/10 h-10"
                />
                <button
                  disabled={isAiLoading || !floatingAiGrievance.trim()}
                  onClick={handleSendFloatingGrievance}
                  className="p-2.5 rounded-xl bg-white hover:bg-stone-200 disabled:bg-neutral-800 disabled:text-neutral-500 text-black transition-all cursor-pointer flex items-center justify-center border-none"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Draggable Chibi Mascot Sticker - Magnified & Borderless */}
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

      </div>

    </div>
  );
}
