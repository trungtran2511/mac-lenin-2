import { useState } from "react";
import { HelpCircle, CheckCircle2, Bot, Loader2 } from "lucide-react";
import { InlineThayNamAI } from "../InlineThayNamAI";

interface CareerPlanPreset {
  title: string;
  modernizationLink: string;
  skillsNeeded: string;
  opportunities: string;
  risks: string;
}

const PRESETS: Record<string, CareerPlanPreset> = {
  it: {
    title: "Lập trình viên / Công nghệ phần mềm",
    modernizationLink: "Gắn liền trực tiếp với quá trình chuyển đổi số quốc gia, phát triển nền kinh tế tri thức và Cách mạng công nghiệp 4.0.",
    skillsNeeded: "Trí tuệ nhân tạo (AI), điện toán đám mây, kiến trúc phần mềm, tư duy giải quyết vấn đề và ngoại ngữ hội nhập.",
    opportunities: "Làm việc từ xa trong chuỗi giá trị phần mềm toàn cầu, tham gia các dự án outsource lớn hoặc khởi nghiệp đổi mới sáng tạo.",
    risks: "Sự đào thải nhanh chóng của công nghệ mới nếu không tự cập nhật nâng cấp trình độ sức lao động cá nhân."
  },
  agri: {
    title: "Nông nghiệp công nghệ cao",
    modernizationLink: "Chuyển dịch cơ cấu lao động từ nông nghiệp thủ công sang nông nghiệp cơ giới hóa, tự động hóa bằng cảm biến IoT và giống cây trồng sinh học.",
    skillsNeeded: "Vận hành thiết bị bay thông minh, phân tích dữ liệu nông nghiệp, tiêu chuẩn xuất khẩu quốc tế (GlobalGAP, hữu cơ).",
    opportunities: "Xuất khẩu nông sản sạch sang thị trường EU/Mỹ thông qua các FTA (EVFTA), xây dựng thương hiệu nông nghiệp xanh sạch.",
    risks: "Biến đổi khí hậu cực đoan, rủi ro phụ thuộc vào phân bón và hạt giống công nghệ nhập khẩu."
  },
  mech: {
    title: "Chế tạo cơ khí / Tự động hóa",
    modernizationLink: "Cốt lõi của công nghiệp hóa hiện đại. Phát triển lực lượng sản xuất cơ khí chính xác làm bệ đỡ cho các ngành sản xuất khác.",
    skillsNeeded: "Thiết kế CAD/CAM, lập trình cánh tay robot PLC, bảo trì hệ thống điều khiển tự động.",
    opportunities: "Tham gia các nhà máy chế tạo thông minh của FDI, dịch chuyển chuỗi cung ứng linh kiện phụ trợ về Việt Nam.",
    risks: "Nguy cơ bị mắc kẹt ở phân khúc gia công giá trị thấp nếu không làm chủ được công nghệ thiết kế lõi."
  },
  logistics: {
    title: "Du lịch & Dịch vụ Logistics",
    modernizationLink: "Hiện đại hóa hạ tầng giao thông vận tải, ứng dụng kho bãi thông minh giúp tối ưu hóa chi phí lưu thông hàng hóa.",
    skillsNeeded: "Quản trị chuỗi cung ứng, thương mại điện tử quốc tế, quản lý hệ thống phân phối số.",
    opportunities: "Việt Nam nằm trên luồng hàng hải quốc tế bận rộn, cơ hội trở thành hub logistics trung chuyển của khu vực.",
    risks: "Sự cạnh tranh khốc liệt từ các tập đoàn logistics đa quốc gia có nguồn lực tài chính vượt trội."
  }
};

