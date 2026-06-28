import { useState, useEffect, useMemo } from "react";
import { AlertTriangle, Bot, Loader2, RotateCcw } from "lucide-react";
import { validateSalaryInput } from "../../lib/salaryValidation";
import type { SalaryInput } from "../../lib/chapterToolTypes";
import { InlineThayNamAI } from "../InlineThayNamAI";

const formatMoney = (value: number) => `${Math.round(value || 0).toLocaleString("vi-VN")} đ`;

interface ProvinceOption {
  id: string;
  name: string;
  regionId: "vung1" | "vung2" | "vung3" | "vung4";
}

interface RegionConfig {
  id: string;
  name: string;
  minHourlyWage: number;
  source: string;
  date: string;
}

export function Chapter3SalarySurplusTool() {
  // Input states
  const [jobTitle, setJobTitle] = useState("");
  const [monthlySalaryInput, setMonthlySalaryInput] = useState("");
  const [hoursPerDayInput, setHoursPerDayInput] = useState("");
  const [workingDaysInput, setWorkingDaysInput] = useState("26");
  const [provinceId, setProvinceId] = useState("ha-noi");
  const [livingCostInput, setLivingCostInput] = useState("");
  const [familySupportInput, setFamilySupportInput] = useState("0");

  // Simulation state
  const [isTechApplied, setIsTechApplied] = useState(false);

  // Reference data loaded from public/
  const [provinces, setProvinces] = useState<ProvinceOption[]>([
    { id: "ha-noi", name: "Hà Nội", regionId: "vung1" },
    { id: "tp-hcm", name: "TP. Hồ Chí Minh", regionId: "vung1" },
    { id: "da-nang", name: "Đà Nẵng", regionId: "vung1" },
    { id: "hai-phong", name: "Hải Phòng", regionId: "vung1" },
    { id: "can-tho", name: "Cần Thơ", regionId: "vung2" },
    { id: "binh-duong", name: "Bình Dương", regionId: "vung1" },
    { id: "dong-nai", name: "Đồng Nai", regionId: "vung1" },
    { id: "bac-ninh", name: "Bắc Ninh", regionId: "vung2" },
    { id: "soc-trang", name: "Sóc Trăng", regionId: "vung4" },
    { id: "dien-bien", name: "Điện Biên", regionId: "vung4" }
  ]);

  const [regions, setRegions] = useState<Record<string, RegionConfig>>({
    vung1: { id: "vung1", name: "Vùng I", minHourlyWage: 23800, source: "Nghị định 74/2024/NĐ-CP", date: "01/07/2024" },
    vung2: { id: "vung2", name: "Vùng II", minHourlyWage: 21200, source: "Nghị định 74/2024/NĐ-CP", date: "01/07/2024" },
    vung3: { id: "vung3", name: "Vùng III", minHourlyWage: 18600, source: "Nghị định 74/2024/NĐ-CP", date: "01/07/2024" },
    vung4: { id: "vung4", name: "Vùng IV", minHourlyWage: 16600, source: "Nghị định 74/2024/NĐ-CP", date: "01/07/2024" }
  });

  // AI response state
  const [aiJobComment, setAiJobComment] = useState<{
    jobCategory: string;
    suggestedHourlyRange: [number, number];
    verdict: string;
    plainExplanation: string;
  } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // Load wage regions config
  useEffect(() => {
    fetch("/wage_regions.json")
      .then(res => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then(data => {
        if (data.provinces && data.regions) {
          setProvinces(data.provinces);
          setRegions(data.regions);
        }
      })
      .catch(err => console.warn("Using local wage regions fallback", err));
  }, []);

  const province = provinces.find(p => p.id === provinceId) || provinces[0];
  const region = regions[province.regionId] || regions.vung1;

  // Convert inputs to numbers
  const monthlySalary = Number(monthlySalaryInput) || 0;
  const hoursPerDay = Number(hoursPerDayInput) || 0;
  const workingDaysPerMonth = Number(workingDaysInput) || 0;
  const livingCost = livingCostInput ? Number(livingCostInput) : null;
  const familySupport = Number(familySupportInput) || 0;

  const salaryInputObj: SalaryInput = {
    jobTitle,
    provinceId,
    monthlySalary,
    hoursPerDay,
    workingDaysPerMonth,
    livingCostPerMonth: livingCost,
    familySupportPerMonth: familySupport
  };

  const warnings = useMemo(() => {
    return validateSalaryInput(salaryInputObj, {
      provinceName: province.name,
      minimumMonthlyPayForEnteredHours: region.minHourlyWage * hoursPerDay * workingDaysPerMonth
    });
  }, [hoursPerDay, province.name, region.minHourlyWage, salaryInputObj, workingDaysPerMonth]);

  const hasBlockingWarning = warnings.some(w => w.severity === "blocking");
  const isFormComplete = jobTitle.trim() && monthlySalary > 0 && hoursPerDay > 0 && workingDaysPerMonth > 0 && livingCost !== null && livingCost > 0;

  // Calculations
  const totalHoursMonth = hoursPerDay * workingDaysPerMonth;
  const hourlyWage = totalHoursMonth > 0 ? monthlySalary / totalHoursMonth : 0;
  const totalIncome = monthlySalary + familySupport;
  const livingCostGap = livingCost !== null && livingCost > 0 ? totalIncome - livingCost : null;
  const survivalPercent = livingCost !== null && livingCost > 0 ? (totalIncome / livingCost) * 100 : null;

  // Marxist Surplus calculations
  // Value of labor power (monthly) = livingCost (survival needs).
  // If tech is applied, productivity increases, reducing necessary labor time by 40% (relative surplus value).
  const rawSurvivalRatio = monthlySalary > 0 && livingCost !== null ? livingCost / monthlySalary : 1;
  const baseNecessaryHours = Math.max(0.1, Math.min(hoursPerDay, rawSurvivalRatio * hoursPerDay));
  const necessaryHours = isTechApplied ? baseNecessaryHours * 0.6 : baseNecessaryHours;
  const surplusHours = Math.max(0, hoursPerDay - necessaryHours);
  const surplusRatio = necessaryHours > 0 ? (surplusHours / necessaryHours) * 100 : 0;
  const monthlySurplusValue = necessaryHours > 0 ? monthlySalary * (surplusHours / necessaryHours) : 0;

  // Deterministic fallback classification
  const fallbackResult = useMemo(() => {
    const titleLower = jobTitle.toLowerCase();
    let jobCategory = "Lao động phổ thông / Phục vụ";
    let suggestedHourlyRange: [number, number] = [region.minHourlyWage, Math.round(region.minHourlyWage * 1.5)];

    if (titleLower.includes("code") || titleLower.includes("developer") || titleLower.includes("lập trình") || titleLower.includes("it")) {
      jobCategory = "Lao động chất lượng cao (Công nghệ thông tin)";
      suggestedHourlyRange = [60000, 180000];
    } else if (titleLower.includes("gia sư") || titleLower.includes("dạy kèm") || titleLower.includes("tutor")) {
      jobCategory = "Lao động dịch vụ trí óc (Giáo dục)";
      suggestedHourlyRange = [35000, 80000];
    } else if (titleLower.includes("ship") || titleLower.includes("grab") || titleLower.includes("giao hàng") || titleLower.includes("be")) {
      jobCategory = "Lao động tự do công nghệ (Gig economy)";
      suggestedHourlyRange = [region.minHourlyWage, 40000];
    }

    let verdict = "Chưa xác định";
    if (livingCost !== null && livingCost > 0) {
      if (monthlySalary < livingCost * 0.8) {
        verdict = "Lương không đủ sống (Bị bóc lột nghiêm trọng)";
      } else if (monthlySalary < livingCost) {
        verdict = "Lương tối thiểu vừa khít mức sinh tồn (Bị bóc lột tương đối)";
      } else {
        verdict = "Tạm đủ trang trải cuộc sống";
      }
    }

    return {
      jobCategory,
      suggestedHourlyRange,
      verdict,
      plainExplanation: `Đồng chí đang làm việc với mức lương giờ khoảng ${Math.round(hourlyWage).toLocaleString()} đ. Phép tính dựa trên dữ liệu bạn cung cấp.`
    };
  }, [jobTitle, region.minHourlyWage, livingCost, monthlySalary, hourlyWage]);

  const activeResult = aiJobComment || fallbackResult;

  // Call AI for job classification
  const handleAiClassify = async () => {
    if (!isFormComplete || hasBlockingWarning) return;
    setIsAiLoading(true);
    setAiError("");
    
    const prompt = `Phân tích công việc:
- Tên nghề nghiệp: "${jobTitle}"
- Lương tháng: ${monthlySalary} đ
- Giờ làm/ngày: ${hoursPerDay} giờ
- Ngày làm/tháng: ${workingDaysPerMonth} ngày
- Chi phí sống: ${livingCost} đ
- Tỉnh thành: ${province.name} (Lương tối thiểu vùng sàn: ${region.minHourlyWage} đ/giờ)

Hãy trả về chính xác một đối tượng JSON (không chứa bất kỳ chữ nào khác ngoài JSON):
{
  "jobCategory": "tên nhóm ngành nghề ví dụ Lao động dịch vụ/Công nghệ cao...",
  "suggestedHourlyRange": [mức lương giờ thấp nhất phổ biến, mức cao nhất],
  "verdict": "kết luận ngắn 1 câu về độ đủ sống hoặc bóc lột thặng dư...",
  "plainExplanation": "giải thích dễ hiểu bằng tiếng Việt về giá trị thặng dư và lương tối thiểu của nghề này dưới góc nhìn Mác - Lênin"
}`;

    const systemInstruction = "Bạn là chuyên gia kinh tế chính trị Mác - Lênin. Phân loại nghề nghiệp của sinh viên đi làm thêm và đưa ra lời bình luận học thuật mang tính giáo dục tích cực. Trả về định dạng JSON chuẩn. Tuyệt đối KHÔNG sử dụng bất kỳ định dạng markdown nào (như ** hoặc #) bên trong các trường văn bản của JSON.";

    try {
      // Import helper dynamically to prevent circular dependencies
      const { askThayNamAI, parseAiJson } = await import("../../lib/ai");
      const raw = await askThayNamAI(prompt, systemInstruction);
      const parsed = parseAiJson<any>(raw);
      if (parsed && parsed.jobCategory) {
        setAiJobComment({
          jobCategory: parsed.jobCategory,
          suggestedHourlyRange: parsed.suggestedHourlyRange || [region.minHourlyWage, region.minHourlyWage * 1.5],
          verdict: parsed.verdict,
          plainExplanation: parsed.plainExplanation
        });
      } else {
        throw new Error("Không parse được JSON phản hồi");
      }
    } catch (err) {
      console.warn("AI Classification failed, falling back to local formulas", err);
      setAiError("Không thể tải đánh giá từ AI. Hệ thống chuyển sang sử dụng bộ quy tắc cục bộ (local).");
      setAiJobComment(null);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleReset = () => {
    setJobTitle("");
    setMonthlySalaryInput("");
    setHoursPerDayInput("");
    setWorkingDaysInput("26");
    setLivingCostInput("");
    setFamilySupportInput("0");
    setAiJobComment(null);
    setAiError("");
    setIsTechApplied(false);
  };

  return (
    <div className="w-full space-y-8 animate-fade-rise">
      {/* Title */}
      <div className="liquid-glass border border-white/10 rounded-3xl p-6 md:p-8 space-y-4">
        <span className="px-2.5 py-1 text-xs font-bold bg-white/10 text-white border border-white/15 rounded-md uppercase font-mono">
          Công cụ Chương 3
        </span>
        <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
          Phân Tích Tiền Lương & Giá Trị Thặng Dư
        </h3>
        <p className="text-sm md:text-base text-white/60 leading-relaxed font-light">
          Nhập công việc làm thêm thực tế của bạn để khám phá xem tiền lương nhận được có đủ tái tạo sức lao động và tìm hiểu cách giới chủ thu giá trị thặng dư (m) từ ngày làm việc của bạn.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Input Pane */}
        <div className="liquid-glass border border-white/10 rounded-3xl p-6 space-y-5 h-fit">
          <div className="border-b border-white/5 pb-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Nhập thông tin công việc</h4>
          </div>

          {/* Job Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider font-mono">Tên công việc làm thêm:</label>
            <input
              type="text"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              placeholder="Ví dụ: Phục vụ cafe, Gia sư toán, Shipper..."
              className="w-full bg-neutral-900/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30"
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider font-mono">Tỉnh / Thành phố làm việc:</label>
            <select
              value={provinceId}
              onChange={e => setProvinceId(e.target.value)}
              className="w-full bg-neutral-900/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-white/30"
            >
              {provinces.map(p => (
                <option key={p.id} value={p.id} className="bg-background text-white">{p.name}</option>
              ))}
            </select>
            <span className="text-xs text-white/40 block font-mono">
              Vùng tối thiểu: {region.name} - Sàn: {region.minHourlyWage.toLocaleString()} đ/h ({region.source})
            </span>
          </div>

          {/* Monthly Salary */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider font-mono">Lương tháng nhận được (đ):</label>
            <input
              type="number"
              value={monthlySalaryInput}
              onChange={e => setMonthlySalaryInput(e.target.value)}
              placeholder="Ví dụ: 3000000"
              className="w-full bg-neutral-900/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
            />
          </div>

          {/* Hours and Days */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/50 uppercase tracking-wider font-mono">Số giờ/ngày:</label>
              <input
                type="number"
                value={hoursPerDayInput}
                onChange={e => setHoursPerDayInput(e.target.value)}
                placeholder="8"
                className="w-full bg-neutral-900/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/50 uppercase tracking-wider font-mono">Số ngày/tháng:</label>
              <input
                type="number"
                value={workingDaysInput}
                onChange={e => setWorkingDaysInput(e.target.value)}
                placeholder="26"
                className="w-full bg-neutral-900/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Living Cost (Crucial check) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider font-mono">Chi phí sống thực tế của bạn (đ):</label>
            <input
              type="number"
              value={livingCostInput}
              onChange={e => setLivingCostInput(e.target.value)}
              placeholder="Bắt buộc nhập tự sống..."
              className="w-full bg-neutral-900/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none border-dashed"
            />
            <span className="text-xs text-amber-400/80 block font-mono">
              *Hệ thống không tự đoán chi phí sống để tránh làm sai lệch số liệu thực tế.
            </span>
          </div>

          {/* Family Support */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white/50 uppercase tracking-wider font-mono">Trợ cấp gia đình/Hỗ trợ khác (đ):</label>
            <input
              type="number"
              value={familySupportInput}
              onChange={e => setFamilySupportInput(e.target.value)}
              placeholder="0"
              className="w-full bg-neutral-900/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all text-sm font-bold flex items-center justify-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Xóa sạch
            </button>
            <button
              type="button"
              disabled={!isFormComplete || hasBlockingWarning || isAiLoading}
              onClick={handleAiClassify}
              className="flex-1 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-sm transition-all flex items-center justify-center gap-1 border-none disabled:opacity-40 disabled:bg-white/40 cursor-pointer"
            >
              {isAiLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
              ) : (
                <>
                  <Bot className="w-3.5 h-3.5 text-black" /> Gọi AI Đánh Giá
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output Pane */}
        <div className="lg:col-span-2 space-y-6">
          {/* Validation Warnings Box */}
          {warnings.length > 0 && (
            <div className="liquid-glass border border-white/10 rounded-3xl p-6 space-y-3">
              <span className="text-xs font-bold text-white/40 uppercase tracking-wider block font-mono">
                Cảnh báo chất lượng dữ liệu
              </span>
              <div className="space-y-2">
                {warnings.map((w, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl text-sm flex items-start gap-2.5 border ${
                      w.severity === "blocking"
                        ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                        : "bg-amber-500/5 border-amber-500/10 text-amber-300"
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{w.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI error fallback info */}
          {aiError && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 p-4 rounded-xl text-sm leading-relaxed">
              {aiError}
            </div>
          )}

          {/* Main Results Grid */}
          {!hasBlockingWarning && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Chủ trả */}
              <div className="liquid-glass border border-white/10 rounded-2xl p-5 space-y-2 text-left">
                <span className="text-xs font-bold text-white/40 uppercase tracking-wider block font-mono">
                  1. Chủ trả cho bạn (v)
                </span>
                <div className="text-lg font-bold text-white font-mono">{formatMoney(monthlySalary)}</div>
                <div className="text-sm text-white/50 font-mono">
                  Lương giờ: {formatMoney(hourlyWage)}/h
                </div>
              </div>

              {/* Card 2: Bạn cần để sống */}
              <div className="liquid-glass border border-white/10 rounded-2xl p-5 space-y-2 text-left">
                <span className="text-xs font-bold text-white/40 uppercase tracking-wider block font-mono">
                  2. Bạn cần để sống
                </span>
                <div className="text-lg font-bold text-white font-mono">
                  {livingCost !== null && livingCost > 0 ? formatMoney(livingCost) : "Chưa nhập"}
                </div>
                <div className="text-sm text-white/50">
                  {livingCost !== null && livingCost > 0 ? `Chiếm ${Math.round(survivalPercent || 0)}% thu nhập` : "Thiếu chi phí để so sánh"}
                </div>
              </div>

              {/* Card 3: Kết luận */}
              <div className="liquid-glass border border-white/10 rounded-2xl p-5 space-y-2 text-left md:col-span-1">
                <span className="text-xs font-bold text-white/40 uppercase tracking-wider block font-mono">
                  3. Kết luận mức sinh tồn
                </span>
                <div className={`text-sm font-bold uppercase tracking-tight py-1.5 rounded text-center border ${
                  livingCost === null || livingCost <= 0
                    ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                    : totalIncome >= livingCost
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                }`}>
                  {livingCost === null || livingCost <= 0
                    ? "Thiếu dữ liệu chi phí"
                    : totalIncome >= livingCost
                    ? "Đủ trang trải"
                    : "Thiếu thốn sinh hoạt"}
                </div>
                <div className="text-sm text-white/50 font-normal">
                  {livingCost === null || livingCost <= 0
                    ? "Nhập chi phí sống để đánh giá đủ sống."
                    : livingCostGap !== null && livingCostGap >= 0
                    ? `Dư dôi: +${formatMoney(livingCostGap)}`
                    : `Hụt: ${formatMoney(Math.abs(livingCostGap || 0))}`}
                </div>
              </div>
            </div>
          )}

          {/* Deep Marxist Analysis */}
          {!hasBlockingWarning && isFormComplete && (
            <div className="liquid-glass border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="border-b border-white/5 pb-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Phân tích chuyên sâu (Học thuyết thặng dư)</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Regional minimum wage comparison */}
                <div className="space-y-1">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-wider font-mono block">So với sàn lương tối thiểu vùng:</span>
                  <div className="text-sm text-white/85 leading-relaxed font-normal">
                    Mức lương giờ của bạn là <strong className="text-white font-mono">{formatMoney(hourlyWage)}</strong>.
                    Lương tối thiểu của sàn {region.name} là <strong className="text-white font-mono">{formatMoney(region.minHourlyWage)}</strong>.
                    {hourlyWage >= region.minHourlyWage ? (
                      <span className="text-emerald-400 block font-semibold mt-1">✓ Lương giờ đạt hoặc vượt mức tối thiểu quy định.</span>
                    ) : (
                      <span className="text-rose-400 block font-semibold mt-1">✗ Cảnh báo: Lương giờ dưới mức tối thiểu theo luật lao động!</span>
                    )}
                  </div>
                </div>

                {/* Job reference range */}
                <div className="space-y-1">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-wider font-mono block">Nhóm nghề & Tham chiếu ngành:</span>
                  <div className="text-sm text-white/85 leading-relaxed font-normal">
                    Phân loại: <strong className="text-white">{activeResult.jobCategory}</strong>
                    <br />
                    Khoảng lương giờ tham chiếu: <strong className="text-white font-mono">{formatMoney(activeResult.suggestedHourlyRange[0])} - {formatMoney(activeResult.suggestedHourlyRange[1])}</strong>.
                  </div>
                </div>
              </div>

              {/* Relative Surplus simulation */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-wider font-mono">Mô phỏng thặng dư tương đối (Tăng năng suất)</span>
                  <label className="flex items-center gap-2 text-sm text-white/85 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isTechApplied}
                      onChange={e => setIsTechApplied(e.target.checked)}
                      className="accent-white w-4 h-4 cursor-pointer"
                    />
                    <span>Áp dụng công nghệ/AI</span>
                  </label>
                </div>
                <p className="text-sm text-white/60 leading-relaxed font-normal">
                  Khi năng suất lao động tăng (ví dụ áp dụng AI), thời gian cần thiết để bù đắp chi phí tái sinh sức lao động (necessaryHours) sẽ giảm đi, làm gia tăng thời gian làm thặng dư cho chủ ruộng/capitalist mà không cần kéo dài ngày làm việc.
                </p>
              </div>

              {/* Day Breakdown Visualizer */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-white/40 uppercase tracking-wider font-mono block">Bóc tách ngày làm việc của bạn:</span>
                <div className="w-full bg-white/10 h-8 rounded-xl overflow-hidden flex font-mono text-xs text-black font-extrabold relative">
                  <div
                    className="bg-blue-400 h-full flex items-center justify-center transition-all duration-500"
                    style={{ width: `${(necessaryHours / hoursPerDay) * 100}%` }}
                    title="Thời gian lao động tất yếu"
                  >
                    {necessaryHours > 1 && `${necessaryHours.toFixed(1)}h Tất yếu`}
                  </div>
                  <div
                    className="bg-amber-400 h-full flex items-center justify-center transition-all duration-500"
                    style={{ width: `${(surplusHours / hoursPerDay) * 100}%` }}
                    title="Thời gian lao động thặng dư"
                  >
                    {surplusHours > 1 && `${surplusHours.toFixed(1)}h Thặng dư`}
                  </div>
                </div>
                <div className="flex justify-between text-[11px] text-white/50 font-mono">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> Lao động tất yếu: bù đắp mức sống sinh tồn</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Lao động thặng dư: tạo thặng dư cho chủ</span>
                </div>
              </div>

              {/* Academic Details Toggle */}
              <div className="border-t border-white/5 pt-4">
                <span className="text-xs font-bold text-white/30 uppercase tracking-wider font-mono block mb-2">Đại lượng học thuật:</span>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm font-mono text-white/75">
                  <div>Tỷ suất thặng dư (m'): <strong className="text-white">{Math.round(surplusRatio)}%</strong></div>
                  <div>Giá trị thặng dư tạo ra/tháng (m): <strong className="text-white">{formatMoney(monthlySurplusValue)}</strong></div>
                  <div>Cường độ bóc lột: <strong className="text-white">{(surplusRatio / 100).toFixed(2)} lần v</strong></div>
                </div>
              </div>

              {/* AI commentary */}
              {activeResult.plainExplanation && (
                <div className="bg-emerald-500/5 border border-emerald-500/10 text-emerald-300 p-4 rounded-xl text-sm leading-relaxed space-y-1">
                  <strong className="text-white font-semibold flex items-center gap-1">
                    <Bot className="w-4 h-4 text-emerald-400" /> Nhận định của Thầy Nam AI:
                  </strong>
                  <p className="font-normal">{activeResult.plainExplanation}</p>
                </div>
              )}
            </div>
          )}

          {/* Inline Thay Nam AI Panel */}
          {!hasBlockingWarning && isFormComplete && (
            <InlineThayNamAI
              chapterId={3}
              mode="salary_explain"
              currentStateSummary={`Vị trí: ${jobTitle}. Mức lương: ${formatMoney(monthlySalary)}. Thời gian làm: ${hoursPerDay}h/ngày, ${workingDaysPerMonth} ngày/tháng. Chi phí sinh hoạt: ${formatMoney(livingCost || 0)}. Tỷ suất thặng dư: ${Math.round(surplusRatio)}%.`}
              curriculumContext="Giá trị hàng hóa sức lao động được đo bằng giá trị các tư liệu sinh hoạt cần thiết để duy trì sức lao động của người công nhân và gia đình họ. Giá trị thặng dư (m) là phần giá trị dôi ra ngoài giá trị sức lao động do công nhân làm thuê tạo ra và bị nhà tư bản chiếm đoạt."
              placeholderText="Hỏi Thầy Nam AI thêm về giá trị sức lao động, phương pháp bóc lột tuyệt đối hay tương đối..."
            />
          )}

        </div>
      </div>
    </div>
  );
}
