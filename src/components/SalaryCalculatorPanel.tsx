import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  AlertTriangle,
  Sparkles,
  Coins,
  CheckCircle2,
  Coffee,
  Film,
  Headphones,
  TrendingUp,
  RotateCcw,
  ArrowUpRight
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as ChartTooltip } from "recharts";

// TypeScript Interfaces
interface SalaryCalculatorPanelProps {
  onAskTeacher: () => void;
}

interface AiClassificationResult {
  job_category: string;
  suggested_hourly_range: [number, number];
  is_exploited_text: string;
  analysis_summary: string;
  advice: string;
}

// Preset Jobs for quick example
interface JobPreset {
  id: string;
  title: string;
  salary: number;
  hoursPerDay: number;
  workingDays: number;
  costOfLiving: number;
  description: string;
}

const JOB_PRESETS: JobPreset[] = [
  {
    id: "student-tutor",
    title: "Gia sư (Dạy kèm học sinh)",
    salary: 2500000,
    hoursPerDay: 4,
    workingDays: 12,
    costOfLiving: 2000000,
    description: "Lương theo giờ của gia sư khá cao so với mặt bằng làm thêm của sinh viên. Tuy nhiên, bạn thường chịu chiết khấu 30-40% tháng lương đầu tiên cho trung tâm gia sư - một phần giá trị thặng dư bị chiếm đoạt trực tiếp bởi giới trung gian môi giới sức lao động."
  },
  {
    id: "cafe-staff",
    title: "Nhân viên phục vụ quán Cafe",
    salary: 1800000,
    hoursPerDay: 4,
    workingDays: 26,
    costOfLiving: 2200000,
    description: "Mức lương theo giờ rất thấp (15k-18k/h), không đủ trang trải chi phí sinh hoạt tối thiểu để tái tạo sức lao động khỏe mạnh. Quán thu lợi nhuận lớn từ các cốc nước bạn pha chế và bưng bê, nhưng tiền lương của bạn chỉ tương xứng với một phần rất nhỏ của lượng giá trị mới mà bạn tạo ra."
  },
  {
    id: "delivery-rider",
    title: "Shipper công nghệ (Grab/Food)",
    salary: 4500000,
    hoursPerDay: 6,
    workingDays: 26,
    costOfLiving: 4000000,
    description: "Bạn phải tự túc phương tiện làm việc (Tư bản bất biến - c) và chịu toàn bộ rủi ro hao mòn xe cộ, tai nạn đường phố. Ứng dụng công nghệ chiết khấu trực tiếp 20-30% doanh thu mỗi cuốc xe của bạn dưới dạng phí nền tảng."
  },
  {
    id: "freelance-coder",
    title: "Freelance Coder (Viết code thuê)",
    salary: 5000000,
    hoursPerDay: 6,
    workingDays: 20,
    costOfLiving: 3500000,
    description: "Bạn tự đầu tư máy tính cấu hình cao (c) và chịu chi phí điện nước tại nhà. Sản phẩm phần mềm bạn viết ra mang lại giá trị sử dụng lớn cho khách hàng, nhưng qua tay các đầu mối thầu dự án trung gian, phần lớn giá trị thặng dư đã bị cắt xén."
  }
];

