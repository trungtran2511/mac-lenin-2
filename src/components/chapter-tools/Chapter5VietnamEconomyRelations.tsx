import { useState, useEffect } from "react";
import { Users, HelpCircle, CheckCircle2, ShieldCheck, Heart } from "lucide-react";
import { InlineThayNamAI } from "../InlineThayNamAI";

interface ActorDetail {
  role: string;
  benefit: string;
  cost: string;
}

interface Scenario5 {
  id: string;
  title: string;
  description: string;
  actors: {
    state: ActorDetail;
    private: ActorDetail;
    fdi: ActorDetail;
    worker: ActorDetail;
    consumer: ActorDetail;
    cooperative: ActorDetail;
  };
  conclusion: string;
}

const ACTOR_LABELS = {
  state: { label: "Nhà nước", icon: ShieldCheck, color: "text-rose-400 border-rose-500/20 bg-rose-500/5" },
  private: { label: "Kinh tế Tư nhân", icon: Users, color: "text-blue-400 border-blue-500/20 bg-blue-500/5" },
  fdi: { label: "Khu vực FDI", icon: Users, color: "text-sky-400 border-sky-500/20 bg-sky-500/5" },
  worker: { label: "Người Lao Động", icon: Heart, color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" },
  consumer: { label: "Người Tiêu Dùng", icon: Users, color: "text-amber-400 border-amber-500/20 bg-amber-500/5" },
  cooperative: { label: "Khu vực Hợp tác xã", icon: Users, color: "text-purple-400 border-purple-500/20 bg-purple-500/5" }
};

export function Chapter5VietnamEconomyRelations() {
  const [scenarios, setScenarios] = useState<Scenario5[]>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState("");
  const [activeActorId, setActiveActorId] = useState<keyof typeof ACTOR_LABELS>("worker");
  const [reflectionAnswered, setReflectionAnswered] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/chapter_tool_scenarios.json")
      .then(res => res.json())
      .then(data => {
        if (data.chapter5) {
          setScenarios(data.chapter5);
          setSelectedScenarioId(data.chapter5[0]?.id || "");
        }
      })
      .catch(err => console.error("Failed to load scenarios for Ch5", err));
  }, []);

  const currentScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];

  const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedScenarioId(e.target.value);
    setReflectionAnswered(null);
  };

  if (!currentScenario) {
    return <div className="text-white text-xs">Đang tải dữ liệu chính sách kinh tế...</div>;
  }

  // AI Prompt Context
  const getAiContextSummary = () => {
    return `Chính sách đang phân tích: ${currentScenario.title}
Mô tả chính sách: ${currentScenario.description}
Khía cạnh đang xem kỹ: Vai trò, lợi ích và chi phí của chủ thể '${ACTOR_LABELS[activeActorId].label}'`;
  };

  const getCurriculumContext = () => {
    return `Giáo trình Chương 5 giảng về Quan hệ lợi ích kinh tế ở Việt Nam:
- Quan hệ lợi ích kinh tế là sự thiết lập các mối liên kết giữa các chủ thể nhằm thực hiện lợi ích vật chất.
- Trong nền kinh tế thị trường định hướng XHCN, các quan hệ lợi ích vừa thống nhất (chủ thể này có lợi thì thúc đẩy chủ thể kia phát triển), vừa mâu thuẫn (như phân chia giá trị thặng dư giữa giới chủ và lao động).
- Nhà nước có vai trò điều hòa, giải quyết mâu thuẫn lợi ích bằng luật pháp và các chính sách phân phối, đảm bảo công bằng xã hội.`;
  };

  const activeActorData = currentScenario.actors[activeActorId];
  const ActiveActorIcon = ACTOR_LABELS[activeActorId].icon;

  return (
    <div className="w-full space-y-8 animate-fade-rise">
      {/* Header */}
      <div className="liquid-glass border border-white/10 rounded-3xl p-6 md:p-8 space-y-4">
        <span className="px-2.5 py-1 text-[9px] font-bold bg-white/10 text-white border border-white/15 rounded-md uppercase font-mono">
          Công cụ Chương 5
        </span>
        <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
          Bản Đồ Quan Hệ Lợi Ích Kinh Tế Việt Nam
        </h3>
        <p className="text-xs md:text-sm text-white/60 leading-relaxed font-light">
          Học thuyết Mác - Lênin vạch rõ: Kinh tế thực chất là tổng hòa các quan hệ lợi ích vật chất. Chọn một chính sách điều tiết vĩ mô bên dưới để xem sự phân phối lợi ích và chi phí giữa các chủ thể trong nền kinh tế Việt Nam.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Controller: Policy Selector & Actor Grid */}
        <div className="space-y-4">
          <div className="liquid-glass border border-white/10 rounded-3xl p-6 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block font-mono">
                1. Chọn tình huống vĩ mô
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

            <p className="text-xs text-white/50 leading-relaxed italic border-l-2 border-white/10 pl-3">
              {currentScenario.description}
            </p>
          </div>

          {/* Actor Selector buttons */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block font-mono px-2">
              2. Click chọn chủ thể kinh tế
            </span>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(ACTOR_LABELS) as Array<keyof typeof ACTOR_LABELS>).map(actorId => {
                const isSelected = activeActorId === actorId;
                const config = ACTOR_LABELS[actorId];
                return (
                  <button
                    key={actorId}
                    type="button"
                    onClick={() => setActiveActorId(actorId)}
                    className={`p-3 text-left rounded-xl border text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? "bg-white border-white text-black shadow-lg shadow-white/5"
                        : "bg-neutral-900/40 border-white/5 text-white/70 hover:bg-white/5"
                    }`}
                  >
                    <config.icon className="w-4 h-4 shrink-0" />
                    <span>{config.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Actor Details Card */}
          <div className="liquid-glass border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
            
            {/* Actor Header */}
            <div className="border-b border-white/5 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${ACTOR_LABELS[activeActorId].color}`}>
                  <ActiveActorIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider font-mono">Vai trò trong kịch bản</span>
                  <h4 className="text-lg font-bold text-white mt-0.5">{ACTOR_LABELS[activeActorId].label}</h4>
                </div>
              </div>
            </div>

            {/* Role / Duty */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider font-mono block">Vai trò thực tiễn:</span>
              <p className="text-xs md:text-sm text-white/90 leading-relaxed font-light">
                {activeActorData.role}
              </p>
            </div>

            {/* Benefits vs Costs grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-5 space-y-2">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono block">Lợi ích đạt được (+):</span>
                <p className="text-xs text-white/70 leading-relaxed font-light">
                  {activeActorData.benefit}
                </p>
              </div>
              <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-5 space-y-2">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider font-mono block">Chi phí / Rủi ro chịu đựng (-):</span>
                <p className="text-xs text-white/70 leading-relaxed font-light">
                  {activeActorData.cost}
                </p>
              </div>
            </div>

            {/* State Regulation Conclusion */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider font-mono block">Vai trò điều tiết vĩ mô của Nhà nước:</span>
              <p className="text-xs text-white/80 leading-relaxed font-light">
                {currentScenario.conclusion}
              </p>
            </div>

            {/* Mini quiz / reflection */}
            <div className="border-t border-white/5 pt-6 space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-white/40" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider font-mono">Đánh giá nhanh</span>
              </div>
              <h5 className="text-xs md:text-sm font-bold text-white leading-relaxed">
                Tại sao các quan hệ lợi ích kinh tế trong kịch bản này vừa thống nhất vừa mâu thuẫn với nhau?
              </h5>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setReflectionAnswered(true)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${reflectionAnswered === true ? "bg-white border-white text-black" : "bg-neutral-900/40 border-white/5 text-white/70 hover:bg-white/5"}`}
                >
                  Giải thích biện chứng
                </button>
                <button
                  type="button"
                  onClick={() => setReflectionAnswered(false)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${reflectionAnswered === false ? "bg-white border-white text-black" : "bg-neutral-900/40 border-white/5 text-white/70 hover:bg-white/5"}`}
                >
                  Mâu thuẫn triệt tiêu
                </button>
              </div>

              {reflectionAnswered !== null && (
                <div className="bg-white/[0.01] border border-white/5 rounded-xl p-4 text-xs leading-relaxed space-y-2 animate-fade-rise">
                  <div className="flex items-center gap-1.5 font-bold">
                    {reflectionAnswered === true ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Hoàn toàn chính xác!
                      </span>
                    ) : (
                      <span className="text-rose-400">Chưa chính xác!</span>
                    )}
                  </div>
                  <p className="text-white/60 font-light">
                    Các quan hệ lợi ích luôn có tính hai mặt. Thống nhất ở chỗ các chủ thể phụ thuộc nhau để cùng vận hành sản xuất xã hội (Ví dụ: FDI cần lao động, lao động cần lương). Mâu thuẫn ở chỗ tỷ lệ chia sẻ lợi nhuận/quỹ phúc lợi là giới hạn, đòi hỏi sự điều tiết thống nhất của Nhà nước định hướng XHCN để bảo vệ người yếu thế.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Inline Thay Nam AI Panel */}
          {reflectionAnswered !== null && (
            <InlineThayNamAI
              chapterId={5}
              mode="chapter_tool_explain"
              currentStateSummary={getAiContextSummary()}
              curriculumContext={getCurriculumContext()}
              placeholderText="Hỏi Thầy Nam AI thêm về bản chất quan hệ lợi ích hoặc định hướng xã hội chủ nghĩa..."
            />
          )}

        </div>
      </div>
    </div>
  );
}
