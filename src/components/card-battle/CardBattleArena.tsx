import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
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

          {/* Realtime chart section */}
          <div className="bg-neutral-900/30 border border-white/5 rounded-2xl p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-neutral-300">Đồ thị tích lũy Lượng (Biến động Biện chứng)</span>
              <span className="text-xs text-neutral-500 font-light">Cập nhật realtime khi ra bài</span>
            </div>
            <div className="w-full h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis dataKey="step" stroke="#737373" fontSize={10} tickLine={false} />
                  <YAxis stroke="#737373" fontSize={10} tickLine={false} domain={[0, "auto"]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#171717", borderColor: "#404040", borderRadius: "12px" }}
                    labelStyle={{ fontSize: "11px", fontWeight: "bold", color: "#a3a3a3" }}
                    itemStyle={{ fontSize: "11px", padding: 0 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="thesisQ"
                    name={activeDebate.side_a.split(" ")[0]}
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="antithesisQ"
                    name={activeDebate.side_b.split(" ")[0]}
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Battlefield Area */}
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
          />

          {/* Player Hand Area */}
          <div className="bg-neutral-950/40 border border-dashed border-white/10 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-neutral-300 mb-4 flex items-center gap-1.5 uppercase tracking-wider">
              🃏 Thẻ bài trên tay của bạn
              <span className="text-xs text-neutral-500 font-normal normal-case italic">
                (Nhấp để chọn hoặc kéo thả vào đúng cột đối lập bên trên)
              </span>
            </h3>

            <div className="flex flex-wrap gap-4 justify-center items-center">
              {playerHand.length === 0 ? (
                <div className="flex flex-col items-center py-6 text-center gap-2">
                  <HelpCircle className="w-8 h-8 text-neutral-600" />
                  <p className="text-sm text-neutral-500 italic">Đã ra hết bài. Nhấn reset để chơi lại.</p>
                  <button
                    onClick={resetGame}
                    className="mt-2 text-sm font-bold text-blue-400 hover:text-blue-300 underline"
                  >
                    Reset sàn đấu
                  </button>
                </div>
              ) : (
                playerHand.map((card) => (
                  <DialecticalCardItem
                    key={card.id}
                    card={card}
                    onDragStart={() => {}}
                    onClick={() => {
                      // Also support double click/click helper to deploy card
                      const target = card.category;
                      handleDropCard(card, target);
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
