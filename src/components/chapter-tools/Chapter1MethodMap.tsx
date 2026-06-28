import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ChevronRight, HelpCircle, Lightbulb } from "lucide-react";
import { InlineThayNamAI } from "../InlineThayNamAI";
import { loadCurriculumLessons } from "../../lib/curriculum";

interface NodeData {
  id: string;
  title: string;
  shortExplain: string;
  example: string;
  academicDetails: string;
  miniQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

const CHAPTER1_NODES: NodeData[] = [
  {
    id: "object",
    title: "Đối tượng nghiên cứu",
    shortExplain: "Nghiên cứu các quan hệ sản xuất và trao đổi trong mối liên hệ biện chứng với lực lượng sản xuất và kiến trúc thượng tầng.",
    example: "Không nghiên cứu máy cày hoạt động ra sao (kỹ thuật), mà nghiên cứu ai sở hữu máy cày và sản phẩm làm ra được chia thế nào giữa chủ ruộng và nông dân.",
    academicDetails: "Đối tượng của kinh tế chính trị Mác - Lênin là hệ thống các quan hệ giữa người với người trong quá trình sản xuất, phân phối, lưu thông và tiêu dùng của cải vật chất. Các quan hệ này không tồn tại biệt lập mà vận động trên nền tảng trình độ nhất định của lực lượng sản xuất.",
    miniQuiz: {
      question: "Kinh tế chính trị Mác - Lênin tập trung nghiên cứu khía cạnh nào dưới đây?",
      options: [
        "Công nghệ kỹ thuật tiên tiến và cách vận hành máy móc tối ưu.",
        "Hành vi mua sắm tâm lý của một khách hàng cá thể.",
        "Các quan hệ sản xuất và trao đổi trong liên hệ với lực lượng sản xuất.",
        "Quy luật địa chất và tác động khí hậu đối với nguồn tài nguyên."
      ],
      correctIndex: 2,
      explanation: "Đối tượng cốt lõi là hệ thống quan hệ sản xuất và trao đổi xã hội, xem xét biện chứng với lực lượng sản xuất."
    }
  },
  {
    id: "abstraction",
    title: "Trừu tượng hóa khoa học",
    shortExplain: "Phương pháp gạt bỏ các hiện tượng ngẫu nhiên, tạm thời ở bề ngoài để đi sâu vào bản chất của quy luật kinh tế.",
    example: "Hàng ngày giá mỳ tôm lúc tăng lúc giảm vì mưa bão, khuyến mãi (bề ngoài). Trừu tượng hóa giúp ta nhận ra giá cả đó luôn dao động quanh một trục cốt lõi: Giá trị (hao phí lao động).",
    academicDetails: "Đây là phương pháp đặc thù của kinh tế chính trị vì khoa học này không thể dùng phòng thí nghiệm hay kính hiển vi. Nhà nghiên cứu phải dùng sức mạnh của tư duy để phân tách các quan hệ bản chất khỏi các yếu tố ngẫu nhiên xung quanh.",
    miniQuiz: {
      question: "Tại sao kinh tế chính trị cần phương pháp trừu tượng hóa khoa học?",
      options: [
        "Vì không thể đưa các quan hệ kinh tế xã hội vào phòng thí nghiệm vật lý để đo đạc.",
        "Để làm cho các lý thuyết trở nên phức tạp và khó hiểu hơn với đại chúng.",
        "Để bỏ qua hoàn toàn các số liệu thống kê thực tế.",
        "Để thay thế các phép toán bằng suy đoán triết học cảm tính."
      ],
      correctIndex: 0,
      explanation: "Do tính chất xã hội của các quan hệ sản xuất, ta chỉ có thể sử dụng sức mạnh tư duy trừu tượng thay thế cho phòng thí nghiệm."
    }
  },
  {
    id: "cognitive",
    title: "Chức năng Nhận thức",
    shortExplain: "Giúp giải thích bản chất của các hiện tượng kinh tế xung quanh ta (lạm phát, thất nghiệp, giàu nghèo) một cách hệ thống.",
    example: "Thay vì coi lạm phát là do xui xẻo, chức năng nhận thức vạch rõ mối quan hệ giữa lượng tiền phát hành và giá trị hàng hóa lưu thông trên thị trường.",
    academicDetails: "Cung cấp hệ thống khái niệm, phạm trù, và quy luật kinh tế khách quan để giải thích nguồn gốc của các hiện tượng. Giúp hiểu rõ bản chất của các phương thức sản xuất trong lịch sử loài người.",
    miniQuiz: {
      question: "Chức năng nhận thức giúp người học giải quyết vấn đề gì?",
      options: [
        "Biết cách đầu tư cổ phiếu sinh lời ngay lập tức.",
        "Hiểu bản chất và quy luật vận động đằng sau các sự kiện kinh tế xã hội.",
        "Tạo ra máy móc công nghệ mới cho nhà máy.",
        "Vận động mọi người quyên góp từ thiện."
      ],
      correctIndex: 1,
      explanation: "Chức năng nhận thức trang bị thế giới quan khoa học để nhìn ra bản chất quy luật đằng sau các hiện tượng kinh tế rời rạc."
    }
  },
  {
    id: "practical",
    title: "Chức năng Thực tiễn",
    shortExplain: "Cung cấp cơ sở lý luận để Nhà nước hoạch định chính sách vĩ mô và người dân lựa chọn phương án kinh doanh phù hợp.",
    example: "Nhà nước áp dụng quy luật giá trị để điều tiết giá xăng dầu, hỗ trợ thuế để phát triển hợp tác xã nông nghiệp.",
    academicDetails: "Giúp cải biến thực tiễn thông qua việc phát hiện các quy luật khách quan để ứng dụng vào thực tế. Đây là nền tảng lý luận cho đường lối phát triển kinh tế thị trường định hướng XHCN tại Việt Nam.",
    miniQuiz: {
      question: "Biểu hiện nào sau đây thể hiện rõ nhất chức năng thực tiễn?",
      options: [
        "Ghi nhớ chính xác năm xuất hiện thuật ngữ kinh tế chính trị.",
        "Chỉ ra lỗi sai trong các bài viết kinh tế nước ngoài.",
        "Đề xuất chính sách miễn thuế để khuyến khích nông nghiệp công nghệ cao phát triển.",
        "Viết một bài thơ ca ngợi giai cấp công nhân."
      ],
      correctIndex: 2,
      explanation: "Chức năng thực tiễn hướng tới việc ứng dụng lý luận vào hoạch định chính sách và hành động thực tế cải tạo xã hội."
    }
  },
  {
    id: "methodology",
    title: "Chức năng Phương pháp luận",
    shortExplain: "Là nền tảng lý luận cho các môn kinh tế ngành (quản trị kinh doanh, tài chính ngân hàng, thương mại).",
    example: "Trước khi học cách quản lý dòng tiền của một công ty (Tài chính), bạn phải hiểu bản chất 'Tiền tệ là gì' từ kinh tế chính trị.",
    academicDetails: "Trang bị phương pháp luận chung để tiếp cận các khoa học kinh tế cụ thể và các khoa học xã hội khác, tránh cách nhìn phiến diện hoặc thực dụng tầm thường.",
    miniQuiz: {
      question: "Mối quan hệ giữa Kinh tế chính trị và các môn kinh tế ngành là gì?",
      options: [
        "Kinh tế chính trị là môn học phụ, không liên quan đến thực hành.",
        "Kinh tế chính trị cung cấp cơ sở lý luận, phương pháp luận nền tảng cho các môn ngành.",
        "Các môn ngành hoàn toàn thay thế được kinh tế chính trị.",
        "Kinh tế chính trị sao chép kiến thức từ các môn quản trị kinh doanh."
      ],
      correctIndex: 1,
      explanation: "Kinh tế chính trị làm nền tảng lý luận (phương pháp luận) giúp các môn kinh tế cụ thể đi đúng hướng bản chất."
    }
  },
  {
    id: "education",
    title: "Chức năng Giáo dục",
    shortExplain: "Xây dựng thế giới quan khoa học, niềm tin vào con đường phát triển tiến bộ và tinh thần tự chủ lao động sáng tạo.",
    example: "Giúp sinh viên đi làm thêm nhận thức rõ giá trị sức lao động của mình, không cam chịu bị bóc lột bất công và phấn đấu nâng cao trình độ kỹ năng.",
    academicDetails: "Giáo dục ý thức hệ, bồi dưỡng nhân cách, tình yêu lao động và tinh thần trách nhiệm xã hội. Tạo dựng bản lĩnh nhìn nhận các trào lưu kinh tế hiện đại một cách khoa học.",
    miniQuiz: {
      question: "Chức năng giáo dục bồi dưỡng điều gì cho người học?",
      options: [
        "Kỹ năng lập trình phần mềm máy tính.",
        "Thế giới quan khoa học, trân trọng giá trị lao động và trách nhiệm xã hội.",
        "Cách thức thương lượng giảm lương nhân viên.",
        "Khả năng ghi nhớ từ vựng tiếng Anh chuyên ngành."
      ],
      correctIndex: 1,
      explanation: "Chức năng giáo dục xây dựng tư duy tiến bộ, tôn trọng thành quả lao động xã hội và bảo vệ công bằng."
    }
  }
];

const CHAPTER1_NODE_KEYWORDS: Record<string, string[]> = {
  object: ["đối tượng", "quan hệ sản xuất", "trao đổi"],
  abstraction: ["trừu tượng", "phương pháp", "nghiên cứu"],
  cognitive: ["nhận thức", "chức năng"],
  practical: ["thực tiễn", "chức năng"],
  methodology: ["phương pháp luận", "chức năng"],
  education: ["giáo dục", "chức năng"]
};

const normalizeVietnamese = (value: string) =>
  value
    .toLocaleLowerCase("vi-VN")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");

export function Chapter1MethodMap() {
  const [activeNodeId, setActiveNodeId] = useState("object");
  const [userAnswerIndex, setUserAnswerIndex] = useState<number | null>(null);
  const [showAcademicText, setShowAcademicText] = useState(false);
  const [curriculumDetailsByNode, setCurriculumDetailsByNode] = useState<Record<string, string>>({});

  const activeNode = CHAPTER1_NODES.find(n => n.id === activeNodeId) || CHAPTER1_NODES[0];
  const activeCurriculumDetails = curriculumDetailsByNode[activeNode.id] || activeNode.academicDetails;

  useEffect(() => {
    let isMounted = true;

    loadCurriculumLessons()
      .then(lessons => {
        const chapter = lessons.find(item => item.chapterId === 1);
        if (!chapter || !isMounted) return;

        const detailsByNode = CHAPTER1_NODES.reduce<Record<string, string>>((acc, node) => {
          const keywords = CHAPTER1_NODE_KEYWORDS[node.id] || [node.title];
          const matchedPoint = chapter.keyPoints.find(point => {
            const haystack = normalizeVietnamese(`${point.heading} ${point.text} ${(point.details || []).join(" ")}`);
            return keywords.some(keyword => haystack.includes(normalizeVietnamese(keyword)));
          });

          if (matchedPoint) {
            acc[node.id] = [
              `Giáo trình - Chương 1, mục "${matchedPoint.heading}".`,
              matchedPoint.text,
              ...(matchedPoint.details || [])
            ].join("\n");
          }

          return acc;
        }, {});

        setCurriculumDetailsByNode(detailsByNode);
      })
      .catch(() => {
        if (isMounted) setCurriculumDetailsByNode({});
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectAnswer = (idx: number) => {
    if (userAnswerIndex !== null) return;
    setUserAnswerIndex(idx);
  };

  const handleNodeChange = (nodeId: string) => {
    setActiveNodeId(nodeId);
    setUserAnswerIndex(null);
    setShowAcademicText(false);
  };

  // Build context summary for Thay Nam AI inline
  const getAiContextSummary = () => {
    return `Khái niệm Chương 1 đang xem: ${activeNode.title}
Giải thích ngắn: ${activeNode.shortExplain}
Ví dụ thực tế: ${activeNode.example}
Ngữ cảnh giáo trình: ${activeCurriculumDetails.slice(0, 1200)}
Học viên đã trả lời câu hỏi ôn nhanh: ${
      userAnswerIndex !== null
        ? userAnswerIndex === activeNode.miniQuiz.correctIndex
          ? "ĐÚNG"
          : "SAI (chọn phương án " + String.fromCharCode(65 + userAnswerIndex) + ")"
        : "Chưa trả lời"
    }`;
  };

  return (
    <div className="w-full space-y-8 animate-fade-rise">
      {/* Introduction Card */}
      <div className="liquid-glass border border-white/10 rounded-3xl p-6 md:p-8 space-y-4">
        <span className="px-2.5 py-1 text-[9px] font-bold bg-white/10 text-white border border-white/15 rounded-md uppercase font-mono">
          Công cụ Chương 1
        </span>
        <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
          Bản Đồ Phương Pháp & Chức Năng Kinh Tế Chính Trị
        </h3>
        <p className="text-sm md:text-base text-white/60 leading-relaxed font-normal">
          Chương 1 là cánh cửa tri thức dẫn dắt bạn hiểu về thế giới quan khoa học của Mác - Lênin. Click vào từng khái niệm cốt lõi ở cột bên trái để khám phá bản chất lý luận, ví dụ thực tế và làm bài kiểm tra nhanh.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Concept Selector */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-white/40 uppercase tracking-wider block font-mono px-2">
            Mục lục Khái niệm chính
          </span>
          <div className="flex flex-col gap-2.5">
            {CHAPTER1_NODES.map(node => {
              const isActive = node.id === activeNodeId;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => handleNodeChange(node.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    isActive
                      ? "bg-white border-white text-black font-semibold shadow-lg shadow-white/5"
                      : "bg-neutral-900/40 border-white/5 text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isActive ? "bg-black" : "bg-white/20"
                      }`}
                    />
                    <span className="text-sm md:text-base font-bold tracking-tight">{node.title}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isActive ? "text-black" : "text-white/20"}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="liquid-glass border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
            {/* Title */}
            <div className="border-b border-white/5 pb-4">
              <span className="text-xs font-bold text-white/40 uppercase tracking-wider font-mono">Chi tiết khái niệm</span>
              <h4 className="text-lg font-bold text-white mt-1">{activeNode.title}</h4>
            </div>

            {/* Plain explanation */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-white/30 uppercase tracking-wider font-mono block">Giải thích dễ hiểu:</span>
              <p className="text-sm md:text-base text-white/80 leading-relaxed font-normal">
                {activeNode.shortExplain}
              </p>
            </div>

            {/* Everyday Example */}
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono block">Ví dụ đời thường:</span>
                <p className="text-sm text-white/70 leading-relaxed font-normal">
                  {activeNode.example}
                </p>
              </div>
            </div>

            {/* Academic Excerpt Toggle */}
            <div className="border-t border-white/5 pt-4 space-y-3">
              <button
                type="button"
                onClick={() => setShowAcademicText(!showAcademicText)}
                className="text-xs font-bold text-white/50 hover:text-white transition-all flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none"
              >
                <span>{showAcademicText ? "▲ Ẩn" : "▼ Xem"} chi tiết học thuật gốc từ Giáo trình</span>
              </button>
              <AnimatePresence>
                {showAcademicText && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-black/25 border border-white/5 rounded-xl p-4 text-sm text-white/60 leading-relaxed font-mono font-normal">
                      {activeCurriculumDetails}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mini Quiz Panel */}
            <div className="border-t border-white/5 pt-6 space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-white/40" />
                <span className="text-xs font-bold text-white/40 uppercase tracking-wider font-mono">Ôn tập nhanh</span>
              </div>
              
              <h5 className="text-sm md:text-base font-bold text-white leading-relaxed">
                {activeNode.miniQuiz.question}
              </h5>

              <div className="grid grid-cols-1 gap-2.5">
                {activeNode.miniQuiz.options.map((option, idx) => {
                  const isSelected = userAnswerIndex === idx;
                  const isCorrect = idx === activeNode.miniQuiz.correctIndex;
                  const isWrong = isSelected && !isCorrect;

                  let optClass = "bg-neutral-900/40 border-white/5 text-white/80 hover:bg-white/5";
                  if (userAnswerIndex !== null) {
                    if (isCorrect) {
                      optClass = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
                    } else if (isWrong) {
                      optClass = "bg-rose-500/10 border-rose-500/30 text-rose-400";
                    } else {
                      optClass = "bg-neutral-900/20 border-white/5 text-white/30 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectAnswer(idx)}
                      disabled={userAnswerIndex !== null}
                      className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all flex items-start gap-2.5 cursor-pointer ${optClass}`}
                    >
                      <span className="font-mono text-xs font-bold shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <span className="leading-relaxed">{option}</span>
                    </button>
                  );
                })}
              </div>

              {userAnswerIndex !== null && (
                <div className="bg-white/[0.01] border border-white/5 rounded-xl p-4 text-sm leading-relaxed space-y-2 animate-fade-rise">
                  <div className="flex items-center gap-1.5 font-bold">
                    {userAnswerIndex === activeNode.miniQuiz.correctIndex ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Award className="w-4 h-4 text-emerald-400" /> Đúng rồi!
                      </span>
                    ) : (
                      <span className="text-rose-400">Chưa chính xác!</span>
                    )}
                  </div>
                  <p className="text-white/60 font-normal">{activeNode.miniQuiz.explanation}</p>
                </div>
              )}
            </div>
          </div>

          {/* Inline Thay Nam AI Panel */}
          {userAnswerIndex !== null && (
            <InlineThayNamAI
              chapterId={1}
              mode="chapter_tool_explain"
              currentStateSummary={getAiContextSummary()}
              curriculumContext={activeCurriculumDetails}
              placeholderText={`Muốn hiểu thêm về '${activeNode.title}'? Đồng chí cứ hỏi Thầy Nam AI nhé!`}
            />
          )}
        </div>
      </div>
    </div>
  );
}
