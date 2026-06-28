import { useMemo, useState } from "react";
import { ArrowRight, Bot, Briefcase, Loader2, RotateCcw } from "lucide-react";
import { askThayNamAI } from "../lib/ai";

type RegionId = "vung1" | "vung2" | "vung3" | "vung4";

interface SalaryCalculatorPanelProps {
  onAskTeacher: () => void;
}

interface RegionConfig {
  id: RegionId;
  name: string;
  shortName: string;
  minHourlyWage: number;
}

interface ProvinceOption {
  id: string;
  name: string;
  regionId: RegionId;
}

interface AiClassificationResult {
  jobCategory: string;
  suggestedHourlyRange: [number, number];
  verdict: string;
  summary: string;
  advice: string;
  source: "ai" | "fallback";
}

const REGIONS: Record<RegionId, RegionConfig> = {
  vung1: { id: "vung1", name: "Vùng I", shortName: "Vùng I", minHourlyWage: 23800 },
  vung2: { id: "vung2", name: "Vùng II", shortName: "Vùng II", minHourlyWage: 21200 },
  vung3: { id: "vung3", name: "Vùng III", shortName: "Vùng III", minHourlyWage: 18600 },
  vung4: { id: "vung4", name: "Vùng IV", shortName: "Vùng IV", minHourlyWage: 16600 }
};

const LIVING_COST_DATA_NOTICE =
  "Chưa có dataset gốc mức sống theo tỉnh trong app. Không tự điền số ước đoán.";

const PROVINCES: ProvinceOption[] = [
  { id: "ha-noi", name: "Hà Nội", regionId: "vung1" },
  { id: "tp-hcm", name: "TP. Hồ Chí Minh", regionId: "vung1" },
  { id: "da-nang", name: "Đà Nẵng", regionId: "vung1" },
  { id: "hai-phong", name: "Hải Phòng", regionId: "vung1" },
  { id: "can-tho", name: "Cần Thơ", regionId: "vung2" },
  { id: "binh-duong", name: "Bình Dương", regionId: "vung1" },
  { id: "dong-nai", name: "Đồng Nai", regionId: "vung1" },
  { id: "ba-ria-vung-tau", name: "Bà Rịa - Vũng Tàu", regionId: "vung1" },
  { id: "quang-ninh", name: "Quảng Ninh", regionId: "vung1" },
  { id: "bac-ninh", name: "Bắc Ninh", regionId: "vung2" },
  { id: "hung-yen", name: "Hưng Yên", regionId: "vung2" },
  { id: "hai-duong", name: "Hải Dương", regionId: "vung2" },
  { id: "vinh-phuc", name: "Vĩnh Phúc", regionId: "vung2" },
  { id: "khanh-hoa", name: "Khánh Hòa", regionId: "vung2" },
  { id: "lam-dong", name: "Lâm Đồng", regionId: "vung2" },
  { id: "long-an", name: "Long An", regionId: "vung2" },
  { id: "tien-giang", name: "Tiền Giang", regionId: "vung2" },
  { id: "tay-ninh", name: "Tây Ninh", regionId: "vung2" },
  { id: "thua-thien-hue", name: "Thừa Thiên Huế", regionId: "vung2" },
  { id: "nghe-an", name: "Nghệ An", regionId: "vung3" },
  { id: "thanh-hoa", name: "Thanh Hóa", regionId: "vung3" },
  { id: "binh-dinh", name: "Bình Định", regionId: "vung3" },
  { id: "dak-lak", name: "Đắk Lắk", regionId: "vung3" },
  { id: "an-giang", name: "An Giang", regionId: "vung3" },
  { id: "dong-thap", name: "Đồng Tháp", regionId: "vung3" },
  { id: "soc-trang", name: "Sóc Trăng", regionId: "vung4" },
  { id: "ca-mau", name: "Cà Mau", regionId: "vung4" },
  { id: "dien-bien", name: "Điện Biên", regionId: "vung4" },
  { id: "ha-giang", name: "Hà Giang", regionId: "vung4" },
  { id: "khac", name: "Tỉnh/thành khác", regionId: "vung3" }
];

const formatMoney = (value: number) => `${Math.round(value || 0).toLocaleString()} đ`;

