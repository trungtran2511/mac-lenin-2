import { ArrowLeft, ArrowRight } from "lucide-react";

export interface ReadingSection {
  heading: string;
  text: string;
  source?: string;
  details?: string[];
}

interface CurriculumReadingPanelProps {
  label: string;
  readingSections: ReadingSection[];
  onSelectSection: (index: number) => void;
}

interface CurriculumReadingDetailProps {
  chapterLabel: string;
  section: ReadingSection;
  onClose: () => void;
  onPractice: () => void;
}

export function CurriculumReadingPanel({
  label,
  readingSections,
  onSelectSection
}: CurriculumReadingPanelProps) {
  return (
    <section className="rounded-[24px] border border-white/10 bg-neutral-950/85 p-4 shadow-2xl shadow-black/20 md:p-6">
      <div className="grid gap-4 border-b border-white/10 pb-5 lg:grid-cols-[1fr_220px] lg:items-end">
        <div>
          <div className="text-xs uppercase tracking-wider text-white/45 font-mono">Tổng quan chương</div>
          <h4 className="mt-2 max-w-4xl text-xl font-bold leading-snug text-white md:text-2xl">{label}</h4>
        </div>
        <p className="text-base leading-relaxed text-white/60 lg:text-right">
          Chọn một mục để mở nội dung chi tiết ở bên dưới.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        <div className="text-xs uppercase tracking-wider text-white/45 font-mono">6 mục chính</div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {readingSections.map((section, index) => (
            <button
              type="button"
              key={`${label}-reading-${index}`}
              onClick={() => onSelectSection(index)}
              className="group min-h-[176px] rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-left transition-colors hover:border-emerald-300/35 hover:bg-white/[0.065]"
            >
              <h5 className="text-base font-semibold leading-snug text-white md:text-lg">{section.heading}</h5>
              <p className="mt-3 line-clamp-4 text-base leading-relaxed text-white/70">{section.text}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-300">
                Đọc chi tiết <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CurriculumReadingDetail({
  chapterLabel,
  section,
  onClose,
  onPractice
}: CurriculumReadingDetailProps) {
  const paragraphs = section.details?.length ? section.details : [section.text];

  return (
    <section className="relative left-1/2 w-[calc(100vw-24px)] -translate-x-1/2 rounded-[24px] border border-white/10 bg-neutral-950/92 p-4 shadow-2xl shadow-black/25 md:w-[calc(100vw-56px)] md:p-7 xl:w-[calc(100vw-96px)]">
      <div className="grid gap-4 border-b border-white/10 pb-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="text-xs uppercase tracking-wider text-white/45 font-mono">Nội dung chi tiết</div>
          <h4 className="mt-2 text-xl font-bold text-white md:text-2xl">{section.heading}</h4>
          <p className="mt-2 text-base text-white/60">{chapterLabel}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/72 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Tổng quan
          </button>
          <button
            type="button"
            onClick={onPractice}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-black transition-colors hover:bg-neutral-200"
          >
            Luyện câu hỏi <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <article className="mx-auto max-w-7xl py-6">
        {section.source && (
          <div className="text-xs uppercase tracking-wider text-white/45 font-mono">{section.source}</div>
        )}
        <p className="mt-4 text-lg leading-relaxed text-white/85 md:text-xl">{section.text}</p>

        <div className="mt-6 grid gap-4 border-t border-white/10 pt-6 lg:grid-cols-2">
          {paragraphs.map((paragraph, index) => (
            <p
              key={`${section.heading}-${index}`}
              className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-base leading-relaxed text-white/80 md:p-5 md:text-lg"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </section>
  );
}
