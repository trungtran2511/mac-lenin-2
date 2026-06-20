import React, { useState } from "react";
import type { DialecticalCard } from "../../lib/cardBattleTypes";
import { DialecticalCardItem } from "./DialecticalCardItem";
import { RotateCcw } from "lucide-react";

interface BattlefieldPanelProps {
  thesisCards: DialecticalCard[];
  antithesisCards: DialecticalCard[];
  thesisQuantity: number;
  antithesisQuantity: number;
  threshold: number;
  sideAName: string;
  sideBName: string;
  onDropCard: (card: DialecticalCard, target: "thesis" | "antithesis") => void;
  thesisHand: DialecticalCard[];
  antithesisHand: DialecticalCard[];
  onPlayCard: (card: DialecticalCard, target: "thesis" | "antithesis") => void;
  onReset: () => void;
}

export const BattlefieldPanel: React.FC<BattlefieldPanelProps> = ({
  thesisCards,
  antithesisCards,
  thesisQuantity,
  antithesisQuantity,
  threshold,
  sideAName,
  sideBName,
  onDropCard,
  thesisHand,
  antithesisHand,
  onPlayCard,
  onReset
}) => {
  const [isOverThesis, setIsOverThesis] = useState(false);
  const [isOverAntithesis, setIsOverAntithesis] = useState(false);

  const handleDragOver = (e: React.DragEvent, target: "thesis" | "antithesis") => {
    e.preventDefault();
    if (target === "thesis") {
      setIsOverThesis(true);
    } else {
      setIsOverAntithesis(true);
    }
  };

  const handleDragLeave = (target: "thesis" | "antithesis") => {
    if (target === "thesis") {
      setIsOverThesis(false);
    } else {
      setIsOverAntithesis(false);
    }
  };

  const handleDrop = (e: React.DragEvent, target: "thesis" | "antithesis") => {
    e.preventDefault();
    setIsOverThesis(false);
    setIsOverAntithesis(false);

    try {
      const cardData = e.dataTransfer.getData("text/plain");
      if (!cardData) return;
      const card = JSON.parse(cardData) as DialecticalCard;

      // Rule: Can only place cards in their matching category to maintain dialectical opposition
      if (card.category !== target) {
        alert(`Thẻ bài "${card.name}" thuộc phe ${card.category === "thesis" ? "Đề xuất" : "Phản đề"}, không thể đặt sang cột đối lập!`);
        return;
      }

      onDropCard(card, target);
    } catch (err) {
      console.error("Lỗi khi drop card:", err);
    }
  };

  const isHandEmpty = thesisHand.length === 0 && antithesisHand.length === 0;

  return (
    <div className="flex flex-col gap-6 w-full my-4">
      {isHandEmpty && thesisCards.length === 0 && antithesisCards.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 bg-neutral-900/60 border border-white/10 rounded-3xl text-center gap-3">
          <RotateCcw className="w-10 h-10 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
          <h4 className="text-base font-bold text-white">Sàn đấu đã được dọn sạch!</h4>
          <p className="text-xs text-neutral-400 max-w-sm">Hãy nhấn nút bên dưới để chia lại bài và bắt đầu phiên biện chứng mới.</p>
          <button
            onClick={onReset}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-neutral-950 text-xs font-black rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
          >
            Chia lại bài mới
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Thesis Column (Đề xuất) */}
        <div
          onDragOver={(e) => handleDragOver(e, "thesis")}
          onDragLeave={() => handleDragLeave("thesis")}
          onDrop={(e) => handleDrop(e, "thesis")}
          className={`rounded-3xl border p-5 md:p-6 transition-all duration-300 flex flex-col justify-between gap-4 ${
            isOverThesis
              ? "border-blue-400 bg-blue-900/20 shadow-[0_0_30px_rgba(59,130,246,0.25)] scale-[1.01]"
              : "border-blue-500/25 bg-blue-950/5 shadow-[0_0_20px_rgba(59,130,246,0.02)]"
          }`}
        >
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm md:text-base font-black text-blue-300 flex items-center gap-2 uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_#60a5fa]" />
                Mặt Đối Lập A: {sideAName}
              </h3>
            </div>
            <p className="text-[11px] text-neutral-400 font-light">Thả thẻ hoặc click thẻ ở tay bên dưới để đưa vào bàn đấu.</p>
          </div>

          {/* Dropped Cards Area */}
          <div className="flex flex-wrap gap-2.5 justify-center items-center flex-grow min-h-[140px] border border-dashed border-blue-500/20 rounded-2xl p-3.5 bg-blue-950/30 transition-colors">
            {thesisCards.length === 0 ? (
              <span className="text-[11px] text-blue-300/40 font-semibold italic select-none">Bàn đấu trống</span>
            ) : (
              thesisCards.map((card) => (
                <div key={card.id} className="scale-90 origin-center">
                  <DialecticalCardItem card={card} isDraggable={false} />
                </div>
              ))
            )}
          </div>

          {/* Quantity Progress Bar */}
          <div className="pt-2 border-t border-blue-500/10">
            <div className="flex justify-between text-[11px] md:text-xs font-mono text-neutral-400 mb-1">
              <span>Tích lũy Lượng:</span>
              <span className="font-bold text-white">
                {thesisQuantity} / <span className="text-amber-400 font-black">{threshold} (Điểm Nút)</span>
              </span>
            </div>
            <div className="w-full h-3 bg-neutral-950 rounded-full overflow-hidden border border-white/5 relative">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                style={{ width: `${Math.min(100, (thesisQuantity / threshold) * 100)}%` }}
              />
            </div>
          </div>

          {/* Hand Cards Area (Deck) */}
          <div className="mt-2 pt-4 border-t border-blue-500/10">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] font-extrabold text-blue-400 uppercase tracking-wider">Bài trên tay của Bên A ({thesisHand.length})</span>
              <span className="text-[10px] text-neutral-500 italic">Nhấp để hạ</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-start content-start min-h-[110px] max-h-[220px] overflow-y-auto pr-1">
              {thesisHand.length === 0 ? (
                <p className="text-[11px] text-neutral-500 italic m-auto py-4">Đã hết thẻ bài Đề xuất</p>
              ) : (
                thesisHand.map((card) => (
                  <div key={card.id} className="scale-[0.82] origin-top-left -mr-6 -mb-8">
                    <DialecticalCardItem
                      card={card}
                      onDragStart={() => {}}
                      onClick={() => onPlayCard(card, "thesis")}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Antithesis Column (Phản đề) */}
        <div
          onDragOver={(e) => handleDragOver(e, "antithesis")}
          onDragLeave={() => handleDragLeave("antithesis")}
          onDrop={(e) => handleDrop(e, "antithesis")}
          className={`rounded-3xl border p-5 md:p-6 transition-all duration-300 flex flex-col justify-between gap-4 ${
            isOverAntithesis
              ? "border-red-400 bg-red-900/20 shadow-[0_0_30px_rgba(239,68,68,0.25)] scale-[1.01]"
              : "border-red-500/25 bg-red-950/5 shadow-[0_0_20px_rgba(239,68,68,0.02)]"
          }`}
        >
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm md:text-base font-black text-red-300 flex items-center gap-2 uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse shadow-[0_0_8px_#f87171]" />
                Mặt Đối Lập B: {sideBName}
              </h3>
            </div>
            <p className="text-[11px] text-neutral-400 font-light">Thả thẻ hoặc click thẻ ở tay bên dưới để đưa vào bàn đấu.</p>
          </div>

          {/* Dropped Cards Area */}
          <div className="flex flex-wrap gap-2.5 justify-center items-center flex-grow min-h-[140px] border border-dashed border-red-500/20 rounded-2xl p-3.5 bg-red-950/30 transition-colors">
            {antithesisCards.length === 0 ? (
              <span className="text-[11px] text-red-300/40 font-semibold italic select-none">Bàn đấu trống</span>
            ) : (
              antithesisCards.map((card) => (
                <div key={card.id} className="scale-90 origin-center">
                  <DialecticalCardItem card={card} isDraggable={false} />
                </div>
              ))
            )}
          </div>

          {/* Quantity Progress Bar */}
          <div className="pt-2 border-t border-red-500/10">
            <div className="flex justify-between text-[11px] md:text-xs font-mono text-neutral-400 mb-1">
              <span>Tích lũy Lượng:</span>
              <span className="font-bold text-white">
                {antithesisQuantity} / <span className="text-amber-400 font-black">{threshold} (Điểm Nút)</span>
              </span>
            </div>
            <div className="w-full h-3 bg-neutral-950 rounded-full overflow-hidden border border-white/5 relative">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                style={{ width: `${Math.min(100, (antithesisQuantity / threshold) * 100)}%` }}
              />
            </div>
          </div>

          {/* Hand Cards Area (Deck) */}
          <div className="mt-2 pt-4 border-t border-red-500/10">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] font-extrabold text-red-400 uppercase tracking-wider">Bài trên tay của Bên B ({antithesisHand.length})</span>
              <span className="text-[10px] text-neutral-500 italic">Nhấp để hạ</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-start content-start min-h-[110px] max-h-[220px] overflow-y-auto pr-1">
              {antithesisHand.length === 0 ? (
                <p className="text-[11px] text-neutral-500 italic m-auto py-4">Đã hết thẻ bài Phản đề</p>
              ) : (
                antithesisHand.map((card) => (
                  <div key={card.id} className="scale-[0.82] origin-top-left -mr-6 -mb-8">
                    <DialecticalCardItem
                      card={card}
                      onDragStart={() => {}}
                      onClick={() => onPlayCard(card, "antithesis")}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