const normalizeVietnamese = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const parseAiJson = (value: string): Partial<AiClassificationResult> | null => {
  const cleaned = value.replace(/```json/gi, "").replace(/```/g, "").trim();
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace < 0 || lastBrace < firstBrace) return null;

  try {
    return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
  } catch {
    return null;
  }
};

const getAiText = async (prompt: string) => {
  return askThayNamAI(
    prompt,
    "Bạn là trợ lý phân tích lương theo giáo trình Kinh tế chính trị Mác - Lênin. Trả về đúng JSON, ngắn gọn."
  );

  /* Legacy endpoint code is intentionally unreachable. The shared helper above
     rotates all configured Gemini keys and applies cooldowns consistently. */
  const model = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";
  const apiKey = String(import.meta.env.VITE_GEMINI_API_KEY || "").trim();
  const configuredApiUrl = String(import.meta.env.VITE_GEMINI_API_URL || "").trim();
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";
  const isLocal = ["localhost", "127.0.0.1", "::1", "0.0.0.0"].includes(hostname);
  const isDirectGeminiKey = apiKey.startsWith("AIza") || apiKey.startsWith("AQ.");
  const apiUrl = configuredApiUrl || (isDirectGeminiKey
    ? `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
    : "/api/chat");

  if (isLocal && apiUrl === "/api/chat") {
    throw new Error("Local chưa có server /api/chat. Thêm VITE_GEMINI_API_KEY để test trực tiếp.");
  }

  if (apiUrl.includes("generativelanguage.googleapis.com")) {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: "Bạn là trợ lý phân tích lương theo giáo trình Kinh tế chính trị Mác - Lênin. Trả lời đúng JSON, ngắn gọn." }]
        },
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) throw new Error(`Gemini lỗi ${response.status}`);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("\n") || "";
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "Bạn là trợ lý phân tích lương theo giáo trình Kinh tế chính trị Mác - Lênin. Trả lời đúng JSON, ngắn gọn." },
        { role: "user", content: prompt }
      ]
    })
  });

  if (!response.ok) throw new Error(`AI endpoint lỗi ${response.status}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content || data.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("").trim() || "";
};

export function SalaryCalculatorPanel({ onAskTeacher }: SalaryCalculatorPanelProps) {
  const [jobTitle, setJobTitle] = useState("");
  const [salaryInput, setSalaryInput] = useState("");
  const [hoursInput, setHoursInput] = useState("");
  const [daysInput, setDaysInput] = useState("26");
  const [provinceId, setProvinceId] = useState("ha-noi");
  const [livingCostInput, setLivingCostInput] = useState("");
  const [familySupportInput, setFamilySupportInput] = useState("");
  const [aiResult, setAiResult] = useState<AiClassificationResult | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const province = PROVINCES.find(item => item.id === provinceId) ?? PROVINCES[0];
  const region = REGIONS[province.regionId];
  const monthlySalary = Number(salaryInput) || 0;
  const hoursPerDay = Number(hoursInput) || 0;
  const workingDays = Number(daysInput) || 0;
  const livingCost = Number(livingCostInput) || 0;
  const familySupport = Number(familySupportInput) || 0;
  const hasLivingCost = livingCost > 0;
  const totalIncome = monthlySalary + familySupport;
  const totalHoursMonth = hoursPerDay * workingDays;
  const hourlyWage = totalHoursMonth > 0 ? monthlySalary / totalHoursMonth : 0;
  const totalIncomeGap = hasLivingCost ? totalIncome - livingCost : 0;
  const minimumMonthlyPay = region.minHourlyWage * totalHoursMonth;
  const isLivingCostBelowMinimumWageReference = minimumMonthlyPay > 0
    && livingCost > 0
    && livingCost < minimumMonthlyPay;
  const inputWarnings = [
    livingCost <= 0 ? "Nhập chi phí sống thực tế của bạn. App chưa có dữ liệu gốc mức sống theo tỉnh để tự điền." : "",
    isLivingCostBelowMinimumWageReference
      ? `${formatMoney(livingCost)} ở ${province.name} thấp hơn mức lương tối thiểu vùng tính theo số giờ bạn nhập (${formatMoney(minimumMonthlyPay)}). App không kết luận đây là mức sống chính thức, chỉ nhắc bạn kiểm tra lại số liệu.`
      : "",
    hoursPerDay > 16 ? "Giờ làm/ngày trên 16h rất bất thường, kiểm tra lại số nhập." : "",
    workingDays > 31 ? "Ngày làm/tháng không thể vượt quá 31 ngày." : "",
    monthlySalary > 0 && totalHoursMonth > 0 && hourlyWage < 5000 ? "Lương/giờ dưới 5.000đ rất bất thường, kiểm tra lại lương hoặc giờ làm." : "",
    livingCost > 0 && livingCost < 1000000 ? "Chi phí sống dưới 1.000.000đ/tháng rất thấp, có thể bạn nhập thiếu số 0 hoặc chỉ nhập một khoản nhỏ." : "",
    livingCost > 0 && livingCost > 50000000 ? "Chi phí sống trên 50.000.000đ/tháng rất cao, kiểm tra lại đơn vị tiền." : "",
    familySupport < 0 ? "Trợ cấp không nên là số âm." : ""
  ].filter(Boolean);
  const hasInvalidInput = workingDays > 31 || hoursPerDay > 24 || familySupport < 0 || livingCost <= 0;
  const isIncomplete = !jobTitle.trim() || monthlySalary <= 0 || hoursPerDay <= 0 || workingDays <= 0 || livingCost <= 0;

  const fallbackClassification = useMemo<AiClassificationResult>(() => {
    const normalizedTitle = normalizeVietnamese(jobTitle);
    let jobCategory = "Lao động phổ thông / Khác";
    let suggestedHourlyRange: [number, number] = [region.minHourlyWage, Math.round(region.minHourlyWage * 1.6)];

    if (/code|lap trinh|developer|it|cntt|phan mem|design|do hoa/.test(normalizedTitle)) {
      jobCategory = "Công nghệ / kỹ thuật cao";
      suggestedHourlyRange = [60000, 180000];
    } else if (/gia su|day hoc|day kem|tro giang|tutor/.test(normalizedTitle)) {
      jobCategory = "Giáo dục / dạy kèm";
      suggestedHourlyRange = [35000, 90000];
    } else if (/ship|grab|be|gojek|giao hang|xe om|rider/.test(normalizedTitle)) {
      jobCategory = "Vận tải / xe ôm công nghệ";
      suggestedHourlyRange = [region.minHourlyWage, 45000];
    } else if (/cafe|ca phe|tra sua|phuc vu|ban hang|thu ngan|phu bep|nha hang|bung pho/.test(normalizedTitle)) {
      jobCategory = "Dịch vụ ăn uống / bán lẻ";
      suggestedHourlyRange = [region.minHourlyWage, 35000];
    } else if (/van phong|nhap lieu|sale|sales|tu van|cham soc khach hang/.test(normalizedTitle)) {
      jobCategory = "Văn phòng / bán hàng / CSKH";
      suggestedHourlyRange = [30000, 70000];
    }

    if (isIncomplete) {
      return {
        jobCategory,
        suggestedHourlyRange,
        verdict: "Chưa đủ dữ liệu",
        summary: "Nhập công việc, lương, giờ làm và chi phí sống thực tế để phân tích.",
        advice: "Chi phí sống phải do người dùng nhập hoặc import từ dataset gốc; app không tự bịa mức sống theo tỉnh.",
        source: "fallback"
      };
    }

    if (hourlyWage < region.minHourlyWage * 0.5 || totalIncome < livingCost * 0.5) {
      return {
        jobCategory,
        suggestedHourlyRange,
        verdict: "Bóc lột gần như toàn phần",
        summary: `Lương giờ ${formatMoney(hourlyWage)} quá thấp so với sàn ${region.shortName} (${formatMoney(region.minHourlyWage)}/giờ). Thu nhập cũng không chạm nổi mức sống tối thiểu.`,
        advice: "Không nên coi đây là việc bền vững. Cần thương lượng lại hoặc đổi việc nếu có thể.",
        source: "fallback"
      };
    }

    if (hourlyWage < region.minHourlyWage || monthlySalary < livingCost) {
      return {
        jobCategory,
        suggestedHourlyRange,
        verdict: "Bị bóc lột nặng",
        summary: `Lương giờ ${formatMoney(hourlyWage)} thấp hoặc lương tháng không đủ chi phí sống. Phần thiếu đang bị đẩy sang bản thân/gia đình.`,
        advice: "Nên xem lại mức lương, chi phí đi lại và số giờ làm thực tế.",
        source: "fallback"
      };
    }

    if (hourlyWage < suggestedHourlyRange[0]) {
      return {
        jobCategory,
        suggestedHourlyRange,
        verdict: "Hơi bị bào",
        summary: `Lương đạt sàn tối thiểu nhưng thấp hơn khoảng thường thấy của nhóm ${jobCategory}.`,
        advice: "Có thể dùng lương giờ và mặt bằng ngành để deal lại.",
        source: "fallback"
      };
    }

    return {
      jobCategory,
      suggestedHourlyRange,
      verdict: hourlyWage > suggestedHourlyRange[1] ? "Lương khá tốt" : "Tạm ổn",
      summary: `Lương giờ ${formatMoney(hourlyWage)} nằm trong hoặc vượt khoảng tham chiếu của nhóm ${jobCategory}.`,
      advice: "Vẫn cần theo dõi phụ cấp, chi phí phát sinh và số giờ làm thật.",
      source: "fallback"
    };
  }, [hourlyWage, isIncomplete, jobTitle, livingCost, monthlySalary, region.minHourlyWage, region.shortName, totalIncome]);

  const result = aiResult ?? fallbackClassification;
  const safeHoursPerDay = Math.max(hoursPerDay, 0.1);
  const survivalShare = monthlySalary > 0 ? livingCost / monthlySalary : 1;
  const rawNecessaryHours = clamp(survivalShare * safeHoursPerDay, 0.1, safeHoursPerDay);
  const effectiveNecessaryHours = rawNecessaryHours;
  const surplusHours = Math.max(0, safeHoursPerDay - effectiveNecessaryHours);
  const surplusRatio = effectiveNecessaryHours > 0 ? (surplusHours / effectiveNecessaryHours) * 100 : 0;
  const monthlySurplusValue = effectiveNecessaryHours > 0 ? monthlySalary * (surplusHours / effectiveNecessaryHours) : 0;
  const isWageBelowLivingCost = monthlySalary > 0 && monthlySalary < livingCost;
  const minimumPayGap = monthlySalary - minimumMonthlyPay;
  const marketLowGap = hourlyWage - result.suggestedHourlyRange[0];
  const survivalPercent = livingCost > 0 ? (totalIncome / livingCost) * 100 : 0;
  const paidValuePerHour = safeHoursPerDay > 0 ? monthlySalary / (safeHoursPerDay * workingDays || 1) : 0;
  const surplusRealityNote = monthlySalary < livingCost
    ? "Lương riêng của công việc chưa đủ chi phí sống, nên không thể đo thặng dư bằng cách chia lương cho thời gian sống tối thiểu. Điều này không có nghĩa chủ không thu thặng dư, mà nghĩa là mức lương đang quá thấp để tái tạo sức lao động."
    : surplusHours > 0
      ? `Sau khoảng ${effectiveNecessaryHours.toFixed(1)} giờ/ngày để bù chi phí sống, phần còn lại khoảng ${surplusHours.toFixed(1)} giờ/ngày là thời gian tạo giá trị ngoài phần lương.`
      : "Toàn bộ ngày làm gần như chỉ để bù chi phí sống, gần như không còn dư địa tích lũy cho người lao động.";
  const practicalWarnings = [
    isLivingCostBelowMinimumWageReference
      ? `Chi phí sống ${formatMoney(livingCost)} tại ${province.name} đang thấp hơn mốc lương tối thiểu vùng cho tổng giờ bạn nhập (${formatMoney(minimumMonthlyPay)}). Vì app chưa có dataset mức sống gốc, hãy kiểm tra lại chi phí nhà, ăn uống và đi lại trước khi tin kết quả.`
      : "",
    minimumPayGap < 0
      ? `So với sàn ${region.shortName}, lương tháng đang thiếu khoảng ${formatMoney(Math.abs(minimumPayGap))} nếu tính theo tổng giờ bạn nhập.`
      : `So với sàn ${region.shortName}, lương tháng đang cao hơn sàn khoảng ${formatMoney(minimumPayGap)}.`,
    !hasLivingCost
      ? "Chưa có chi phí sống nên chưa thể tính thiếu/dư so với mức sống."
      : totalIncomeGap < 0
      ? `Sau khi cộng trợ cấp, bạn vẫn thiếu ${formatMoney(Math.abs(totalIncomeGap))}/tháng so với chi phí sống đã nhập.`
      : `Sau chi phí sống, bạn còn dư khoảng ${formatMoney(totalIncomeGap)}/tháng để đi lại, học thêm, tiết kiệm hoặc xử lý phát sinh.`,
    marketLowGap < 0
      ? `So với khoảng hợp lý của nhóm nghề, lương giờ thấp hơn đáy khoảng ${formatMoney(Math.abs(marketLowGap))}/giờ.`
      : `Lương giờ đang đạt hoặc vượt đáy tham chiếu của nhóm nghề khoảng ${formatMoney(marketLowGap)}/giờ.`
  ].filter(Boolean);

  const setDirty = () => {
    setAiResult(null);
    setAiError("");
  };

  const resetForm = () => {
    setJobTitle("");
    setSalaryInput("");
    setHoursInput("");
    setDaysInput("26");
    setProvinceId("ha-noi");
    setLivingCostInput("");
    setFamilySupportInput("");
    setAiResult(null);
    setAiError("");
  };

  const handleProvinceChange = (nextProvinceId: string) => {
    const nextProvince = PROVINCES.find(item => item.id === nextProvinceId) ?? PROVINCES[0];
    setProvinceId(nextProvince.id);
    setLivingCostInput("");
    setDirty();
  };

  const runAiClassification = async () => {
    if (isIncomplete) {
      setAiError("Nhập đủ công việc, lương, giờ làm/ngày, ngày làm/tháng và chi phí sống thực tế trước.");
      return;
    }

    if (hasInvalidInput) {
      setAiError("Có số liệu nhập chưa hợp lý. Sửa các cảnh báo màu vàng trước khi phân tích.");
      return;
    }

    setIsAiLoading(true);
    setAiError("");

    const prompt = [
      "Phân loại công việc và đánh giá mức lương theo Kinh tế chính trị Mác - Lênin.",
      "Trả về JSON thuần, không markdown.",
      `Công việc: ${jobTitle}`,
      `Lương tháng: ${monthlySalary} VND`,
      `Giờ làm/ngày: ${hoursPerDay}`,
      `Ngày làm/tháng: ${workingDays}`,
      `Lương giờ: ${Math.round(hourlyWage)} VND/giờ`,
      `Tỉnh/thành: ${province.name}`,
      `Vùng lương app suy ra: ${region.name}`,
      `Sàn tham chiếu: ${region.minHourlyWage} VND/giờ`,
      `Chi phí sống: ${livingCost} VND/tháng`,
      `Trợ cấp gia đình: ${familySupport} VND/tháng`,
      "Schema: {\"jobCategory\":\"...\",\"suggestedHourlyRange\":[min,max],\"verdict\":\"...\",\"summary\":\"...\",\"advice\":\"...\"}"
    ].join("\n");

    try {
      const text = await getAiText(prompt);
      const parsed = parseAiJson(text);
      if (!parsed?.jobCategory || !Array.isArray(parsed.suggestedHourlyRange)) {
        throw new Error("AI trả dữ liệu sai định dạng");
      }

      setAiResult({
        jobCategory: String(parsed.jobCategory),
        suggestedHourlyRange: [
          Number(parsed.suggestedHourlyRange[0]) || fallbackClassification.suggestedHourlyRange[0],
          Number(parsed.suggestedHourlyRange[1]) || fallbackClassification.suggestedHourlyRange[1]
        ],
        verdict: String(parsed.verdict || fallbackClassification.verdict),
        summary: String(parsed.summary || fallbackClassification.summary),
        advice: String(parsed.advice || fallbackClassification.advice),
        source: "ai"
      });
    } catch (error) {
      setAiResult(fallbackClassification);
      setAiError(`Đang dùng luật dự phòng: ${error instanceof Error ? error.message : "AI lỗi"}.`);
    } finally {
      setIsAiLoading(false);
    }
  };

  const verdictTone = /toàn phần|nặng|bào/i.test(result.verdict)
    ? "border-red-300/25 bg-red-400/10"
    : /ổn|tốt/i.test(result.verdict)
      ? "border-emerald-300/25 bg-emerald-300/10"
      : "border-white/10 bg-white/[0.04]";

  return (
    <div className="space-y-5">
      <header className="rounded-[24px] border border-white/10 bg-neutral-950/82 p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-5xl text-white tracking-tight" style={{ fontFamily: "'Instrument Serif', serif" }}>
              Phân tích lương & thặng dư
            </h2>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 xl:grid-cols-[390px_1fr] gap-5">
        <aside className="rounded-[24px] border border-white/10 bg-neutral-950/82 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Dữ liệu</h3>
            <Briefcase className="w-5 h-5 text-white/45" />
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-bold text-white/60">Tên công việc</span>
            <input
              value={jobTitle}
              onChange={e => {
                setJobTitle(e.target.value);
                setDirty();
              }}
              placeholder="VD: chạy Grab, bưng phở, viết code..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/35 outline-none focus:border-white/40"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-2">
              <span className="text-sm font-bold text-white/60">Lương tháng</span>
              <input
                type="number"
                value={salaryInput}
                onChange={e => {
                  setSalaryInput(e.target.value);
                  setDirty();
                }}
                placeholder="3000000"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-white/40"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-bold text-white/60">Chi phí sống</span>
              <input
                type="number"
                value={livingCostInput}
                onChange={e => {
                  setLivingCostInput(e.target.value);
                  setDirty();
                }}
                placeholder="VD: 5000000"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-white/40"
              />
              <span className="block text-[11px] leading-4 text-white/38">{LIVING_COST_DATA_NOTICE}</span>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-bold text-white/60">Giờ/ngày</span>
              <input
                type="number"
                value={hoursInput}
                onChange={e => {
                  setHoursInput(e.target.value);
                  setDirty();
                }}
                placeholder="6"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-white/40"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-bold text-white/60">Ngày/tháng</span>
              <input
                type="number"
                value={daysInput}
                onChange={e => {
                  setDaysInput(e.target.value);
                  setDirty();
                }}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-white/40"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-2">
              <span className="text-sm font-bold text-white/60">Tỉnh/Thành phố</span>
              <select
                value={provinceId}
                onChange={e => handleProvinceChange(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none focus:border-white/40"
              >
                {PROVINCES.map(item => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
              <span className="block text-[11px] text-white/38">{region.shortName}: {formatMoney(region.minHourlyWage)}/giờ</span>
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-bold text-white/60">Trợ cấp</span>
              <input
                type="number"
                value={familySupportInput}
                onChange={e => {
                  setFamilySupportInput(e.target.value);
                  setDirty();
                }}
                placeholder="0"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-white/40"
              />
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={runAiClassification}
              disabled={isAiLoading}
              className="flex-1 rounded-xl bg-white px-4 py-3 text-sm font-bold text-black hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 transition-all flex items-center justify-center gap-2"
            >
              {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
              Phân tích
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white/70 hover:bg-white/[0.08] transition-all"
              aria-label="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5 text-sm leading-relaxed text-white/60">
            <strong className="text-white">Nguồn đang dùng:</strong> tỉnh/thành chỉ dùng để suy ra vùng lương tối thiểu. Mức sống theo tỉnh cần import dataset gốc, hiện app không tự ước đoán.
          </div>
        </aside>

        <main className="space-y-5">
          <section className={`rounded-[24px] border p-5 md:p-6 ${verdictTone}`}>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-5">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-white/55">Kết luận</span>
                <h3 className="mt-2 text-3xl md:text-4xl font-black text-white">{result.verdict}</h3>
                <p className="mt-3 text-sm md:text-base leading-7 text-white/72">{result.summary}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-[10px] uppercase tracking-wider text-white/45">Lương giờ</div>
                <div className="mt-1 text-3xl font-black text-white">{formatMoney(hourlyWage)}</div>
                <div className="mt-1 text-sm text-white/60">Sàn: {formatMoney(region.minHourlyWage)}/giờ</div>
              </div>
            </div>
          </section>

          {aiError ? (
            <div className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 text-sm text-amber-100">{aiError}</div>
          ) : null}

          {inputWarnings.length ? (
            <section className="rounded-[20px] border border-amber-300/20 bg-amber-300/10 p-4 space-y-2">
              <h3 className="text-sm font-bold text-amber-100">Kiểm tra lại số liệu</h3>
              {inputWarnings.map(item => (
                <p key={item} className="text-sm leading-6 text-amber-50/85">{item}</p>
              ))}
            </section>
          ) : null}

          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-xl border border-white/10 bg-neutral-950/82 p-4">
              <div className="text-[10px] uppercase tracking-wider text-white/40">Nhóm nghề</div>
              <div className="mt-1 text-sm font-bold text-white">{result.jobCategory}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-neutral-950/82 p-4">
              <div className="text-[10px] uppercase tracking-wider text-white/40">Khoảng hợp lý</div>
              <div className="mt-1 text-sm font-bold text-white">
                {formatMoney(result.suggestedHourlyRange[0])} - {formatMoney(result.suggestedHourlyRange[1])}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-neutral-950/82 p-4">
              <div className="text-[10px] uppercase tracking-wider text-white/40">Thu nhập - chi phí</div>
              <div className={`mt-1 text-sm font-bold ${totalIncomeGap < 0 ? "text-red-200" : "text-emerald-200"}`}>
                {!hasLivingCost ? "Chưa nhập" : totalIncomeGap < 0 ? `Thiếu ${formatMoney(Math.abs(totalIncomeGap))}` : `Dư ${formatMoney(totalIncomeGap)}`}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-neutral-950/82 p-4">
              <div className="text-[10px] uppercase tracking-wider text-white/40">Tổng giờ/tháng</div>
              <div className="mt-1 text-sm font-bold text-white">{Math.round(totalHoursMonth)} giờ</div>
            </div>
          </section>

          <section className="rounded-[24px] border border-white/10 bg-neutral-950/82 p-5 md:p-6 space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-white">Lương này có đủ sống không?</h3>
                <p className="mt-1 text-sm leading-6 text-white/55">
                  App so lương công việc với chi phí sống trước, rồi mới nói đến thặng dư.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <div className="text-[10px] uppercase tracking-wider text-white/40">Mức phủ chi phí sống</div>
                <div className={`text-2xl font-black ${survivalPercent < 100 ? "text-red-200" : "text-emerald-200"}`}>
                  {hasLivingCost ? `${Math.round(survivalPercent)}%` : "Chưa nhập"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="text-[10px] uppercase tracking-wider text-white/40">1. Chủ trả cho bạn</div>
                <div className="mt-2 text-2xl font-black text-white">{formatMoney(monthlySalary)}</div>
                <p className="mt-2 text-sm leading-6 text-white/58">
                  {Math.round(totalHoursMonth)} giờ/tháng, tương đương {formatMoney(paidValuePerHour)}/giờ.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="text-[10px] uppercase tracking-wider text-white/40">2. Bạn cần để sống</div>
                <div className="mt-2 text-2xl font-black text-white">{hasLivingCost ? formatMoney(livingCost) : "Chưa nhập"}</div>
                <p className="mt-2 text-sm leading-6 text-white/58">
                  {hasLivingCost
                    ? `Chi phí sống bạn nhập tại ${province.name}. Trợ cấp gia đình: ${formatMoney(familySupport)}.`
                    : `Chưa có dữ liệu gốc mức sống của ${province.name}; hãy nhập chi phí sống thực tế hoặc import dataset.`}
                </p>
              </div>

              <div className={`rounded-2xl border p-4 ${
                !hasLivingCost
                  ? "border-amber-300/25 bg-amber-300/10"
                  : isWageBelowLivingCost
                    ? "border-red-300/25 bg-red-400/10"
                    : "border-emerald-300/25 bg-emerald-300/10"
              }`}>
                <div className="text-[10px] uppercase tracking-wider text-white/50">3. Kết luận dễ hiểu</div>
                <div className="mt-2 text-2xl font-black text-white">
                  {!hasLivingCost ? "Thiếu mốc mức sống" : isWageBelowLivingCost ? "Lương không đủ sống" : "Có phần vượt chi phí sống"}
                </div>
                <p className="mt-2 text-sm leading-6 text-white/68">
                  {!hasLivingCost
                    ? "Chưa thể kết luận vì thiếu chi phí sống làm mốc so sánh."
                    : isWageBelowLivingCost
                    ? `Riêng lương công việc đang thiếu ${formatMoney(livingCost - monthlySalary)} so với chi phí sống.`
                    : `Sau khi bù chi phí sống, lương còn dư ${formatMoney(monthlySalary - livingCost)}.`}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 space-y-3">
              <h4 className="text-lg font-bold text-white">Vậy “thặng dư” hiểu thế nào?</h4>
              <p className="text-sm leading-7 text-white/68">{surplusRealityNote}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="text-[10px] uppercase tracking-wider text-white/40">So với sàn tối thiểu</div>
                  <div className={`mt-1 text-lg font-bold ${minimumPayGap < 0 ? "text-red-200" : "text-emerald-200"}`}>
                    {minimumPayGap < 0 ? `Thiếu ${formatMoney(Math.abs(minimumPayGap))}` : `Cao hơn ${formatMoney(minimumPayGap)}`}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">Sàn {region.shortName}: {formatMoney(minimumMonthlyPay)} cho tổng giờ đã nhập.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="text-[10px] uppercase tracking-wider text-white/40">So với mặt bằng nghề</div>
                  <div className={`mt-1 text-lg font-bold ${marketLowGap < 0 ? "text-red-200" : "text-emerald-200"}`}>
                    {marketLowGap < 0 ? `Thấp hơn ${formatMoney(Math.abs(marketLowGap))}/giờ` : `Đạt đáy +${formatMoney(marketLowGap)}/giờ`}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{result.jobCategory}: {formatMoney(result.suggestedHourlyRange[0])} - {formatMoney(result.suggestedHourlyRange[1])}/giờ.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="text-[10px] uppercase tracking-wider text-white/40">Ước tính thặng dư</div>
                  <div className="mt-1 text-lg font-bold text-white">
                    {isWageBelowLivingCost ? "Không đo bằng lương" : formatMoney(monthlySurplusValue)}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {isWageBelowLivingCost
                      ? "Vì lương chưa đủ sống, cần xem đây là dấu hiệu bị ép giá sức lao động."
                      : `${surplusHours.toFixed(1)} giờ/ngày vượt phần bù chi phí sống.`}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {practicalWarnings.map(item => (
                <p key={item} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm leading-6 text-white/62">
                  {item}
                </p>
              ))}
            </div>
          </section>

          <details className="rounded-[20px] border border-white/10 bg-neutral-950/82 p-4">
            <summary className="cursor-pointer text-sm font-bold text-white">Lý luận cần nhớ</summary>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="rounded-xl bg-white/[0.04] p-3 text-sm text-white/70"><strong className="text-white">v:</strong> tiền lương / giá trị sức lao động.</div>
              <div className="rounded-xl bg-white/[0.04] p-3 text-sm text-white/70"><strong className="text-white">t:</strong> lao động tất yếu {effectiveNecessaryHours.toFixed(1)}h.</div>
              <div className="rounded-xl bg-white/[0.04] p-3 text-sm text-white/70"><strong className="text-white">t':</strong> lao động thặng dư {surplusHours.toFixed(1)}h.</div>
              <div className="rounded-xl bg-white/[0.04] p-3 text-sm text-white/70"><strong className="text-white">m':</strong> tỷ suất thặng dư {Math.round(surplusRatio)}%.</div>
            </div>
            <p className="mt-4 text-base leading-relaxed text-white/70">{result.advice}</p>
            <button
              type="button"
              onClick={onAskTeacher}
              className="mt-4 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-black hover:bg-neutral-200 transition-all flex items-center gap-2"
            >
              Hỏi Thầy Nam AI <ArrowRight className="w-4 h-4" />
            </button>
          </details>
        </main>
      </section>
    </div>
  );
}
