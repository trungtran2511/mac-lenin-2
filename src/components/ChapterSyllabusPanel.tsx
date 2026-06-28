import React from "react";
import { type ChapterLessons } from "../lib/curriculum";

interface ChapterSyllabusPanelProps {
  activeChapterId: number;
  chapters: Array<{ id: number; title: string; summary: string }>;
  lessons: ChapterLessons[];
  selectedSectionIndex: number | null;
  setSelectedSectionIndex: (index: number | null) => void;
}

export const ChapterSyllabusPanel: React.FC<ChapterSyllabusPanelProps> = ({
  activeChapterId,
  chapters,
  lessons,
  selectedSectionIndex,
  setSelectedSectionIndex,
}) => {
  const activeCh = chapters.find(c => c.id === activeChapterId);
  if (!activeCh) return null;
  const activeLesson = lessons.find(l => l.chapterId === activeChapterId);

  return (
    <div className="space-y-5 flex flex-col">
      {/* Chapter header badge */}
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <span className="px-3 py-1.5 text-xs font-bold bg-white/10 text-white border border-white/15 rounded-lg uppercase font-mono">
          Mục lục chương {activeCh.id}
        </span>
      </div>

      <h3 className="text-3xl font-bold text-white tracking-tight leading-snug">{activeCh.title}</h3>

      {activeLesson ? (
        <div className="space-y-5 flex-1">
          <p className="text-base text-white/80 leading-relaxed font-normal">{activeLesson.intro}</p>
          {/* 2 columns, bigger cells */}
          <div className="grid grid-cols-2 gap-3.5">
            {activeLesson.keyPoints.map((point, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedSectionIndex(selectedSectionIndex === index ? null : index)}
                className={`p-4 md:p-5 rounded-xl border text-left transition-all flex flex-col gap-2 cursor-pointer min-h-[90px] justify-between ${
                  selectedSectionIndex === index
                    ? "bg-white border-white text-black font-semibold shadow-lg shadow-white/10"
                    : "bg-white/[0.02] border-white/10 text-white/80 hover:bg-white/[0.06] hover:border-white/20"
                }`}
              >
                <span
                  className={`text-xs font-bold uppercase tracking-wider font-mono ${
                    selectedSectionIndex === index ? "text-neutral-500" : "text-emerald-400"
                  }`}
                >
                  Mục 0{index + 1}
                </span>
                <h5 className="text-base font-bold leading-snug line-clamp-2">{point.heading}</h5>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-base text-white/80 leading-relaxed space-y-4 whitespace-pre-line font-normal flex-1">
          {activeCh.summary}
        </div>
      )}
    </div>
  );
};
