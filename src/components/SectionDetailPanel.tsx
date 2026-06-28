import React from "react";
import { ArrowRight, X, BookOpen } from "lucide-react";

interface SectionDetailPanelProps {
  activeChapterId: number;
  selectedSectionIndex: number | null;
  setSelectedSectionIndex: (index: number | null) => void;
  lessons: Array<{
    chapterId: number;
    intro: string;
    studyGuide: string[];
    keyPoints: Array<{
      heading: string;
      text: string;
      details?: string[];
    }>;
  }>;
  onPracticeQuiz: (chapterId: number) => void;
}

export const SectionDetailPanel: React.FC<SectionDetailPanelProps> = ({
  activeChapterId,
  selectedSectionIndex,
  setSelectedSectionIndex,
  lessons,
  onPracticeQuiz,
}) => {
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (selectedSectionIndex !== null && panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedSectionIndex, activeChapterId]);

  if (selectedSectionIndex === null) return null;
  const activeLesson = lessons.find(l => l.chapterId === activeChapterId);
  if (!activeLesson) return null;
  const point = activeLesson.keyPoints[selectedSectionIndex];
  if (!point) return null;

  return (
    <div
      ref={panelRef}
      className="mt-6 rounded-3xl border border-white/10 bg-neutral-900/60 liquid-glass animate-fade-rise w-full overflow-hidden"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between bg-white/[0.03] px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <BookOpen className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono block">
              Chương {activeChapterId} — Mục 0{selectedSectionIndex + 1}
            </span>
            <h4 className="text-base font-bold text-white leading-tight mt-0.5">
              {point.heading}
            </h4>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setSelectedSectionIndex(null)}
          className="p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all cursor-pointer bg-transparent border-none outline-none"
          title="Đóng"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content body */}
      <div className="p-6 space-y-5">
        {/* Summary text */}
        <p className="text-[21px] text-white/90 leading-relaxed italic border-l-2 border-emerald-500/30 pl-4">
          {point.text}
        </p>

        {/* Detailed content */}
        {point.details && point.details.length > 0 && (
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-white/30 font-mono">
              Nội dung chi tiết từ giáo trình
            </span>
            <div className="text-[21px] text-white/85 leading-relaxed space-y-3 font-normal select-text">
              {point.details.map((p, idx) => (
                <p key={idx} className="pl-4 border-l border-white/[0.06]">{p}</p>
              ))}
            </div>
          </div>
        )}

        {/* Footer action */}
        <div className="border-t border-white/5 pt-4 flex items-center justify-between">
          <span className="text-xs text-white/35 font-mono italic">
            *Nội dung biên soạn từ giáo trình chính thức.
          </span>
          <button
            onClick={() => onPracticeQuiz(activeChapterId)}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs transition-all flex items-center gap-2 cursor-pointer border-none"
          >
            Luyện trắc nghiệm <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