export function Chapter6ModernizationPlanner() {
  const [careerKey, setCareerKey] = useState("it");
  const [customCareer, setCustomCareer] = useState("");
  const [techLevel, setTechLevel] = useState("semi");
  const [skillTarget, setSkillTarget] = useState("specialist");
  const [integrationLevel, setIntegrationLevel] = useState("global");

  // AI reflection draft
  const [aiReflection, setAiReflection] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [reflectionAnswered, setReflectionAnswered] = useState<boolean | null>(null);

  const isCustom = careerKey === "custom";
  const activePreset = PRESETS[careerKey] || {
    title: customCareer || "Ngành nghề của bạn",
    modernizationLink: "Liên quan đến việc cơ giới hóa và ứng dụng công nghệ số vào lĩnh vực lao động cụ thể.",
    skillsNeeded: "Đòi hỏi kỹ năng chuyên môn tương ứng và khả năng tự thích ứng nhanh chóng.",
    opportunities: "Mở rộng thị trường ra khu vực và tiếp thu phương pháp quản lý tiên tiến.",
    risks: "Nguy cơ tụt hậu công nghệ so với mặt bằng chung của xã hội."
  };

  const getTechLevelLabel = () => {
    if (techLevel === "manual") return "Thủ công / Truyền thống";
    if (techLevel === "semi") return "Cơ giới hóa / Bán tự động";
    return "Tự động hóa hoàn toàn / Ứng dụng AI (Cách mạng 4.0)";
  };

  const getSkillTargetLabel = () => {
    if (skillTarget === "basic") return "Kỹ năng cơ bản / Thực thi tác vụ";
    if (skillTarget === "specialist") return "Chuyên gia chuyên sâu / Thiết kế lõi";
    return "Quản lý / Điều phối hội nhập toàn cầu";
  };

  const getIntegrationLabel = () => {
    if (integrationLevel === "domestic") return "Sản xuất nội địa";
    if (integrationLevel === "regional") return "Hợp tác khu vực (ASEAN)";
    return "Tham gia chuỗi giá trị toàn cầu (GVC / FTA)";
  };

  // AI Prompt Context
  const getAiContextSummary = () => {
    return `Ngành nghề quan tâm: ${activePreset.title}
Trình độ công nghệ hiện tại: ${getTechLevelLabel()}
Mục tiêu kỹ năng: ${getSkillTargetLabel()}
Mức hội nhập mong muốn: ${getIntegrationLabel()}`;
  };

  const getCurriculumContext = () => {
    return `Giáo trình Chương 6 giảng về Công nghiệp hóa, hiện đại hóa ở Việt Nam:
- Công nghiệp hóa, hiện đại hóa là quá trình chuyển đổi căn bản, toàn diện các hoạt động sản xuất từ sử dụng lao động thủ công sang lao động bằng công nghệ và phương pháp hiện đại (CN 4.0).
- Hội nhập kinh tế quốc tế giúp mở rộng thị trường, thu hút FDI, chuyển giao công nghệ, nhưng cũng đi kèm rủi ro bị phụ thuộc, tụt hậu công nghệ và bị cạnh tranh gay gắt.
- Trình độ lao động (chất lượng sức lao động) là yếu tố quyết định thắng lợi của công nghiệp hóa hiện đại hóa.`;
  };

  // Call Thay Nam AI to generate reflection
  const handleGenerateReflection = async () => {
    setIsAiLoading(true);
    setAiReflection("");

    const prompt = `Lập lộ trình học tập & phản ánh (Reflection) cho sinh viên:
- Ngành nghề: ${activePreset.title}
- Trình độ công nghệ: ${getTechLevelLabel()}
- Mục tiêu năng lực: ${getSkillTargetLabel()}
- Mức hội nhập: ${getIntegrationLabel()}

Hãy soạn thảo một đoạn Phản ánh học tập (study reflection) ngắn khoảng 5-6 câu bằng tiếng Việt:
1. Liên hệ ngành này với Công nghiệp hóa, hiện đại hóa ở Việt Nam.
2. Đưa ra 2-3 gợi ý hành động nâng cao kỹ năng để đón đầu CMCN 4.0.
3. Lời khuyên hội nhập và phòng ngừa rủi ro bị đào thải.

Bắt đầu bằng câu: "[Gợi ý học tập đính kèm]"`;

    const systemInstruction = "Bạn là Thầy Nam AI. Hãy soạn một bản phản ánh học tập tích cực, mang tính giáo dục sâu sắc, truyền cảm hứng giúp người học nâng cấp chất lượng sức lao động để hội nhập quốc tế. Tuyệt đối KHÔNG sử dụng bất kỳ định dạng markdown nào (như dấu sao đôi **, dấu thăng #, gạch đầu dòng, danh sách), chỉ trả về văn bản thuần túy không định dạng.";

    try {
      const { askThayNamAI } = await import("../../lib/ai");
      const raw = await askThayNamAI(prompt, systemInstruction);
      setAiReflection(raw);
    } catch (err) {
      console.warn("AI reflection generation failed", err);
      setAiReflection(`[LỖI AI] Không thể kết nối để tạo phản ánh tự động: ${(err as Error).message}. Bạn vẫn có thể xem lộ trình tham khảo bên dưới.`);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8 animate-fade-rise">
      {/* Header */}
      <div className="liquid-glass border border-white/10 rounded-3xl p-6 md:p-8 space-y-4">
        <span className="px-2.5 py-1 text-[9px] font-bold bg-white/10 text-white border border-white/15 rounded-md uppercase font-mono">
          Công cụ Chương 6
        </span>
        <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
          Planner Công Nghiệp Hóa, Hiện Đại Hóa & Hội Nhập
        </h3>
        <p className="text-xs md:text-sm text-white/60 leading-relaxed font-light">
          Xác định tương lai nghề nghiệp của bản thân trong tiến trình phát triển đất nước. Thiết lập các thông số nghề nghiệp để xem cơ hội, rủi ro và nhận phản ánh định hướng nâng cao chất lượng sức lao động.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Inputs */}
        <div className="liquid-glass border border-white/10 rounded-3xl p-6 space-y-5 h-fit">
          <div className="border-b border-white/5 pb-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Tham số định hướng nghề</h4>
          </div>

          {/* Preset selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider font-mono">1. Chọn ngành nghề:</label>
            <select
              value={careerKey}
              onChange={e => {
                setCareerKey(e.target.value);
                setAiReflection("");
                setReflectionAnswered(null);
              }}
              className="w-full bg-neutral-900/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-white/30"
            >
              <option value="it">Lập trình viên / Công nghệ phần mềm</option>
              <option value="agri">Nông nghiệp công nghệ cao</option>
              <option value="mech">Chế tạo cơ khí / Tự động hóa</option>
              <option value="logistics">Du lịch & Dịch vụ logistics</option>
              <option value="custom">Ngành nghề khác (Tự nhập)</option>
            </select>
          </div>

          {/* Custom Input if selected */}
          {isCustom && (
            <div className="space-y-1.5 animate-fade-rise">
              <label className="text-[10px] font-bold text-white/50 uppercase tracking-wider font-mono">Tên ngành nghề tự nhập:</label>
              <input
                type="text"
                value={customCareer}
                onChange={e => {
                  setCustomCareer(e.target.value);
                  setAiReflection("");
                }}
                placeholder="Nhập tên ngành..."
                className="w-full bg-neutral-900/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          )}

          {/* Tech level */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider font-mono">2. Trình độ công nghệ hiện tại:</label>
            <select
              value={techLevel}
              onChange={e => {
                setTechLevel(e.target.value);
                setAiReflection("");
              }}
              className="w-full bg-neutral-900/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              <option value="manual">Thủ công dã chiến (Nhỏ lẻ)</option>
              <option value="semi">Cơ giới hóa / Bán tự động</option>
              <option value="auto">Tự động hóa hoàn toàn / AI (4.0)</option>
            </select>
          </div>

          {/* Skill target */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider font-mono">3. Mục tiêu năng lực kỹ năng:</label>
            <select
              value={skillTarget}
              onChange={e => {
                setSkillTarget(e.target.value);
                setAiReflection("");
              }}
              className="w-full bg-neutral-900/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              <option value="basic">Kỹ năng thực thi cơ bản</option>
              <option value="specialist">Chuyên gia thiết kế lõi</option>
              <option value="manager">Điều phối hội nhập toàn cầu</option>
            </select>
          </div>

          {/* Integration level */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-white/50 uppercase tracking-wider font-mono">4. Mức độ hội nhập quốc tế:</label>
            <select
              value={integrationLevel}
              onChange={e => {
                setIntegrationLevel(e.target.value);
                setAiReflection("");
              }}
              className="w-full bg-neutral-900/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              <option value="domestic">Thị trường nội địa</option>
              <option value="regional">Hợp tác khu vực ASEAN</option>
              <option value="global">Chuỗi giá trị toàn cầu (GVC / FTA)</option>
            </select>
          </div>

          {/* Reflection Generator trigger */}
          <div className="pt-2">
            <button
              type="button"
              disabled={isAiLoading || (isCustom && !customCareer.trim())}
              onClick={handleGenerateReflection}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition-all flex items-center justify-center gap-1.5 border-none disabled:opacity-40 disabled:bg-white/40 cursor-pointer"
            >
              {isAiLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-black" />
              ) : (
                <>
                  <Bot className="w-4 h-4 text-black" /> Nhận Phản Ánh Từ AI
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Outputs Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="liquid-glass border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
            
            {/* Header info */}
            <div className="border-b border-white/5 pb-4">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider font-mono">Bản đồ phân tích cơ hội nghề</span>
              <h4 className="text-lg font-bold text-white mt-1">{activePreset.title}</h4>
            </div>

            {/* Analysis details */}
            <div className="space-y-4">
              {/* Link to Industrialization */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider font-mono block">Liên kết Công nghiệp hóa, Hiện đại hóa:</span>
                <p className="text-xs md:text-sm text-white/90 leading-relaxed font-light">
                  {activePreset.modernizationLink}
                </p>
              </div>

              {/* Skills to learn */}
              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-1">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider font-mono block">Kiến thức / Kỹ năng cần tập trung học tập:</span>
                <p className="text-xs text-white/80 leading-relaxed font-light">
                  {activePreset.skillsNeeded}
                </p>
              </div>

              {/* Opportunities vs Risks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono block">Cơ hội hội nhập quốc tế (+):</span>
                  <p className="text-xs text-white/70 leading-relaxed font-light">
                    {activePreset.opportunities}
                  </p>
                </div>
                <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-4 space-y-1">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider font-mono block">Nguy cơ tụt hậu / Đào thải (-):</span>
                  <p className="text-xs text-white/70 leading-relaxed font-light">
                    {activePreset.risks}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Reflection draft output */}
            {aiReflection && (
              <div className="bg-emerald-500/5 border border-emerald-500/10 text-emerald-300 p-5 rounded-2xl space-y-2 animate-fade-rise">
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider font-mono block">Bản Phản Ánh Học Tập Đề Xuất (AI gợi ý):</span>
                <p className="text-xs leading-relaxed font-light whitespace-pre-line">
                  {aiReflection}
                </p>
                <span className="text-[9px] text-white/30 block font-mono">
                  *Bản viết trên chỉ là gợi ý tham khảo phục vụ quá trình tự học tập tư duy phản biện của học viên.
                </span>
              </div>
            )}

            {/* Mini quiz / reflection */}
            <div className="border-t border-white/5 pt-6 space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-white/40" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider font-mono">Đánh giá nhanh</span>
              </div>
              <h5 className="text-xs md:text-sm font-bold text-white leading-relaxed">
                Tại sao nâng cấp chất lượng sức lao động lại là chìa khóa để giành lợi thế trong hội nhập kinh tế quốc tế?
              </h5>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setReflectionAnswered(true)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${reflectionAnswered === true ? "bg-white border-white text-black" : "bg-neutral-900/40 border-white/5 text-white/70 hover:bg-white/5"}`}
                >
                  Nâng cao giá trị sức lao động
                </button>
                <button
                  type="button"
                  onClick={() => setReflectionAnswered(false)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${reflectionAnswered === false ? "bg-white border-white text-black" : "bg-neutral-900/40 border-white/5 text-white/70 hover:bg-white/5"}`}
                >
                  Tăng số giờ làm việc
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
                    Hội nhập quốc tế thực chất là cuộc cạnh tranh công bằng về năng suất lao động. Khi người lao động nâng cao kỹ năng và công nghệ (năng lượng chất lượng cao), họ tạo ra lượng giá trị thặng dư tương đối nhiều hơn trong thời gian ngắn hơn, giúp sản phẩm quốc gia có sức cạnh tranh cao về chất lượng lẫn giá thành trên trường quốc tế.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Inline Thay Nam AI Panel */}
          {reflectionAnswered !== null && (
            <InlineThayNamAI
              chapterId={6}
              mode="chapter_tool_explain"
              currentStateSummary={getAiContextSummary()}
              curriculumContext={getCurriculumContext()}
              placeholderText="Hỏi Thầy Nam AI thêm về tác động của Cách mạng công nghiệp 4.0 hay chuỗi cung ứng toàn cầu..."
            />
          )}

        </div>
      </div>
    </div>
  );
}
