import { useState } from "react";
import { HelpCircle, ShieldAlert, Award, UserCheck, Users } from "lucide-react";
import { InlineThayNamAI } from "../InlineThayNamAI";

type MarketStructureId = "perfect" | "oligopoly" | "dominant" | "monopoly";

interface MarketStructureOption {
  id: MarketStructureId;
  name: string;
  defaultFirms: number;
  defaultBarriers: number;
  defaultPower: number;
  description: string;
}

const MARKET_STRUCTURES: MarketStructureOption[] = [
  {
    id: "perfect",
    name: "Cạnh tranh hoàn hảo (Rất nhiều người bán)",
    defaultFirms: 500,
    defaultBarriers: 5,
    defaultPower: 2,
    description: "Sản phẩm đồng nhất, tự do gia nhập thị trường, không có doanh nghiệp nào đủ lớn để thao túng giá cả."
  },
  {
    id: "oligopoly",
    name: "Độc quyền nhóm (Vài ông lớn chi phối)",
    defaultFirms: 4,
    defaultBarriers: 75,
    defaultPower: 65,
    description: "Một vài tập đoàn lớn thống lĩnh thị trường (ví dụ: thị trường viễn thông, hàng không), cạnh tranh gay gắt nhưng dễ bắt tay ngầm."
  },
  {
    id: "dominant",
    name: "Doanh nghiệp thống lĩnh (1 ông lớn + nhiều ông nhỏ)",
    defaultFirms: 25,
    defaultBarriers: 60,
    defaultPower: 50,
    description: "Một doanh nghiệp chiếm trên 30% thị phần dẫn dắt luật chơi, các doanh nghiệp nhỏ bám đuôi theo."
  },
  {
    id: "monopoly",
    name: "Độc quyền hoàn toàn / Tự nhiên (Duy nhất 1 DN)",
    defaultFirms: 1,
    defaultBarriers: 98,
    defaultPower: 95,
    description: "Duy nhất một doanh nghiệp cung cấp dịch vụ thiết yếu, rào cản gia nhập tuyệt đối (ví dụ: EVN trong truyền tải điện)."
  }
];

