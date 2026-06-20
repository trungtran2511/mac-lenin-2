import React, { useState } from "react";
import type { DialecticalCard } from "../../lib/cardBattleTypes";
import { DialecticalCardItem } from "./DialecticalCardItem";

interface BattlefieldPanelProps {
  thesisCards: DialecticalCard[];
  antithesisCards: DialecticalCard[];
  thesisQuantity: number;
  antithesisQuantity: number;
  threshold: number;
  sideAName: string;
  sideBName: string;
  onDropCard: (card: DialecticalCard, target: "thesis" | "antithesis") => void;
}

export const BattlefieldPanel: React.FC<BattlefieldPanelProps> = ({
  thesisCards,
  antithesisCards,
  thesisQuantity,
  antithesisQuantity,
  threshold,
  sideAName,
  sideBName,
  onDropCard
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full my-6">
      {/* Thesis Column (Đề xuất) */}
      <div
        onDragOver={(e) => handleDragOver(e, "thesis")}
        onDragLeave={() => handleDragLeave("thesis")}
        onDrop={(e) => handleDrop(e, "thesis")}
        className={`rounded-2xl border p-5 transition-all duration-300 flex flex-col justify-between min-h-[300px] ${
          isOverThesis
            ? "border-blue-500 bg-blue-950/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
            : "border-white/10 bg-neutral-900/40"
        }`}
      >
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-extrabold text-blue-400 flex items-center gap-1.5 uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              Mặt Đối Lập A: {sideAName}
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mb-4 font-light">Thả thẻ Đề xuất để tích lũy Lượng.</p>
        </div>

        {/* Dropped Cards Area */}
        <div className="flex flex-wrap gap-3 my-4 justify-center items-center flex-grow min-h-[140px] border border-dashed border-white/5 rounded-xl p-3 bg-neutral-950/20">
          {thesisCards.length === 0 ? (
            <span className="text-xs text-neutral-500 italic select-none">Kéo thả thẻ bài Đề xuất vào đây</span>
          ) : (
            thesisCards.map((card) => (
              <DialecticalCardItem key={card.id} card={card} isDraggable={false} />
            ))
          )}
        </div>

        {/* Quantity Progress Bar */}
        <div className="mt-2 pt-3 border-t border-white/5">
          <div className="flex justify-between text-xs md:text-sm font-mono text-neutral-400 mb-1.5">
            <span>Tích lũy Lượng:</span>
            <span className="font-bold text-white">
              {thesisQuantity} / <span className="text-amber-400 font-black">{threshold} (Điểm Nút)</span>
            </span>
          </div>
          <div className="w-full h-3 bg-neutral-950 rounded-full overflow-hidden border border-white/10 relative">
            {/* Threshold line marker */}
            <div className="absolute top-0 bottom-0 w-[2px] bg-amber-400 z-10 left-[100%]" style={{ left: "100%" }} />
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (thesisQuantity / threshold) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Antithesis Column (Phản đề) */}
      <div
        onDragOver={(e) => handleDragOver(e, "antithesis")}
        onDragLeave={() => handleDragLeave("antithesis")}
        onDrop={(e) => handleDrop(e, "antithesis")}
        className={`rounded-2xl border p-5 transition-all duration-300 flex flex-col justify-between min-h-[300px] ${
          isOverAntithesis
            ? "border-red-500 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
            : "border-white/10 bg-neutral-900/40"
        }`}
      >
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-extrabold text-red-400 flex items-center gap-1.5 uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              Mặt Đối Lập B: {sideBName}
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mb-4 font-light">Thả thẻ Phản đề để tích lũy Lượng.</p>
        </div>

        {/* Dropped Cards Area */}
        <div className="flex flex-wrap gap-3 my-4 justify-center items-center flex-grow min-h-[140px] border border-dashed border-white/5 rounded-xl p-3 bg-neutral-950/20">
          {antithesisCards.length === 0 ? (
            <span className="text-xs text-neutral-500 italic select-none">Kéo thả thẻ bài Phản đề vào đây</span>
          ) : (
            antithesisCards.map((card) => (
              <DialecticalCardItem key={card.id} card={card} isDraggable={false} />
            ))
          )}
        </div>

        {/* Quantity Progress Bar */}
        <div className="mt-2 pt-3 border-t border-white/5">
          <div className="flex justify-between text-xs md:text-sm font-mono text-neutral-400 mb-1.5">
            <span>Tích lũy Lượng:</span>
            <span className="font-bold text-white">
              {antithesisQuantity} / <span className="text-amber-400 font-black">{threshold} (Điểm Nút)</span>
            </span>
          </div>
          <div className="w-full h-3 bg-neutral-950 rounded-full overflow-hidden border border-white/10 relative">
            <div className="absolute top-0 bottom-0 w-[2px] bg-amber-400 z-10 left-[100%]" style={{ left: "100%" }} />
            <div
              className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (antithesisQuantity / threshold) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
