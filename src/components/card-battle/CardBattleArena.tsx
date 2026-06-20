import { useState, useEffect } from "react";
import { BookOpen, Sparkles, HelpCircle } from "lucide-react";
import { CARD_BATTLE_DEBATES } from "../../lib/cardBattleData";
import type { DialecticalCard, SynthesisCard } from "../../lib/cardBattleTypes";
import { DialecticalCardItem } from "./DialecticalCardItem";
import { BattlefieldPanel } from "./BattlefieldPanel";
import { LeapAnimation } from "./LeapAnimation";
import { SynthesisResult } from "./SynthesisResult";

export default function CardBattleArena() {
  const [selectedDebateId, setSelectedDebateId] = useState(CARD_BATTLE_DEBATES[0].id);
  const activeDebate = CARD_BATTLE_DEBATES.find((d) => d.id === selectedDebateId) || CARD_BATTLE_DEBATES[0];

  const [playerHand, setPlayerHand] = useState<DialecticalCard[]>([]);
  const [thesisField, setThesisField] = useState<DialecticalCard[]>([]);
  const [antithesisField, setAntithesisField] = useState<DialecticalCard[]>([]);
  const [thesisQuantity, setThesisQuantity] = useState(0);
  const [antithesisQuantity, setAntithesisQuantity] = useState(0);

  const [chartData, setChartData] = useState<{ step: string; thesisQ: number; antithesisQ: number }[]>([
    { step: "Bắt đầu", thesisQ: 0, antithesisQ: 0 }
  ]);

  const [showLeapAnimation, setShowLeapAnimation] = useState(false);
  const [showSynthesisResult, setShowSynthesisResult] = useState(false);
  const [achievedSynthesis, setAchievedSynthesis] = useState<SynthesisCard | null>(null);
  const [showRecipes, setShowRecipes] = useState(false);

  // Initialize game when active debate changes
  useEffect(() => {
    resetGame();
  }, [selectedDebateId]);

  const resetGame = () => {
    setPlayerHand([...activeDebate.thesisCards, ...activeDebate.antithesisCards]);
    setThesisField([]);
    setAntithesisField([]);
    setThesisQuantity(0);
    setAntithesisQuantity(0);
    setChartData([{ step: "Bắt đầu", thesisQ: 0, antithesisQ: 0 }]);
    setShowLeapAnimation(false);
    setShowSynthesisResult(false);
    setAchievedSynthesis(null);
    setShowRecipes(false);
  };

  const handleDropCard = (card: DialecticalCard, target: "thesis" | "antithesis") => {
    // Remove card from player hand
    setPlayerHand((prev) => prev.filter((c) => c.id !== card.id));

    let newThesisQ = thesisQuantity;
    let newAntithesisQ = antithesisQuantity;

    if (target === "thesis") {
      setThesisField((prev) => [...prev, card]);
      newThesisQ = thesisQuantity + card.quantityValue;
      setThesisQuantity(newThesisQ);
    } else {
      setAntithesisField((prev) => [...prev, card]);
      newAntithesisQ = antithesisQuantity + card.quantityValue;
      setAntithesisQuantity(newAntithesisQ);
    }

    // Append to chart history
    const stepName = `Tải ${thesisField.length + antithesisField.length + 1}`;
    setChartData((prev) => [
      ...prev,
      { step: stepName, thesisQ: newThesisQ, antithesisQ: newAntithesisQ }
    ]);

    // Check for Synthesis/Leap
    checkSynthesis(card, target, newThesisQ, newAntithesisQ);
  };

  const checkSynthesis = (
    playedCard: DialecticalCard,
    target: "thesis" | "antithesis",
    currentThesisQ: number,
    currentAntithesisQ: number
  ) => {
    // Find if any synthesis card is eligible
    const totalQ = currentThesisQ + currentAntithesisQ;

    // We search synthesis cards in current debate
    for (const synth of activeDebate.synthesisCards) {
      // Check if the threshold is met
      if (totalQ >= synth.leapThreshold) {
        // Verify if both required cards are present on the board
        const hasThesisReq =
          thesisField.some((c) => c.id === synth.requiredThesis) ||
          (playedCard.id === synth.requiredThesis && target === "thesis");

        const hasAntithesisReq =
          antithesisField.some((c) => c.id === synth.requiredAntithesis) ||
          (playedCard.id === synth.requiredAntithesis && target === "antithesis");

        if (hasThesisReq && hasAntithesisReq) {
          // Synthesis achieved!
          setAchievedSynthesis(synth);
          setShowLeapAnimation(true);
          return;
        }
      }
    }
  };

  const handleLeapComplete = () => {
    setShowLeapAnimation(false);
    setShowSynthesisResult(true);
  };

  const thesisHand = playerHand.filter((c) => c.category === "thesis");
  const antithesisHand = playerHand.filter((c) => c.category === "antithesis");

  return (
    <div className="w-full">
      {showLeapAnimation && <LeapAnimation onComplete={handleLeapComplete} />}

      {showSynthesisResult && achievedSynthesis ? (
        <SynthesisResult
          synthesisCard={achievedSynthesis}
          thesisName={activeDebate.thesisCards.find((c) => c.id === achievedSynthesis.requiredThesis)?.name || ""}
          antithesisName={activeDebate.antithesisCards.find((c) => c.id === achievedSynthesis.requiredAntithesis)?.name || ""}
          onReset={resetGame}
        />
      ) : (
        <div className="flex flex-col gap-6">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                Biện Chứng Kỳ Đài: Đấu Trường Thẻ Bài
              </h2>
              <p className="text-sm text-neutral-400 mt-1 font-light max-w-xl">
                Quy luật Lượng đổi dẫn đến Chất đổi. Kéo thả thẻ Đề xuất và Phản đề để tích lũy Lượng đến Điểm Nút nhằm kích hoạt Bước Nhảy tạo ra Chất mới.
              </p>
            </div>

            {/* Select Debate dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-neutral-400 whitespace-nowrap font-light">Chọn mâu thuẫn:</span>
              <select
                value={selectedDebateId}
                onChange={(e) => setSelectedDebateId(e.target.value)}
                className="w-full sm:w-56 bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-sm font-semibold text-white focus:outline-none focus:border-blue-500"
              >
                {CARD_BATTLE_DEBATES.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description banner */}
          <div className="bg-blue-950/20 border border-blue-500/15 rounded-2xl p-4 flex gap-3">
            <BookOpen className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-blue-300">Khái quát Mâu thuẫn</h4>
              <p className="text-xs md:text-sm text-neutral-400 mt-1 leading-relaxed font-light">
                {activeDebate.description}
              </p>
            </div>
          </div>


          {/* Collapsible Rules Box at the top */}
          <div className="bg-neutral-900/60 border border-white/5 rounded-2xl p-4 text-xs md:text-sm text-neutral-300 space-y-3">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-sm uppercase tracking-wide">
              <HelpCircle className="w-4 h-4 text-emerald-400 animate-pulse" />
              Hướng dẫn Luật chơi & cách "Nổ Hũ" (Tạo Hợp Đề):
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-neutral-400 text-xs">
              <li><strong className="text-white">Bước 1:</strong> Hạ các cặp thẻ đối lập (1 thẻ Đề xuất <span className="text-blue-400 font-semibold">Bên A</span> và 1 thẻ Phản đề <span className="text-orange-400 font-semibold">Bên B</span>) từ tay của từng phe xuống bàn đấu.</li>
              <li><strong className="text-white">Bước 2:</strong> Tích lũy đủ điểm <strong>Lượng</strong> (chỉ số ghi trên thẻ) vượt qua <strong>Ngưỡng của Hợp đề</strong> (Ví dụ: Ngưỡng 4, 6 hoặc 8).</li>
              <li><strong className="text-white">Pro Tip:</strong> Thả thật nhiều thẻ phụ để tích lũy lượng vượt ngưỡng trước, sau đó thả cặp thẻ chính của công thức vào là "nổ hũ" Chất mới ngay lập tức!</li>
            </ul>
            
            <div className="pt-2 border-t border-white/5">
              <button
                type="button"
                onClick={() => setShowRecipes(!showRecipes)}
                className="flex items-center gap-1 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-amber-400 border border-amber-500/10 cursor-pointer transition-all"
              >
                {showRecipes ? "🙈 Ẩn bớt công thức" : "📖 Xem các Công thức Hợp Đề (Nổ Hũ) của Mâu thuẫn này"}
              </button>
              {showRecipes && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3 animate-fade-in text-[11px] md:text-xs">
                  {activeDebate.synthesisCards.map((recipe) => {
                    const thesisName = activeDebate.thesisCards.find(c => c.id === recipe.requiredThesis)?.name || "";
                    const antithesisName = activeDebate.antithesisCards.find(c => c.id === recipe.requiredAntithesis)?.name || "";
                    return (
                      <div key={recipe.id} className="p-2.5 rounded-xl bg-neutral-950/40 border border-white/5 flex flex-col gap-1">
                        <span className="font-bold text-amber-400">✨ {recipe.name}</span>
                        <span className="text-neutral-400 font-light">
                          Công thức: <strong className="text-blue-400">"{thesisName}"</strong> + <strong className="text-orange-400">"{antithesisName}"</strong>
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">Yêu cầu Ngưỡng Lượng tích lũy: {recipe.leapThreshold}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Battlefield Area with hand integrated */}
          <BattlefieldPanel
            thesisCards={thesisField}
            antithesisCards={antithesisField}
            thesisQuantity={thesisQuantity}
            antithesisQuantity={antithesisQuantity}
            threshold={
              activeDebate.synthesisCards.length > 0
                ? Math.min(...activeDebate.synthesisCards.map((c) => c.leapThreshold))
                : 6
            }
            sideAName={activeDebate.side_a}
            sideBName={activeDebate.side_b}
            onDropCard={handleDropCard}
            thesisHand={thesisHand}
            antithesisHand={antithesisHand}
            onPlayCard={handleDropCard}
            onReset={resetGame}
          />

          {/* Dynamic Dialectical Hints */}
          {(thesisField.length > 0 || antithesisField.length > 0) && (
            <div className="bg-neutral-900/85 border border-white/10 rounded-3xl p-6 text-xs md:text-sm text-neutral-300 space-y-4 animate-fade-in backdrop-blur-md shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h4 className="font-extrabold text-amber-400 flex items-center gap-2 uppercase tracking-wider text-xs md:text-sm">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                  Gợi Ý Giải Quyết Mâu Thuẫn (Biện Chứng Kỳ Đài)
                </h4>
                <span className="text-[10px] text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded font-mono">
                  Phân tích realtime
                </span>
              </div>
              
              <p className="text-neutral-400 text-xs leading-relaxed font-light">
                Triết lý: <strong>"Sự phát triển là cuộc đấu tranh của các mặt đối lập"</strong>. Lượng đổi chỉ dẫn đến Chất đổi (Nổ hũ) khi bạn kết hợp đúng cặp thẻ tương khắc để giải quyết mâu thuẫn:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-2">
                {/* Thesis Suggestions */}
                {thesisField.map((card) => {
                  const matches = activeDebate.synthesisCards.filter((s) => s.requiredThesis === card.id);
                  return matches.map((recipe) => {
                    const oppositeCard = activeDebate.antithesisCards.find((c) => c.id === recipe.requiredAntithesis);
                    const isOppositeOnField = antithesisField.some((c) => c.id === recipe.requiredAntithesis);
                    return (
                      <div
                        key={recipe.id}
                        className={`p-3 rounded-2xl border flex flex-col justify-between gap-3 transition-all duration-300 ${
                          isOppositeOnField
                            ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                            : "bg-neutral-950 border-white/5 text-neutral-300 shadow-inner"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 font-mono">
                              Cặp đôi mâu thuẫn
                            </div>
                            <div className="text-xs md:text-sm">
                              <span className="font-bold text-blue-400">"{card.name}"</span>
                              <span className="mx-1 text-neutral-400">↔</span>
                              <span className={`font-bold ${isOppositeOnField ? "text-emerald-400" : "text-amber-400 underline decoration-dashed underline-offset-4"}`}>
                                "{oppositeCard?.name}"
                              </span>
                            </div>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold shrink-0 ${isOppositeOnField ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/10 text-amber-400"}`}>
                            Ngưỡng: {recipe.leapThreshold}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs border-t border-white/5 pt-2">
                          {isOppositeOnField ? (
                            <>
                              <span className="text-emerald-400 text-sm">✅</span>
                              <span className="text-neutral-400">Đã khớp! Đang tích lũy Lượng để kích hoạt bước nhảy sang <strong>{recipe.name}</strong>.</span>
                            </>
                          ) : (
                            <>
                              <span className="text-red-400 text-sm">⚠️</span>
                              <span className="text-neutral-400">Hãy hạ thêm thẻ <strong className="text-amber-400">"{oppositeCard?.name}"</strong> từ tay để "nổ hũ" <strong>{recipe.name}</strong>!</span>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  });
                })}

                {/* Antithesis Suggestions */}
                {antithesisField.map((card) => {
                  const matches = activeDebate.synthesisCards.filter((s) => s.requiredAntithesis === card.id);
                  return matches.map((recipe) => {
                    const isThesisOnField = thesisField.some((c) => c.id === recipe.requiredThesis);
                    if (isThesisOnField) return null; // already handled by thesis loop
                    const oppositeCard = activeDebate.thesisCards.find((c) => c.id === recipe.requiredThesis);
                    return (
                      <div
                        key={recipe.id}
                        className="p-3 rounded-2xl border bg-neutral-950 border-white/5 text-neutral-300 shadow-inner flex flex-col justify-between gap-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 font-mono">
                              Cặp đôi mâu thuẫn
                            </div>
                            <div className="text-xs md:text-sm">
                              <span className="font-bold text-orange-400">"{card.name}"</span>
                              <span className="mx-1 text-neutral-400">↔</span>
                              <span className="font-bold text-blue-400 underline decoration-dashed underline-offset-4">
                                "{oppositeCard?.name}"
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-mono font-bold shrink-0">
                            Ngưỡng: {recipe.leapThreshold}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs border-t border-white/5 pt-2">
                          <span className="text-red-400 text-sm">⚠️</span>
                          <span className="text-neutral-400">Hãy hạ thêm thẻ <strong className="text-blue-400">"{oppositeCard?.name}"</strong> từ tay để "nổ hũ" <strong>{recipe.name}</strong>!</span>
                        </div>
                      </div>
                    );
                  });
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
