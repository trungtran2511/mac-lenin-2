import { useState, useEffect } from "react";
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
          <div className="bg-neutral-950/40 border border-white/10 rounded-3xl p-6 space-y-6">
            {/* Luật chơi giải thích ngắn gọn */}
            <div className="bg-neutral-900/60 border border-white/5 rounded-2xl p-4 text-xs md:text-sm text-neutral-300 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-1.5 text-sm uppercase tracking-wide">
                <HelpCircle className="w-4 h-4 text-emerald-400 animate-pulse" />
                Hướng dẫn Luật chơi & cách "Nổ Hũ" (Tạo Hợp Đề):
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-neutral-400 text-xs">
                <li><strong className="text-white">Bước 1:</strong> Bạn cần thả các cặp thẻ bài đối lập (1 thẻ Đề xuất <span className="text-blue-400 font-semibold">màu xanh/tím</span> bên trái và 1 thẻ Phản đề <span className="text-orange-400 font-semibold">màu cam/đỏ</span> bên phải) lên bàn đấu.</li>
                <li><strong className="text-white">Bước 2:</strong> Đồng thời tích lũy đủ điểm <strong>Lượng</strong> (chỉ số ghi trên thẻ) trên đồ thị vượt qua <strong>Ngưỡng của Hợp đề</strong> (Ví dụ: Ngưỡng 4, 6 hoặc 8).</li>
                <li><strong className="text-white">Pro Tip:</strong> Thả thật nhiều thẻ phụ để tích lũy lượng vượt ngưỡng trước, sau đó thả cặp thẻ chính của công thức vào là "nổ hũ" Chất mới ngay lập tức!</li>
              </ul>
            </div>

            <h3 className="text-sm font-bold text-neutral-300 flex items-center gap-1.5 uppercase tracking-wider">
              🃏 Thẻ bài trên tay của bạn
              <span className="text-xs text-neutral-500 font-normal normal-case italic">
                (Nhấp để tự động hạ bài vào đúng cột bên dưới)
              </span>
            </h3>

            {playerHand.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-center gap-2">
                <HelpCircle className="w-8 h-8 text-neutral-600" />
                <p className="text-sm text-neutral-500 italic">Đã ra hết bài. Nhấn reset để chơi lại.</p>
                <button
                  onClick={resetGame}
                  className="mt-2 px-4 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-neutral-200 transition-all cursor-pointer"
                >
                  Reset sàn đấu
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-6">
                {/* Cột trái: Đề xuất */}
                <div className="space-y-4 bg-blue-950/5 border border-blue-500/10 p-4 rounded-2xl">
                  <div className="flex justify-between items-center border-b border-blue-500/15 pb-2">
                    <span className="text-xs font-bold text-blue-400 font-mono uppercase tracking-wider">
                      Bên A: {activeDebate.side_a}
                    </span>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-mono">
                      {thesisHand.length} thẻ
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-start content-start min-h-[120px]">
                    {thesisHand.length === 0 ? (
                      <p className="text-xs text-neutral-500 italic m-auto">Đã hết thẻ Đề xuất</p>
                    ) : (
                      thesisHand.map((card) => (
                        <DialecticalCardItem
                          key={card.id}
                          card={card}
                          onDragStart={() => {}}
                          onClick={() => handleDropCard(card, "thesis")}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* Cột phải: Phản đề */}
                <div className="space-y-4 bg-orange-950/5 border border-orange-500/10 p-4 rounded-2xl">
                  <div className="flex justify-between items-center border-b border-orange-500/15 pb-2">
                    <span className="text-xs font-bold text-orange-400 font-mono uppercase tracking-wider">
                      Bên B: {activeDebate.side_b}
                    </span>
                    <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded font-mono">
                      {antithesisHand.length} thẻ
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-start content-start min-h-[120px]">
                    {antithesisHand.length === 0 ? (
                      <p className="text-xs text-neutral-500 italic m-auto">Đã hết thẻ Phản đề</p>
                    ) : (
                      antithesisHand.map((card) => (
                        <DialecticalCardItem
                          key={card.id}
                          card={card}
                          onDragStart={() => {}}
                          onClick={() => handleDropCard(card, "antithesis")}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
