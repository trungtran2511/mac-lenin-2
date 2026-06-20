import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { DialecticalCard } from "../../lib/cardBattleTypes";

interface DialecticalCardItemProps {
  card: DialecticalCard;
  isDraggable?: boolean;
  onDragStart?: (e: React.DragEvent, card: DialecticalCard) => void;
  onClick?: () => void;
  disabled?: boolean;
}

export const DialecticalCardItem: React.FC<DialecticalCardItemProps> = ({
  card,
  isDraggable = true,
  onDragStart,
  onClick,
  disabled
}) => {
  const IconComponent = (Icons as any)[card.icon] || Icons.HelpCircle;

  const handleDragStart = (e: React.DragEvent) => {
    if (disabled || !onDragStart) return;
    e.dataTransfer.setData("text/plain", JSON.stringify(card));
    onDragStart(e, card);
  };

  return (
    <motion.div
      layout
      whileHover={{ scale: disabled ? 1 : 1.05, y: disabled ? 0 : -5 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      draggable={isDraggable && !disabled}
      onDragStart={handleDragStart}
      onClick={onClick}
      className={`relative w-36 h-48 md:w-40 md:h-52 rounded-2xl border border-white/10 bg-gradient-to-br ${card.color} p-4 flex flex-col justify-between shadow-xl cursor-grab active:cursor-grabbing hover:shadow-2xl hover:shadow-white/5 transition-shadow select-none group ${disabled ? "opacity-40 pointer-events-none" : ""}`}
    >
      {/* Glossy overlay */}
      <div className="absolute inset-0 rounded-2xl bg-white/[0.03] group-hover:bg-white/[0.08] transition-colors pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center z-10">
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm">
          {card.category === "thesis" ? "Đề xuất" : "Phản đề"}
        </span>
        <div className="flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
          <span className="text-[10px] font-mono text-white/70">Lượng:</span>
          <span className="text-xs font-mono font-bold text-white">{card.quantityValue}</span>
        </div>
      </div>

      {/* Center Body */}
      <div className="flex flex-col items-center justify-center my-auto text-center gap-2 z-10">
        <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm">
          <IconComponent className="w-6 h-6 md:w-7 md:h-7 text-white stroke-[1.8]" />
        </div>
        <h4 className="text-sm font-extrabold text-white leading-tight px-1">{card.name}</h4>
      </div>

      {/* Description Footer */}
      <div className="text-[11px] text-white/90 line-clamp-2 leading-snug text-center border-t border-white/10 pt-2 font-normal z-10">
        {card.description}
      </div>
    </motion.div>
  );
};