export function Chapter4CompetitionMonopolyLab() {
  const [selectedStructureId, setSelectedStructureId] = useState<MarketStructureId>("oligopoly");
  const [firmsCount, setFirmsCount] = useState(4);
  const [entryBarriers, setEntryBarriers] = useState(75);
  const [pricingPower, setPricingPower] = useState(65);
  const [reflectionAnswered, setReflectionAnswered] = useState<number | null>(null);

  // Sync sliders with selected structure default presets
  const handleStructureChange = (id: MarketStructureId) => {
    setSelectedStructureId(id);
    const target = MARKET_STRUCTURES.find(m => m.id === id);
    if (target) {
      setFirmsCount(target.defaultFirms);
      setEntryBarriers(target.defaultBarriers);
      setPricingPower(target.defaultPower);
      setReflectionAnswered(null);
    }
  };

  // Mathematical simulation for Chapter 4 Lab (Output indices 0-100, labeled as mock simulation)
  const monopolyRisk = Math.round(entryBarriers * 0.5 + pricingPower * 0.4 + (100 - Math.min(100, firmsCount * 5)) * 0.1);
  const competitionLevel = Math.max(0, 100 - monopolyRisk);

  // Consumer cost markup impact
  const consumerImpact = Math.round(pricingPower * 0.8 + entryBarriers * 0.2);
  // Worker wage suppression risk (due to lack of job choices)
  const workerImpact = Math.round(entryBarriers * 0.6 + (100 - Math.min(100, firmsCount * 8)) * 0.4);

  // AI Prompt Context
  const getAiContextSummary = () => {
    return `Cấu trúc thị trường mô phỏng: ${selectedStructureId}
Số doanh nghiệp tham gia: ${firmsCount}
Mức rào cản gia nhập (0-100): ${entryBarriers}
Quyền lực áp đặt giá (0-100): ${pricingPower}
Chỉ số Cạnh tranh (0-100): ${competitionLevel}
Nguy cơ Độc quyền hóa (0-100): ${monopolyRisk}
Tác động bất lợi cho Người tiêu dùng: ${consumerImpact}
Rủi ro chèn ép Người lao động: ${workerImpact}`;
  };

  const getCurriculumContext = () => {
    return `Giáo trình Chương 4 dạy về Cạnh tranh và Độc quyền:
- Tích tụ và tập trung sản xuất đến mức độ nhất định dẫn đến Độc quyền.
- Độc quyền áp đặt giá cả độc quyền (mua rẻ nguyên liệu đầu vào, bán đắt hàng hóa đầu ra) để thu lợi nhuận độc quyền cao.
- Độc quyền làm giảm động lực kỹ thuật nếu không có cạnh tranh, gây thiệt hại quyền lợi người tiêu dùng và bóc lột người lao động sâu hơn.`;
  };

  return (
    <div className="w-full space-y-8 animate-fade-rise">
      {/* Header */}
      <div className="liquid-glass border border-white/10 rounded-3xl p-6 md:p-8 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 text-[9px] font-bold bg-white/10 text-white border border-white/15 rounded-md uppercase font-mono">
            Công cụ Chương 4
          </span>
          <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded font-mono">
            ⚠️ CHỈ SỐ MÔ PHỎNG HỌC THUẬT
          </span>
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
          Lab Tương Tác: Cạnh Tranh & Độc Quyền Thị Trường
        </h3>
        <p className="text-xs md:text-sm text-white/60 leading-relaxed font-light">
          Khám phá quy luật phát triển từ cạnh tranh tự do lên độc quyền. Điều chỉnh cấu trúc doanh nghiệp và rào cản gia nhập để mô phỏng sự dịch chuyển của quyền lực định giá cả, ảnh hưởng đến xã hội.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Control Panel */}
        <div className="liquid-glass border border-white/10 rounded-3xl p-6 space-y-6 h-fit">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block font-mono">
              1. Lựa chọn cấu trúc thị trường
            </span>
            <div className="flex flex-col gap-2">
              {MARKET_STRUCTURES.map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleStructureChange(m.id)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold transition-all flex flex-col gap-1.5 cursor-pointer ${
                    selectedStructureId === m.id
                      ? "bg-white border-white text-black shadow-lg shadow-white/5"
                      : "bg-neutral-900/40 border-white/5 text-white/70 hover:bg-white/5"
                  }`}
                >
                  <span>{m.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1 text-xs text-white/50 leading-relaxed italic border-l-2 border-white/10 pl-3">
            {MARKET_STRUCTURES.find(m => m.id === selectedStructureId)?.description}
          </div>

          {/* Sliders */}
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono text-white/50">
                <span>SỐ DOANH NGHIỆP:</span>
                <span className="text-white font-bold">{firmsCount} DN</span>
              </div>
              <input
                type="range"
                min="1"
                max="500"
                value={firmsCount}
                onChange={e => {
                  setFirmsCount(Number(e.target.value));
                  setReflectionAnswered(null);
                }}
                className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono text-white/50">
                <span>RÀO CẢN GIA NHẬP:</span>
                <span className="text-white font-bold">{entryBarriers}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={entryBarriers}
                onChange={e => {
                  setEntryBarriers(Number(e.target.value));
                  setReflectionAnswered(null);
                }}
                className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono text-white/50">
                <span>QUYỀN LỰC ĐỊNH GIÁ:</span>
                <span className="text-white font-bold">{pricingPower}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={pricingPower}
                onChange={e => {
                  setPricingPower(Number(e.target.value));
                  setReflectionAnswered(null);
                }}
                className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="liquid-glass border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
            
            {/* Visual Indicators */}
            <div className="grid grid-cols-2 gap-4 border-b border-white/5 pb-6">
              <div className="bg-white/[0.01] border border-white/5 rounded-xl p-4 text-center space-y-1">
                <span className="text-[10px] text-white/40 uppercase font-mono block">Chỉ số cạnh tranh</span>
                <div className="text-2xl md:text-3xl font-bold font-mono text-white">{competitionLevel}%</div>
              </div>
              <div className="bg-white/[0.01] border border-white/5 rounded-xl p-4 text-center space-y-1">
                <span className="text-[10px] text-white/40 uppercase font-mono block">Nguy cơ độc quyền</span>
                <div className="text-2xl md:text-3xl font-bold font-mono text-rose-400">{monopolyRisk}%</div>
              </div>
            </div>

            {/* Impact Outputs */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Tác động đối với các thực thể xã hội:</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Consumer impact card */}
                <div className="bg-white/[0.01] border border-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-white text-xs font-bold font-mono uppercase tracking-wider">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>Người tiêu dùng</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-400 h-full" style={{ width: `${consumerImpact}%` }} />
                  </div>
                  <p className="text-[11px] text-white/50 leading-relaxed font-light">
                    {consumerImpact > 70
                      ? "Bị ép mua sản phẩm thiết yếu với giá cả độc quyền cực cao, quyền lợi bị bóc lột gián tiếp."
                      : consumerImpact > 30
                      ? "Giá cả tương đối ổn định nhưng ít cơ hội mặc cả hoặc lựa chọn sản phẩm thay thế."
                      : "Được hưởng lợi tối đa từ cạnh tranh giảm giá bán và nhiều sự lựa chọn đa dạng."}
                  </p>
                </div>

                {/* Worker impact card */}
                <div className="bg-white/[0.01] border border-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-white text-xs font-bold font-mono uppercase tracking-wider">
                    <UserCheck className="w-4 h-4 text-amber-400" />
                    <span>Người lao động làm thuê</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full" style={{ width: `${workerImpact}%` }} />
                  </div>
                  <p className="text-[11px] text-white/50 leading-relaxed font-light">
                    {workerImpact > 70
                      ? "DN độc quyền kiểm soát đầu vào sức lao động, nguy cơ ép lương thấp dưới giá trị thực tế."
                      : workerImpact > 30
                      ? "Cơ hội chuyển việc hạn chế, điều kiện làm việc do giới độc quyền tự ban hành luật lệ."
                      : "Cạnh tranh tuyển dụng gay gắt giúp công nhân dễ thương lượng tăng lương và phúc lợi tốt."}
                  </p>
                </div>
              </div>
            </div>

            {/* Academic Summary */}
            <div className="bg-rose-500/5 border border-rose-500/10 text-rose-200 p-5 rounded-2xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider font-mono block">Mối liên hệ học thuyết:</span>
                <p className="text-xs text-white/70 leading-relaxed font-light">
                  Khi độc quyền chi phối ({monopolyRisk}% &gt; 70%), các tổ chức độc quyền thu <strong>Lợi nhuận độc quyền cao</strong> vượt xa tỷ suất lợi nhuận trung bình bằng cách áp đặt <strong>Giá cả độc quyền</strong>. Đây là nguyên nhân kìm hãm sự tiến bộ kỹ thuật tự nhiên nếu không có luật cạnh tranh điều tiết của Nhà nước.
                </p>
              </div>
            </div>

            {/* Mini quiz / reflection */}
            <div className="border-t border-white/5 pt-6 space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-white/40" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider font-mono">Đánh giá nhanh</span>
              </div>
              <h5 className="text-xs md:text-sm font-bold text-white leading-relaxed">
                Độc quyền xuất hiện có xóa bỏ hoàn toàn sự cạnh tranh trên thị trường hay không?
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setReflectionAnswered(1)}
                  className={`p-3.5 text-left rounded-xl border text-xs font-semibold transition-all cursor-pointer ${reflectionAnswered === 1 ? "bg-white border-white text-black" : "bg-neutral-900/40 border-white/5 text-white/70 hover:bg-white/5"}`}
                >
                  A. Xóa bỏ hoàn toàn cạnh tranh tự do.
                </button>
                <button
                  type="button"
                  onClick={() => setReflectionAnswered(2)}
                  className={`p-3.5 text-left rounded-xl border text-xs font-semibold transition-all cursor-pointer ${reflectionAnswered === 2 ? "bg-white border-white text-black" : "bg-neutral-900/40 border-white/5 text-white/70 hover:bg-white/5"}`}
                >
                  B. Không xóa bỏ, cạnh tranh trở nên gay gắt hơn.
                </button>
              </div>

              {reflectionAnswered !== null && (
                <div className="bg-white/[0.01] border border-white/5 rounded-xl p-4 text-xs leading-relaxed space-y-2 animate-fade-rise">
                  <div className="flex items-center gap-1.5 font-bold">
                    {reflectionAnswered === 2 ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Award className="w-4 h-4 text-emerald-400" /> Đúng vậy!
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold">Chưa chính xác!</span>
                    )}
                  </div>
                  <p className="text-white/60 font-light">
                    Độc quyền sinh ra từ cạnh tranh tự do, nhưng nó <strong>không thủ tiêu cạnh tranh</strong>. Trái lại, độc quyền làm cho cạnh tranh trở nên gay gắt, khốc liệt hơn (cạnh tranh giữa các tổ chức độc quyền với nhau, cạnh tranh giữa độc quyền với DN ngoài độc quyền).
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Inline Thay Nam AI Panel */}
          {reflectionAnswered !== null && (
            <InlineThayNamAI
              chapterId={4}
              mode="chapter_tool_explain"
              currentStateSummary={getAiContextSummary()}
              curriculumContext={getCurriculumContext()}
              placeholderText="Hỏi Thầy Nam AI thêm về bản chất của tư bản tài chính, tài phiệt hay chính sách kiểm soát độc quyền của Nhà nước..."
            />
          )}

        </div>
      </div>
    </div>
  );
}