export function SalaryCalculatorPanel({ onAskTeacher }: SalaryCalculatorPanelProps) {
  // Input states
  const [jobTitle, setJobTitle] = useState("");
  const [salaryInput, setSalaryInput] = useState("");
  const [hoursInput, setHoursInput] = useState("8");
  const [costInput, setCostInput] = useState("");
  const [daysInput, setDaysInput] = useState("26");

  // Output states
  const [workMonths, setWorkMonths] = useState(1);
  const [isAiApplied, setIsAiApplied] = useState(false);

  // AI Classification states
  const [aiResult, setAiResult] = useState<AiClassificationResult | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);

  // Set default values from Cafe preset on mount
  useEffect(() => {
    applyPreset(JOB_PRESETS[1]);
  }, []);

  const applyPreset = (preset: JobPreset) => {
    setJobTitle(preset.title);
    setSalaryInput(preset.salary.toString());
    setHoursInput(preset.hoursPerDay.toString());
    setCostInput(preset.costOfLiving.toString());
    setDaysInput(preset.workingDays.toString());
    setAiResult(null);
    setAiError(null);
    setUsedFallback(false);
  };

  // Convert inputs to numbers
  const monthlySalary = parseFloat(salaryInput) || 0;
  const hoursPerDay = parseFloat(hoursInput) || 0;
  const costOfLiving = parseFloat(costInput) || 0;
  const workingDays = parseFloat(daysInput) || 0;

  // Basic wage calculations
  const totalHoursMonth = workingDays * hoursPerDay;
  const actualHourlyWage = totalHoursMonth > 0 ? monthlySalary / totalHoursMonth : 0;

  // Marxist Surplus Value math
  // Necessary hours (v): hours needed to earn the cost of living (or recreate labor power).
  // Under capitalism, the wage is equal to the cost of living (value of labor power).
  // If the salary is less than the cost of living, then 100% of working hours are "necessary" just to survive
  // (and they still don't meet survival needs - deficit).
  const necessaryHours = Math.max(
    0.1,
    Math.min(
      hoursPerDay,
      monthlySalary > 0 && costOfLiving > 0
        ? (costOfLiving / monthlySalary) * hoursPerDay
        : hoursPerDay
    )
  );

  // Apply tech productivity reduction if AI Relative Surplus is enabled
  const laborReductionPct = 50; // AI productivity reduction from technology scenario
  const effectiveNecessaryHours = isAiApplied
    ? necessaryHours * (1 - laborReductionPct / 100)
    : necessaryHours;

  const surplusHours = Math.max(0, hoursPerDay - effectiveNecessaryHours);

  // Surplus value ratio (m') = (surplus / necessary) * 100%
  const surplusRatio = effectiveNecessaryHours > 0 ? (surplusHours / effectiveNecessaryHours) * 100 : 0;

  // Surplus value pocketed by owner monthly
  const monthlySurplusValue = effectiveNecessaryHours > 0
    ? monthlySalary * (surplusHours / effectiveNecessaryHours)
    : 0;

  const accumulatedSurplus = Math.round(monthlySurplusValue * workMonths);

  const itemsEquivalent = {
    milktea: Math.round(accumulatedSurplus / 50000),
    movie: Math.round(accumulatedSurplus / 100000),
    headphone: Math.round(accumulatedSurplus / 500000)
  };

  // Fallback local rule parser (when Gemini API fails or is offline)
  const getFallbackClassification = (title: string, hourlyWage: number): AiClassificationResult => {
    const normTitle = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d");

    let category = "Lao động phổ thông / Khác";
    let range: [number, number] = [18000, 30000];
    let isExploited = "Bình thường";
    let summary = "Mức lương này tương đối ổn định so với mặt bằng chung các công việc phổ thông.";

    if (
      /code|dev|lap trinh|design|do hoa|cntt|it|phan mem|developer/i.test(normTitle)
    ) {
      category = "Công nghệ / Kỹ thuật cao";
      range = [50000, 150000];
      summary = "Công việc công nghệ đòi hỏi hàm lượng tri thức và chất xám lớn (lao động phức tạp).";
    } else if (/gia su|day hoc|day kem|tro giang|tutor/i.test(normTitle)) {
      category = "Giáo dục / Gia sư";
      range = [30000, 60000];
      summary = "Dạy học yêu cầu kỹ năng sư phạm và truyền đạt kiến thức tốt, lương theo giờ thường nhỉnh hơn phục vụ.";
    } else if (
      /cafe|ca phe|phuc vu|tra sua|tuan hang|ban hang|thu ngan|tiep tan|phu bep|runner|waiter|cashier/i.test(
        normTitle
      )
    ) {
      category = "Dịch vụ / Bán lẻ";
      range = [18000, 25000];
      summary = "Lao động dịch vụ có rào cản gia nhập thấp nhưng cường độ làm việc cao, đứng chân liên tục và chịu áp lực từ khách.";
    } else if (/ship|grab|xe om|giao hang|shopee|be|gojek|rider/i.test(normTitle)) {
      category = "Giao hàng / Vận tải";
      range = [20000, 30000];
      summary = "Shipper chịu chi phí hao mòn xe cộ và rủi ro thời tiết, giao thông cực kỳ lớn để duy trì thu nhập.";
    }

    // Evaluate exploitation based on hourly wage and cost of living
    if (hourlyWage < 15000 || (monthlySalary > 0 && monthlySalary < costOfLiving)) {
      isExploited = "Bóc lột hoàn toàn (Cực kỳ vô lý)";
      summary += " Ôi bạn ơi, mức lương này cực kỳ vô lý luôn! Bạn đang bị bóc lột sức lao động hoàn toàn, sếp trả lương không đủ để bạn trang trải chi phí sống tối thiểu để tái sản xuất sức lao động.";
    } else if (hourlyWage < range[0]) {
      isExploited = "Bóc lột cao";
      summary += ` Mức lương theo giờ của bạn (${Math.round(
        hourlyWage
      ).toLocaleString()} đ) đang thấp hơn đáng kể so với mức trung bình của ngành (${range[0].toLocaleString()} - ${range[1].toLocaleString()} đ).`;
    } else if (hourlyWage >= range[0] && hourlyWage <= range[1]) {
      isExploited = "Bình thường (Đúng giá trị thị trường)";
      summary += ` Thu nhập của bạn đang nằm trong khoảng trung bình ngành (${range[0].toLocaleString()} - ${range[1].toLocaleString()} đ). Bạn đang nhận được đúng giá trị thị trường của sức lao động.`;
    } else {
      isExploited = "Lương cao so với mặt bằng";
      summary += ` Chúc mừng đồng chí! Mức lương của bạn cao hơn mặt bằng chung (${range[0].toLocaleString()} - ${range[1].toLocaleString()} đ). Hãy tiếp tục duy trì và nâng cấp sức lao động nhé!`;
    }

    return {
      job_category: category,
      suggested_hourly_range: range,
      is_exploited_text: isExploited,
      analysis_summary: summary,
      advice:
        hourlyWage < range[0] || monthlySalary < costOfLiving
          ? "Đồng chí nên chủ động thương lượng lại lương hoặc cân nhắc tìm kiếm cơ hội mới xứng đáng hơn. Không nên để giới chủ vắt kiệt sức lao động dưới mức sinh tồn!"
          : "Hãy tiếp tục trau dồi tri thức chuyên môn để chuyển từ lao động giản đơn sang lao động phức tạp, tạo ra nhiều giá trị hơn nữa cho bản thân!"
    };
  };

  // Run AI Classification call to Gemini API
  const handleAiClassify = async () => {
    if (!jobTitle.trim()) {
      setAiError("Vui lòng nhập tên công việc trước khi phân tích!");
      return;
    }

    setIsLoadingAi(true);
    setAiError(null);
    setUsedFallback(false);

    const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    const requestedModel = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";
    const configuredApiUrl = (import.meta.env.VITE_GEMINI_API_URL || "").trim();

    const isLikelyGoogleApiKey = apiKey.startsWith("AIza");
    const isLikelyGoogleAuthKey = apiKey.startsWith("AQ.");
    const isLikelyGoogleAiStudioKey = isLikelyGoogleApiKey || isLikelyGoogleAuthKey;

    const isRuntimeLocalHost = (() => {
      if (typeof window === "undefined") return false;
      return ["localhost", "127.0.0.1", "::1", "0.0.0.0"].includes(window.location.hostname);
    })();

    const localDefaultApiUrl = isLikelyGoogleAiStudioKey
      ? `https://generativelanguage.googleapis.com/v1beta/models/${requestedModel}:generateContent`
      : "/api/chat";

    const apiUrl = configuredApiUrl ? configuredApiUrl : (isRuntimeLocalHost ? localDefaultApiUrl : "/api/chat");
    const isGoogleDirect = apiUrl.includes("generativelanguage.googleapis.com");

    const systemPrompt = `Bạn là một trợ lý AI thông thái chuyên phân tích kinh tế chính trị Mác - Lênin.
Nhiệm vụ của bạn là phân tích công việc và mức lương của người dùng tại Việt Nam.
Hãy phản hồi dưới dạng một đối tượng JSON duy nhất (không có markdown code block \`\`\`json ... \`\`\`, chỉ có chuỗi JSON thuần túy để parse được) chứa các trường sau:
{
  "job_category": "Tên nhóm ngành phân loại (ví dụ: Lao động dịch vụ part-time, Lao động chuyên môn kỹ thuật cao, Lao động tự do, ...)",
  "suggested_hourly_range": [min_hourly_vnd, max_hourly_vnd],
  "is_exploited_text": "Đánh giá mức độ bóc lột (ví dụ: Bóc lột hoàn toàn, Bóc lột cao, Bình thường, Lương tốt)",
  "analysis_summary": "Nhận xét ngắn gọn, thực tế, sử dụng giọng điệu cố vấn Gen Z gần gũi, hài hước nhưng lý luận sâu sắc, phân tích xem mức lương của họ có bị bóc lột hay vô lý không dựa trên lương tháng và chi phí sinh hoạt.",
  "advice": "Lời khuyên thực tế giúp nâng cấp bản thân hoặc thương lượng để bảo vệ quyền lợi."
}`;

    const userPrompt = `Hãy phân tích công việc sau:
- Tên công việc: "${jobTitle}"
- Lương tháng: ${monthlySalary.toLocaleString()} VND
- Số ngày làm việc mỗi tháng: ${workingDays} ngày
- Số giờ làm việc mỗi ngày: ${hoursPerDay} giờ
- Chi phí sinh hoạt tối thiểu mỗi tháng: ${costOfLiving.toLocaleString()} VND
- Lương theo giờ thực tế tính toán được: ${Math.round(actualHourlyWage).toLocaleString()} VND/giờ`;

    try {
      if (isGoogleDirect && !isLikelyGoogleAiStudioKey) {
        throw new Error("Không có Gemini API key hợp lệ.");
      }

      let response;
      if (isGoogleDirect) {
        response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userPrompt }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
          })
        });
      } else {
        response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
          },
          body: JSON.stringify({
            model: requestedModel,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ]
          })
        });
      }

      if (!response.ok) {
        throw new Error(`API response error: ${response.status}`);
      }

      const resData = await response.json();
      let aiText = "";
      if (isGoogleDirect) {
        aiText = resData.candidates?.[0]?.content?.parts?.[0]?.text || "";
      } else {
        aiText = resData.choices?.[0]?.message?.content || resData.candidates?.[0]?.content?.parts?.[0]?.text || "";
      }

      let cleanText = aiText.trim();
      if (cleanText.startsWith("```json")) {
        cleanText = cleanText.substring(7);
      }
      if (cleanText.endsWith("```")) {
        cleanText = cleanText.substring(0, cleanText.length - 3);
      }
      cleanText = cleanText.trim();

      const parsed: AiClassificationResult = JSON.parse(cleanText);
      if (parsed && parsed.job_category && Array.isArray(parsed.suggested_hourly_range)) {
        setAiResult(parsed);
      } else {
        throw new Error("Dữ liệu phản hồi AI không đúng cấu trúc.");
      }
    } catch (err) {
      console.warn("AI Classification failed, using fallback parser:", err);
      // Fail over to local rules
      const localResult = getFallbackClassification(jobTitle, actualHourlyWage);
      setAiResult(localResult);
      setUsedFallback(true);
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Determine warning levels
  const isWageRidiculous = actualHourlyWage < 15000 || (monthlySalary > 0 && monthlySalary < costOfLiving);
  const isWageUnderSuggested = aiResult && actualHourlyWage < aiResult.suggested_hourly_range[0];

  const chartData = [
    {
      name: "Tái tạo Sức lao động (v)",
      value: Number(effectiveNecessaryHours.toFixed(1)),
      color: "#31e981" // Emerald green
    },
    {
      name: "Thặng dư bị chủ chiếm (m)",
      value: Number(surplusHours.toFixed(1)),
      color: isWageRidiculous ? "#737373" : "#ff8a00" // Gray if ridiculous/unviable, Amber if standard
    }
  ];

  return (
    <div className="space-y-10">
      {/* Upper header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-white/40 text-xs tracking-widest uppercase block mb-1 font-mono">
            Công cụ thực nghiệm & Lý luận biện chứng
          </span>
          <h2
            className="text-3xl md:text-5xl text-white tracking-tight flex items-center gap-3"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            <Briefcase className="text-white w-8 h-8" /> Sự Thật Về Tiền Lương & Thặng Dư
          </h2>
        </div>

        <button
          onClick={onAskTeacher}
          className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-all font-mono font-bold"
        >
          Hỏi Thầy Nam AI <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 💡 Layperson Simple Explanation Box */}
      <div className="liquid-glass border border-amber-500/20 bg-amber-500/5 text-amber-200 p-5 rounded-2xl flex items-start gap-3 shadow-md">
        <span className="text-xl">💡</span>
        <div>
          <strong className="font-semibold text-sm block">Khái niệm đơn giản dành cho bạn:</strong>
          <p className="text-xs mt-1 text-amber-300/80 leading-relaxed">
            Sếp trả lương cho bạn dựa trên chi phí sinh hoạt tối thiểu để bạn có thể đi làm hằng ngày (giá trị sức lao động). Nhưng trong ngày làm việc, bạn chỉ mất một phần thời gian (ví dụ 4 tiếng) để làm ra giá trị bằng lương của mình. Thời gian còn lại là thời gian bạn làm không công tạo ra <strong>giá trị thặng dư</strong> để chủ bỏ túi.
          </p>
        </div>
      </div>

      {/* Quick presets row */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-white/50 uppercase tracking-wider font-mono">
          Tải nhanh ví dụ mẫu:
        </label>
        <div className="flex flex-wrap gap-2">
          {JOB_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white transition-all cursor-pointer"
            >
              {preset.title.split(" (")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Form Inputs */}
        <div className="liquid-glass rounded-3xl p-6 border border-white/10 space-y-6">
          <h3 className="font-bold text-white text-base flex items-center gap-2 font-mono uppercase tracking-wider">
            <Coins className="w-4 h-4 text-emerald-400" /> Cấu hình công việc
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-white/60 font-medium">Tên công việc</label>
              <input
                type="text"
                placeholder="Nhập tên việc làm thêm..."
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white focus:bg-white/10 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-white/60 font-medium">Lương tháng (VND)</label>
                <input
                  type="number"
                  placeholder="Ví dụ: 2000000"
                  value={salaryInput}
                  onChange={e => setSalaryInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white focus:bg-white/10 transition-all font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-white/60 font-medium">Chi phí sống/tháng</label>
                <input
                  type="number"
                  placeholder="Ví dụ: 2500000"
                  value={costInput}
                  onChange={e => setCostInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white focus:bg-white/10 transition-all font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-white/60 font-medium">Giờ làm / ngày</label>
                <input
                  type="number"
                  placeholder="Ví dụ: 8"
                  value={hoursInput}
                  onChange={e => setHoursInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white focus:bg-white/10 transition-all font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-white/60 font-medium">Số ngày làm / tháng</label>
                <input
                  type="number"
                  placeholder="Ví dụ: 26"
                  value={daysInput}
                  onChange={e => setDaysInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white focus:bg-white/10 transition-all font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleAiClassify}
              disabled={isLoadingAi || !jobTitle.trim()}
              className="w-full py-3 rounded-xl bg-white hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 font-bold text-xs text-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-white/5"
            >
              {isLoadingAi ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  Đang phân tích dữ liệu...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Phân tích công việc bằng AI
                </>
              )}
            </button>
            {aiError && <p className="text-red-400 text-[10px] mt-2 text-center">{aiError}</p>}
          </div>

          {/* AI Surplus value technology simulation card */}
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col gap-3">
            <div className="flex items-start gap-2.5">
              <div className="p-2 bg-white/10 rounded-lg text-white">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-white uppercase tracking-wider font-mono">
                  Áp dụng AI & Cách mạng Công nghệ
                </h4>
                <p className="text-[10px] text-white/50 mt-0.5 leading-relaxed">
                  Tăng năng suất lao động cá biệt làm rút ngắn thời gian lao động tất yếu.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAiApplied(!isAiApplied)}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                isAiApplied
                  ? "bg-emerald-500 text-black border-emerald-500"
                  : "bg-transparent text-white border-white/20 hover:bg-white/5"
              }`}
            >
              {isAiApplied ? "Hủy áp dụng AI" : "Thử áp dụng AI (Relative Surplus)"}
            </button>
          </div>
        </div>

        {/* Center & Right Column: Results and Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cảnh báo bóc lột và đánh giá lương */}
          <AnimatePresence mode="wait">
            {isWageRidiculous ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="liquid-glass border border-red-500/30 bg-red-950/20 text-red-200 p-5 rounded-2xl flex items-start gap-3.5 shadow-lg"
              >
                <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5 text-red-400 animate-bounce" />
                <div>
                  <strong className="font-bold text-sm block text-red-300 uppercase tracking-wide font-mono">
                    Cảnh báo đỏ: Bạn đang bị bóc lột hoàn toàn!
                  </strong>
                  <p className="text-xs mt-1 text-red-200/80 leading-relaxed font-sans">
                    Lương giờ thực tế của bạn ({Math.round(actualHourlyWage).toLocaleString()} đ/h) quá thấp hoặc
                    tổng lương tháng ({monthlySalary.toLocaleString()} đ) không đủ bù đắp chi phí sinh hoạt tối
                    thiểu cần thiết ({costOfLiving.toLocaleString()} đ). Đây là biểu hiện rõ nét của việc bán sức
                    lao động dưới giá trị thực tế của nó. Giới chủ đang khai thác cạn kiệt thể xác và tinh thần
                    của bạn mà không bồi hoàn đủ lượng hao phí tối thiểu để duy trì sự sống. Bạn đang cống hiến
                    không công 100% thời gian lao động mà không thể tái sản xuất sức lao động lành mạnh.
                  </p>
                </div>
              </motion.div>
            ) : isWageUnderSuggested ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="liquid-glass border border-amber-500/30 bg-amber-950/20 text-amber-200 p-5 rounded-2xl flex items-start gap-3.5 shadow-lg"
              >
                <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5 text-amber-400" />
                <div>
                  <strong className="font-bold text-sm block text-amber-300 uppercase tracking-wide font-mono">
                    Cảnh báo: Lương dưới mức trung bình của ngành!
                  </strong>
                  <p className="text-xs mt-1 text-amber-200/80 leading-relaxed font-sans">
                    Mức lương theo giờ thực tế ({Math.round(actualHourlyWage).toLocaleString()} đ/h) của bạn đang
                    thấp hơn so với ngưỡng đề xuất tối thiểu cho ngành {aiResult?.job_category} (từ{" "}
                    {aiResult?.suggested_hourly_range[0].toLocaleString()} đ/h). Bạn cần đấu tranh đòi hỏi một mức
                    đãi ngộ công bằng hơn để tương xứng với giá trị sức lao động đã bỏ ra!
                  </p>
                </div>
              </motion.div>
            ) : aiResult ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="liquid-glass border border-emerald-500/30 bg-emerald-950/20 text-emerald-200 p-5 rounded-2xl flex items-start gap-3.5 shadow-lg"
              >
                <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5 text-emerald-400" />
                <div>
                  <strong className="font-bold text-sm block text-emerald-300 uppercase tracking-wide font-mono">
                    Đánh giá: {aiResult.is_exploited_text}
                  </strong>
                  <p className="text-xs mt-1 text-emerald-200/80 leading-relaxed font-sans">
                    Mức lương thực tế của bạn ({Math.round(actualHourlyWage).toLocaleString()} đ/h) nằm trong khoảng
                    phù hợp hoặc tốt so với đề xuất của ngành {aiResult.job_category} (khoảng{" "}
                    {aiResult.suggested_hourly_range[0].toLocaleString()} -{" "}
                    {aiResult.suggested_hourly_range[1].toLocaleString()} đ/h). Sức lao động đang được trao đổi ở
                    mức cân bằng.
                  </p>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* AI Analysis Result Board */}
          {aiResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="liquid-glass rounded-3xl p-6 border border-white/10 space-y-4 shadow-xl"
            >
              <div className="flex justify-between items-start border-b border-white/5 pb-3">
                <div>
                  <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider block">
                    Phân tích AI từ Thầy Nam
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    Nhóm việc: <span className="text-emerald-400">{aiResult.job_category}</span>
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider block">
                    Khoảng đề xuất ngành
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    {aiResult.suggested_hourly_range[0].toLocaleString()} -{" "}
                    {aiResult.suggested_hourly_range[1].toLocaleString()} đ/h
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-white/80 leading-relaxed italic bg-white/5 p-3.5 rounded-xl border border-white/5 font-sans">
                  &ldquo;{aiResult.analysis_summary}&rdquo;
                </p>
                <div className="text-[11px] text-emerald-300 leading-relaxed flex items-start gap-2">
                  <span className="text-base leading-none">💡</span>
                  <div>
                    <strong className="font-semibold block text-emerald-200">Khuyên đồng chí:</strong>
                    {aiResult.advice}
                  </div>
                </div>
              </div>
              {usedFallback && (
                <div className="text-[9px] text-white/30 text-right font-mono">
                  *Kết nối AI gián đoạn, đang sử dụng hệ thống phân tích quy luật cục bộ.
                </div>
              )}
            </motion.div>
          )}

          {/* Calculations Detail Box */}
          <div className="liquid-glass rounded-3xl p-8 border border-white/10 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/5 pb-4">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider font-mono">
                  Phân tách ngày làm việc tiêu chuẩn {hoursPerDay} giờ
                </h3>
                <div className="flex items-center gap-4 text-[10px] uppercase font-mono tracking-wider text-white/50">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full"></span> Tất yếu (v)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-neutral-600 rounded-full"></span> Thặng dư (m)
                  </span>
                </div>
              </div>

              {/* Progress split bar */}
              <div className="space-y-3">
                <div className="w-full h-8 bg-neutral-950 rounded-full overflow-hidden flex p-1 border border-white/5">
                  <div
                    style={{ width: `${(effectiveNecessaryHours / hoursPerDay) * 100}%` }}
                    className="bg-emerald-400 h-full rounded-full flex items-center justify-center text-[10px] font-bold text-black transition-all duration-300"
                  >
                    {effectiveNecessaryHours.toFixed(1)} giờ
                  </div>
                  {surplusHours > 0 ? (
                    <div
                      style={{ width: `${(surplusHours / hoursPerDay) * 100}%` }}
                      className="bg-neutral-600 h-full rounded-full flex items-center justify-center text-[10px] font-bold text-white transition-all duration-300 ml-1"
                    >
                      {surplusHours.toFixed(1)} giờ
                    </div>
                  ) : null}
                </div>
                <div className="flex justify-between text-[10px] text-white/40 uppercase tracking-widest font-mono">
                  <span>Bắt đầu ca làm</span>
                  <span className="text-white font-semibold">
                    Giá trị sức lao động hòa vốn tại {effectiveNecessaryHours.toFixed(1)}h
                  </span>
                  <span>Kết thúc ca</span>
                </div>
              </div>
            </div>

            {/* Calculations Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-white/5 pt-6">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-bold text-white/40 uppercase font-mono">
                    Lương theo giờ thực tế
                  </div>
                  <div className="text-lg font-bold text-white mt-1 font-mono">
                    {Math.round(actualHourlyWage).toLocaleString()} đ
                  </div>
                </div>
                <p className="text-[9px] text-white/30 mt-2 leading-relaxed">
                  Lương tháng chia cho tổng số giờ làm việc thực tế trong một tháng.
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-bold text-white/40 uppercase font-mono">
                    Tỷ suất thặng dư (m')
                  </div>
                  <div className="text-lg font-bold text-white mt-1 font-mono">
                    {Math.round(surplusRatio)}%
                  </div>
                </div>
                <p className="text-[9px] text-white/30 mt-2 leading-relaxed">
                  Tỷ lệ thời gian bạn làm không công cho chủ so với thời gian làm cho bản thân.
                </p>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-bold text-white/40 uppercase font-mono">
                    Thặng dư hàng tháng
                  </div>
                  <div className="text-lg font-bold text-white mt-1 font-mono">
                    {Math.round(monthlySurplusValue).toLocaleString()} đ
                  </div>
                </div>
                <p className="text-[9px] text-white/30 mt-2 leading-relaxed">
                  Phần giá trị gia tăng mới mà bạn tạo thêm ngoài lương và bị sếp giữ lại.
                </p>
              </div>
            </div>

            {/* Value Created Distribution Visual Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center border-t border-white/5 pt-6">
              <div className="h-48 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      contentStyle={{
                        backgroundColor: "#031c2a",
                        borderColor: "rgba(255,255,255,0.1)",
                        borderRadius: "12px"
                      }}
                      itemStyle={{ color: "#fff", fontSize: "11px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-[9px] text-white/40 font-mono uppercase tracking-wider block">
                    Tổng giá trị
                  </span>
                  <span className="text-sm font-mono font-bold text-white">
                    {(monthlySalary + monthlySurplusValue).toLocaleString()} đ
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  Cơ cấu giá trị mới tạo ra
                </h4>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full flex-shrink-0" />
                    <span className="text-white/60">Bạn nhận được (v):</span>
                    <strong className="text-white font-mono font-semibold">
                      {monthlySalary.toLocaleString()} đ ({((monthlySalary / (monthlySalary + monthlySurplusValue || 1)) * 100).toFixed(0)}%)
                    </strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: chartData[1].color }}
                    />
                    <span className="text-white/60">Chủ nhận được (m):</span>
                    <strong className="text-white font-mono font-semibold">
                      {Math.round(monthlySurplusValue).toLocaleString()} đ ({((monthlySurplusValue / (monthlySalary + monthlySurplusValue || 1)) * 100).toFixed(0)}%)
                    </strong>
                  </li>
                </ul>
                <p className="text-[10px] text-white/45 leading-relaxed font-sans">
                  *Theo lý thuyết Mác, giá trị thặng dư chính là nguồn gốc tích lũy của nhà tư bản, sinh ra từ sức lao động sống của công nhân mà sếp không trả tiền.
                </p>
              </div>
            </div>
          </div>

          {/* Cumulative Exploitation equivalences */}
          <div className="liquid-glass rounded-3xl p-6 border border-white/10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-white text-sm uppercase tracking-wide font-mono">
                  Mô phỏng thặng dư tích lũy của sếp
                </h4>
                <p className="text-[11px] text-white/50 mt-1 leading-relaxed">
                  Nhập số tháng làm việc để thấy chủ tích lũy được bao nhiêu tài sản từ sức lao động của bạn.
                </p>
              </div>
              <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                <input
                  type="number"
                  min="1"
                  max="48"
                  value={workMonths}
                  onChange={e => setWorkMonths(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 bg-transparent text-sm text-center text-white font-mono font-bold border-none focus:outline-none"
                />
                <span className="text-xs text-white/60 font-medium">tháng</span>
              </div>
            </div>

            <div className="space-y-4">
              <input
                type="range"
                min="1"
                max="36"
                value={workMonths}
                onChange={e => setWorkMonths(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <Coffee className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 font-mono uppercase block">Cốc trà sữa</span>
                    <strong className="text-base text-white font-mono">{itemsEquivalent.milktea} cốc</strong>
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <Film className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 font-mono uppercase block">Vé xem phim IMAX</span>
                    <strong className="text-base text-white font-mono">{itemsEquivalent.movie} vé</strong>
                  </div>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 font-mono uppercase block">Tai nghe chống ồn</span>
                    <strong className="text-base text-white font-mono">{itemsEquivalent.headphone} chiếc</strong>
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl text-xs text-white/60 leading-relaxed font-sans">
                Bạn tích lũy được tiền lương để trang trải sinh hoạt, nhưng sếp của bạn đã tích trữ được thêm{" "}
                <strong className="text-white font-mono">{accumulatedSurplus.toLocaleString()} đ</strong> giá trị
                thặng dư thô để mở rộng tư bản, thuê thêm nhân lực hoặc mua sắm tiêu dùng cao cấp.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
