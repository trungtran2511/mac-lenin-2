import { useEffect, useState } from "react";
import { AlertCircle, AlertTriangle, ArrowRight, BookOpen, CheckCircle2, RotateCcw } from "lucide-react";
import { getQuizQuestions } from "../lib/quiz";
import type { QuizQuestion } from "../lib/chapterToolTypes";
import { InlineThayNamAI } from "./InlineThayNamAI";

interface FlexibleQuizBuilderProps {
  onBackToSyllabus?: () => void;
  initialChapterIds?: number[];
}

const CHAPTER_IDS = [1, 2, 3, 4, 5, 6];
const QUESTION_COUNTS = [5, 10, 20, 40];

export function FlexibleQuizBuilder({ onBackToSyllabus, initialChapterIds = [1] }: FlexibleQuizBuilderProps) {
  const [selectedChapters, setSelectedChapters] = useState<number[]>(initialChapterIds);
  const [questionCountMode, setQuestionCountMode] = useState<number | "custom">(10);
  const [customCountInput, setCustomCountInput] = useState("15");
  const [availableQuestionsCount, setAvailableQuestionsCount] = useState(0);

  const [isQuizActive, setIsQuizActive] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [score, setScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [isCappedNotice, setIsCappedNotice] = useState(false);
  const [answerKeyPassword, setAnswerKeyPassword] = useState("");
  const [isAnswerKeyUnlocked, setIsAnswerKeyUnlocked] = useState(false);
  const [isAnswerKeyDropdownOpen, setIsAnswerKeyDropdownOpen] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (!isQuizActive) {
      setSelectedChapters(initialChapterIds.length ? initialChapterIds : [1]);
    }
  }, [initialChapterIds, isQuizActive]);

  useEffect(() => {
    setIsAnswerKeyDropdownOpen(false);
    setPasswordError("");
  }, [currentIndex, isQuizActive]);

  useEffect(() => {
    let mounted = true;

    getQuizQuestions(selectedChapters, 1).then(({ totalAvailableCount }) => {
      if (mounted) setAvailableQuestionsCount(totalAvailableCount);
    });

    return () => {
      mounted = false;
    };
  }, [selectedChapters]);

  const handleToggleChapter = (chapterId: number) => {
    setSelectedChapters(prev => {
      if (prev.includes(chapterId)) {
        return prev.length === 1 ? prev : prev.filter(id => id !== chapterId);
      }

      return [...prev, chapterId].sort();
    });
  };

  const selectAllChapters = () => setSelectedChapters(CHAPTER_IDS);

  const getDesiredCount = () => {
    if (questionCountMode === "custom") {
      const parsed = Number.parseInt(customCountInput, 10);
      return Number.isNaN(parsed) || parsed <= 0 ? 5 : parsed;
    }

    return questionCountMode;
  };

  const handleStartQuiz = async () => {
    const { questions, isCapped } = await getQuizQuestions(selectedChapters, getDesiredCount());

    setQuizQuestions(questions);
    setIsCappedNotice(isCapped);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setScore(0);
    setIsQuizActive(true);
    setShowSummary(false);
  };

  const handleSelectOption = (optionId: "A" | "B" | "C" | "D") => {
    if (selectedOptionId !== null) return;

    setSelectedOptionId(optionId);

    const currentQ = quizQuestions[currentIndex];
    if (optionId === currentQ.correctOptionId) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionId(null);
      return;
    }

    setShowSummary(true);
  };

  const handleRestart = () => {
    setIsQuizActive(false);
    setShowSummary(false);
    setSelectedOptionId(null);
  };

  const getCurrentQuestionContext = () => {
    const currentQ = quizQuestions[currentIndex];
    if (!currentQ) return "";

    return JSON.stringify({
      chapterId: currentQ.chapterId,
      prompt: currentQ.prompt,
      options: currentQ.options,
      userAnswer: selectedOptionId,
      correctAnswer: currentQ.correctOptionId,
      explanation: currentQ.explanation,
      contextExcerpt: currentQ.contextExcerpt || ""
    }, null, 2);
  };

  if (!isQuizActive) {
    return (
      <section className="rounded-[24px] border border-white/10 bg-neutral-950/85 p-4 md:p-6">
        <div className="grid gap-4 border-b border-white/10 pb-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-white/45 font-mono">Ôn luyện tự chọn</div>
            <h3 className="mt-2 text-xl font-bold text-white md:text-2xl">Tạo bộ câu hỏi</h3>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-white/65">
            Có sẵn <strong className="text-white">{availableQuestionsCount}</strong> câu
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <label className="text-xs uppercase tracking-[0.16em] text-white/45 font-mono">Chọn chương</label>
              <button
                type="button"
                onClick={selectAllChapters}
                className="text-sm font-semibold text-emerald-300 hover:text-emerald-200"
              >
                Chọn tất cả
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CHAPTER_IDS.map(chapterId => {
                const isSelected = selectedChapters.includes(chapterId);

                return (
                  <button
                    key={chapterId}
                    type="button"
                    onClick={() => handleToggleChapter(chapterId)}
                    className={`rounded-xl border px-4 py-3 text-left text-base font-bold transition-colors ${
                      isSelected
                        ? "border-white bg-white text-black"
                        : "border-white/10 bg-white/[0.035] text-white/70 hover:bg-white/[0.07] hover:text-white"
                    }`}
                  >
                    Chương {chapterId}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs uppercase tracking-[0.16em] text-white/45 font-mono">Số câu</label>
            <div className="grid grid-cols-2 gap-2">
              {QUESTION_COUNTS.map(count => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCountMode(count)}
                  className={`rounded-xl border px-4 py-3 text-base font-bold transition-colors ${
                    questionCountMode === count
                      ? "border-white bg-white text-black"
                      : "border-white/10 bg-white/[0.035] text-white/70 hover:bg-white/[0.07]"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setQuestionCountMode("custom")}
                className={`rounded-xl border px-4 py-3 text-base font-bold transition-colors ${
                  questionCountMode === "custom"
                    ? "border-white bg-white text-black"
                    : "border-white/10 bg-white/[0.035] text-white/70 hover:bg-white/[0.07]"
                }`}
              >
                Tự nhập
              </button>
              <input
                type="number"
                min={1}
                value={customCountInput}
                onChange={event => {
                  setQuestionCountMode("custom");
                  setCustomCountInput(event.target.value);
                }}
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-neutral-950/70 px-4 py-3 text-base font-semibold text-white outline-none focus:border-white/25"
                placeholder="Số câu"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
          {onBackToSyllabus && (
            <button
              type="button"
              onClick={onBackToSyllabus}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-base font-bold text-white/75 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              Về tóm tắt
            </button>
          )}
          <button
            type="button"
            onClick={handleStartQuiz}
            disabled={availableQuestionsCount === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-base font-bold text-black transition-colors hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Bắt đầu <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    );
  }

  if (showSummary) {
    const percent = quizQuestions.length ? Math.round((score / quizQuestions.length) * 100) : 0;

    return (
      <section className="mx-auto max-w-2xl rounded-[24px] border border-white/10 bg-neutral-950/85 p-6 text-center md:p-8">
        <div className="text-[10px] uppercase tracking-[0.18em] text-white/45 font-mono">Kết quả</div>
        <h3 className="mt-2 text-2xl font-bold text-white">Bạn đúng {score}/{quizQuestions.length} câu</h3>
        <div className="mx-auto mt-5 flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-3xl font-black text-white">
          {percent}%
        </div>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-white/62">
          {percent >= 80
            ? "Nắm khá chắc. Có thể chuyển sang phần chi tiết giáo trình để đào sâu."
            : percent >= 50
              ? "Ổn nhưng còn hổng vài ý. Nên xem lại câu sai và hỏi Thầy Nam AI ở phần giải thích."
              : "Cần đọc lại tóm tắt chương trước khi làm tiếp bộ câu mới."}
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleRestart}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white/75 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            <RotateCcw className="h-4 w-4" /> Làm đề khác
          </button>
          <a
            href="/GIÁO TRÌNH FULL.pdf"
            download
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-black transition-colors hover:bg-neutral-200"
          >
            <BookOpen className="h-4 w-4" /> Tải giáo trình
          </a>
        </div>
      </section>
    );
  }

  const currentQ = quizQuestions[currentIndex];
  if (!currentQ) return null;

  const isAnswered = selectedOptionId !== null;
  const progressPercent = ((currentIndex + 1) / quizQuestions.length) * 100;

  return (
    <div className="space-y-5">
      {isCappedNotice && currentIndex === 0 && (
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-base leading-relaxed text-amber-100">
          <AlertTriangle className="mr-2 inline h-4 w-4 text-amber-300" />
          Số câu yêu cầu vượt dữ liệu hiện có, app tự giảm còn {quizQuestions.length} câu.
        </div>
      )}

      <section className="rounded-[24px] border border-white/10 bg-neutral-950/85 p-4 md:p-6">
        <div className="space-y-3 border-b border-white/10 pb-5">
          <div className="flex items-center justify-between gap-3 text-sm text-white/50 font-mono">
            <span>Câu {currentIndex + 1}/{quizQuestions.length}</span>
            <span>Đúng {score}</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-white transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <span className="rounded-md border border-white/15 bg-white/10 px-2.5 py-1 text-xs font-bold uppercase text-white/80">
              Chương {currentQ.chapterId}
            </span>
            <h4 className="mt-3 text-[20px] font-bold leading-[28px] text-white md:text-[20px]">{currentQ.prompt}</h4>
          </div>

          {/* Password-protected Answer Key Dropdown */}
          <div className="border border-white/10 rounded-xl bg-black/40 overflow-hidden">
            <button
              type="button"
              onClick={() => setIsAnswerKeyDropdownOpen(!isAnswerKeyDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                {isAnswerKeyUnlocked ? "🔓" : "🔒"} Xem nhanh đáp án đúng {isAnswerKeyDropdownOpen ? "(Đóng)" : "(Yêu cầu mật khẩu)"}
              </span>
              <span className="text-[10px] opacity-70">
                {isAnswerKeyDropdownOpen ? "▲" : "▼"}
              </span>
            </button>

            {isAnswerKeyDropdownOpen && (
              <div className="p-3 border-t border-white/5 bg-neutral-950/40 space-y-2">
                {!isAnswerKeyUnlocked ? (
                  <div className="flex flex-col sm:flex-row gap-2 items-center">
                    <input
                      type="password"
                      placeholder="Nhập mật khẩu để mở khóa..."
                      value={answerKeyPassword}
                      onChange={(e) => {
                        setAnswerKeyPassword(e.target.value);
                        setPasswordError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (answerKeyPassword === "abc123123.jj@A") {
                            setIsAnswerKeyUnlocked(true);
                            setPasswordError("");
                          } else {
                            setPasswordError("Mật khẩu không chính xác!");
                          }
                        }
                      }}
                      className="w-full sm:flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (answerKeyPassword === "abc123123.jj@A") {
                          setIsAnswerKeyUnlocked(true);
                          setPasswordError("");
                        } else {
                          setPasswordError("Mật khẩu không chính xác!");
                        }
                      }}
                      className="w-full sm:w-auto px-4 py-1 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-all cursor-pointer"
                    >
                      Xác nhận
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-emerald-300 font-mono leading-relaxed space-y-1">
                    <div className="font-bold text-emerald-400">
                      ✅ ĐÁP ÁN ĐÚNG: {currentQ.correctOptionId}. {currentQ.options.find(o => o.id === currentQ.correctOptionId)?.text}
                    </div>
                    <div className="text-white/60 font-sans mt-1">
                      <b>Luận giải:</b> {currentQ.explanation}
                    </div>
                  </div>
                )}
                {passwordError && (
                  <p className="text-[10px] text-rose-400 font-mono">{passwordError}</p>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {currentQ.options.map(option => {
              const isSelected = selectedOptionId === option.id;
              const isCorrect = option.id === currentQ.correctOptionId;
              const isWrong = isSelected && !isCorrect;
              let optionStyle = "border-white/10 bg-white/[0.035] text-white/80 hover:bg-white/[0.07]";

              if (isAnswered) {
                if (isCorrect) optionStyle = "border-emerald-400/35 bg-emerald-400/10 text-emerald-200";
                else if (isWrong) optionStyle = "border-rose-400/35 bg-rose-400/10 text-rose-200";
                else optionStyle = "border-white/8 bg-white/[0.02] text-white/35";
              }

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelectOption(option.id)}
                  disabled={isAnswered}
                  className={`min-h-[88px] rounded-xl border p-5 text-left text-[20px] font-medium leading-[28px] transition-colors ${optionStyle}`}
                >
                  <span className="mr-2 font-mono text-[20px] font-bold">{option.id}.</span>
                  <span className="leading-[28px]">{option.text}</span>
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 md:p-5">
              <div className="flex items-center gap-2 text-base font-bold">
                {selectedOptionId === currentQ.correctOptionId ? (
                  <span className="inline-flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" /> Đúng
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 text-rose-300">
                    <AlertCircle className="h-4 w-4" /> Sai, đáp án đúng là {currentQ.correctOptionId}
                  </span>
                )}
              </div>
              <p className="mt-3 text-lg leading-relaxed text-white/75">{currentQ.explanation}</p>
              {currentQ.contextExcerpt && (
                <details className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
                  <summary className="cursor-pointer text-base font-bold text-white/60">Ngữ cảnh giáo trình</summary>
                  <p className="mt-3 text-base leading-relaxed text-white/60">{currentQ.contextExcerpt}</p>
                </details>
              )}
            </div>
          )}

          {isAnswered && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-base font-bold text-black transition-colors hover:bg-neutral-200"
              >
                {currentIndex < quizQuestions.length - 1 ? "Câu tiếp" : "Xem kết quả"} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {isAnswered && (
        <InlineThayNamAI
          chapterId={currentQ.chapterId}
          mode="quiz_explain"
          currentStateSummary={getCurrentQuestionContext()}
          curriculumContext={currentQ.contextExcerpt || currentQ.explanation}
          placeholderText="Hỏi Thầy Nam AI về câu này..."
        />
      )}
    </div>
  );
}
