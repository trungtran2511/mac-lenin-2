import { useState, useEffect } from "react";
import { TrendingUp, RefreshCcw, Info, TrendingDown, HelpCircle, CheckCircle2 } from "lucide-react";
import { InlineThayNamAI } from "../InlineThayNamAI";

interface Scenario {
  id: string;
  title: string;
  description: string;
  laborCost: number;
  baseSupply: number;
  baseDemand: number;
  unit: string;
  source: string;
}

export function Chapter2CommodityMarketLab() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState("");
  const [supply, setSupply] = useState(100);
  const [demand, setDemand] = useState(100);
  const [reflectionAnswered, setReflectionAnswered] = useState<boolean | null>(null);

  // Load scenarios
  useEffect(() => {
    fetch("/chapter_tool_scenarios.json")
      .then(res => res.json())
      .then(data => {
        if (data.chapter2) {
          setScenarios(data.chapter2);
          setSelectedScenarioId(data.chapter2[0]?.id || "");
          setSupply(data.chapter2[0]?.baseSupply || 100);
          setDemand(data.chapter2[0]?.baseDemand || 100);
        }
      })
      .catch(err => {
        console.error("Failed to load scenarios:", err);
      });
  }, []);

  const currentScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];

  const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sId = e.target.value;
    setSelectedScenarioId(sId);
    const target = scenarios.find(s => s.id === sId);
    if (target) {
      setSupply(target.baseSupply);
      setDemand(target.baseDemand);
      setReflectionAnswered(null);
    }
  };

  if (!currentScenario) {
    return <div className="text-white text-xs">Đang tải dữ liệu mô phỏng...</div>;
  }

  // Pure Local Deterministic Calculation for Commodity Market Lab
  // Price deviates from value based on Supply/Demand pressure.
  // Formula: Price = LaborCost * (1 + (Demand - Supply) / (Demand + Supply) * 0.8)
  const valueOfCommodity = currentScenario.laborCost;
  const supplyDemandRatio = demand / supply;
  
  // Cap deviation between -40% and +40%
  const priceDeviation = Math.max(-0.4, Math.min(0.4, (demand - supply) / (demand + supply) * 0.8));
  const marketPrice = Math.round(valueOfCommodity * (1 + priceDeviation));

  const formatMoney = (v: number) => `${Math.round(v).toLocaleString()} đ`;

  // AI Prompt Context
  const getAiContextSummary = () => {
    return `Kịch bản mô phỏng Chương 2: ${currentScenario.title}
Hao phí lao động xã hội cần thiết (Giá trị): ${formatMoney(valueOfCommodity)}
Chỉ số Cung: ${supply}
Chỉ số Cầu: ${demand}
Tỷ lệ Cung/Cầu: ${supplyDemandRatio.toFixed(2)}
Giá cả thị trường tính toán: ${formatMoney(marketPrice)}
Độ lệch giá cả so với giá trị: ${Math.round(priceDeviation * 100)}%`;
  };

  const getCurriculumContext = () => {
    return `Giáo trình Chương 2 nhấn mạnh Quy luật giá trị:
- Sản xuất và trao đổi hàng hóa phải dựa trên hao phí lao động xã hội cần thiết.
- Trên thị trường, giá cả chịu tác động của Cung - Cầu, Cạnh tranh và Tiền tệ nên có thể dao động tự phát xung quanh Giá trị hàng hóa.
- Sự biến động của giá cả thị trường xung quanh giá trị chính là cơ chế hoạt động tự phát của quy luật giá trị.`;
  };

  return (
    <div className="w-full space-y-8 animate-fade-rise">
      {/* Header Notice */}
      <div className="liquid-glass border border-white/10 rounded-3xl p-6 md:p-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 text-[9px] font-bold bg-white/10 text-white border border-white/15 rounded-md uppercase font-mono">
            Công cụ Chương 2
          </span>
          <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded font-mono">
            ⚠️ VÍ DỤ HỌC TẬP
          </span>
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
          Lab Mô Phỏng: Giá Trị vs Giá Cả Thị Trường
        </h3>
        <p className="text-xs md:text-sm text-white/60 leading-relaxed font-light">
          Hiểu rõ cách Quy luật Giá trị vận động trong thực tế. Sử dụng các thanh trượt Cung - Cầu bên dưới để quan sát giá cả thị trường biến động xung quanh giá trị (hao phí lao động xã hội cần thiết) của hàng hóa.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sliders & Configuration */}
        <div className="liquid-glass border border-white/10 rounded-3xl p-6 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block font-mono">
              1. Chọn đối tượng kịch bản
            </span>
            <select
              value={selectedScenarioId}
              onChange={handleScenarioChange}
              className="w-full bg-neutral-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-white/30"
            >
              {scenarios.map(s => (
                <option key={s.id} value={s.id} className="bg-background text-white">
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1 text-xs text-white/50 leading-relaxed italic border-l-2 border-white/10 pl-3">
            {currentScenario.description}
          </div>

          {/* Sliders */}
          <div className="space-y-5 pt-2">
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-white/60">CUNG (Mức độ hàng hóa trên thị trường)</span>
                <span className="text-white font-bold">{supply} đơn vị</span>
              </div>
              <input
                type="range"
                min="30"
                max="200"
                value={supply}
                onChange={e => setSupply(Number(e.target.value))}
                className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-white/60">CẦU (Nhu cầu tiêu dùng xã hội)</span>
                <span className="text-white font-bold">{demand} đơn vị</span>
              </div>
              <input
                type="range"
                min="30"
                max="200"
                value={demand}
                onChange={e => setDemand(Number(e.target.value))}
                className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setSupply(currentScenario.baseSupply);
                  setDemand(currentScenario.baseDemand);
                  setReflectionAnswered(null);
                }}
                className="w-full py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCcw className="w-3.5 h-3.5" /> Thiết lập lại kịch bản
              </button>
            </div>
          </div>
        </div>

        {/* Outputs and Verdict */}
        <div className="lg:col-span-2 space-y-6">
          <div className="liquid-glass border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
            {/* Visual Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-white/5 pb-6">
              {/* Value display */}
              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between text-[10px] text-white/40 uppercase tracking-wider font-mono">
                  <span>Giá Trị Thực Tế</span>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">Hao phí lao động</span>
                </div>
                <div className="text-xl md:text-2xl font-mono font-bold text-white">
                  {formatMoney(valueOfCommodity)}
                </div>
                <div className="text-[10px] text-white/50">
                  Phản ánh hao phí lao động xã hội cần thiết để tạo ra 1 {currentScenario.unit}.
                </div>
              </div>

              {/* Price display */}
              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between text-[10px] text-white/40 uppercase tracking-wider font-mono">
                  <span>Giá Cả Thị Trường</span>
                  <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded">Giá bán thực tế</span>
                </div>
                <div className="text-xl md:text-2xl font-mono font-bold text-white flex items-center gap-2">
                  <span>{formatMoney(marketPrice)}</span>
                  {priceDeviation !== 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5 ${priceDeviation > 0 ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"}`}>
                      {priceDeviation > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(Math.round(priceDeviation * 100))}%
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-white/50">
                  Biến động dựa trên quan hệ cung - cầu tự phát.
                </div>
              </div>
            </div>

            {/* Verdict Explanation Box */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Giải thích học luận</h4>
              
              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 text-xs md:text-sm text-white/80 leading-relaxed font-light space-y-3">
                {priceDeviation === 0 ? (
                  <p>
                    <strong>Cung bằng Cầu:</strong> Khi cung cầu cân bằng, giá cả thị trường trùng khớp hoàn toàn với giá trị của hàng hóa ({formatMoney(valueOfCommodity)}). Đây là trạng thái lý tưởng của quy luật giá trị nhưng hiếm khi xảy ra ổn định trong thực tế.
                  </p>
                ) : priceDeviation > 0 ? (
                  <p>
                    <strong>Cầu vượt Cung ({Math.round(supplyDemandRatio * 100)}%):</strong> Nhu cầu mua lớn hơn nguồn hàng sẵn có. Người tiêu dùng sẵn sàng trả giá cao hơn để có được hàng hóa. Giá cả thị trường <strong>TĂNG CAO</strong> hơn giá trị thực tế ({Math.abs(Math.round(priceDeviation * 100))}%). Người sản xuất thu lợi nhuận siêu ngạch, kích thích họ mở rộng sản xuất.
                  </p>
                ) : (
                  <p>
                    <strong>Cung vượt Cung (Cầu thấp - {Math.round(supplyDemandRatio * 100)}%):</strong> Hàng hóa ứ đọng nhiều hơn nhu cầu người mua. Để giải phóng tồn kho, người bán cạnh tranh giảm giá. Giá cả thị trường <strong>GIẢM THẤP</strong> hơn giá trị ({Math.abs(Math.round(priceDeviation * 100))}%). Người sản xuất thua lỗ, buộc phải thu hẹp sản xuất hoặc đổi ngành.
                  </p>
                )}

                <div className="bg-neutral-900/60 p-4 rounded-xl flex items-start gap-2 text-xs border border-white/5 text-white/60">
                  <Info className="w-4 h-4 shrink-0 text-white/40 mt-0.5" />
                  <span>
                    Sự tự phát tăng giảm này giúp điều tiết lực lượng lao động xã hội tự động chảy từ ngành thừa sang ngành thiếu - chính là chức năng điều tiết của Quy luật Giá trị.
                  </span>
                </div>
              </div>
            </div>

            {/* Reflection / Mini Quiz */}
            <div className="border-t border-white/5 pt-6 space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-white/40" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider font-mono">Suy ngẫm học thuật</span>
              </div>
              <h5 className="text-xs md:text-sm font-bold text-white leading-relaxed">
                Biến động giá cả tự phát này có mâu thuẫn hay bác bỏ Quy luật giá trị không?
              </h5>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setReflectionAnswered(true)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${reflectionAnswered === true ? "bg-white border-white text-black" : "bg-neutral-900/40 border-white/5 text-white/70 hover:bg-white/5"}`}
                >
                  Có mâu thuẫn
                </button>
                <button
                  type="button"
                  onClick={() => setReflectionAnswered(false)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${reflectionAnswered === false ? "bg-white border-white text-black" : "bg-neutral-900/40 border-white/5 text-white/70 hover:bg-white/5"}`}
                >
                  Không mâu thuẫn
                </button>
              </div>

              {reflectionAnswered !== null && (
                <div className="bg-white/[0.01] border border-white/5 rounded-xl p-4 text-xs leading-relaxed space-y-2 animate-fade-rise">
                  <div className="flex items-center gap-1.5 font-bold">
                    {reflectionAnswered === false ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Hoàn toàn chính xác!
                      </span>
                    ) : (
                      <span className="text-rose-400">Chưa chính xác!</span>
                    )}
                  </div>
                  <p className="text-white/60 font-light">
                    Sự dao động giá cả thị trường xung quanh giá trị không bác bỏ Quy luật Giá trị. Trái lại, đó chính là <strong>phương thức hoạt động duy nhất</strong> của quy luật này. Nếu cộng gộp toàn bộ nền kinh tế trong chu kỳ dài, tổng giá cả luôn bằng tổng giá trị hàng hóa.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Inline Thay Nam AI Panel */}
          {reflectionAnswered !== null && (
            <InlineThayNamAI
              chapterId={2}
              mode="chapter_tool_explain"
              currentStateSummary={getAiContextSummary()}
              curriculumContext={getCurriculumContext()}
              placeholderText="Hỏi Thầy Nam AI thêm về vai trò của Quy luật giá trị hoặc điều tiết thị trường..."
            />
          )}
        </div>
      </div>
    </div>
  );
}
