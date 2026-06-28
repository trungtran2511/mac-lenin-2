import React from "react";
import { motion } from "framer-motion";
import type { GridCell } from "../../lib/simEconTypes";
import { SIM_ECON_SECTORS } from "../../lib/simEconData";
import {
  Flame,
  Zap,
  Landmark,
  Radio,
  Building2,
  Laptop,
  ShoppingCart,
  Sprout,
  Factory,
  Cpu,
  Ship,
  Car
} from "lucide-react";

interface CityGridProps {
  grid: GridCell[];
  onCellClick: (sectorId: string) => void;
}

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  "oil-corp": Flame,
  "power-grid": Zap,
  "state-bank": Landmark,
  "telecom-army": Radio,
  "vin-group": Building2,
  "fpt-corp": Laptop,
  "coop-mart": ShoppingCart,
  "farm-tech": Sprout,
  "samsung-vn": Factory,
  "intel-chip": Cpu,
  "logistics-dhl": Ship,
  "car-factory": Car
};

export const CityGrid: React.FC<CityGridProps> = ({ grid, onCellClick }) => {
  const getSectorColor = (sectorId: string | null): string => {
    if (!sectorId) return "bg-neutral-900 border-white/5";
    const sector = SIM_ECON_SECTORS.find((s) => s.id === sectorId);
    return sector ? sector.color : "bg-neutral-900";
  };

  return (
    <div className="w-full max-w-[480px] aspect-square mx-auto bg-neutral-950 p-2.5 rounded-2xl border border-white/10 shadow-2xl flex items-center justify-center">
      <div className="grid grid-cols-10 grid-rows-10 gap-1 w-full h-full">
        {grid.map((cell) => {
          const color = getSectorColor(cell.sectorId);
          const IconComponent = cell.building ? iconMap[cell.building.id] : null;

          return (
            <motion.button
              key={cell.index}
              layout
              onClick={() => cell.sectorId && onCellClick(cell.sectorId)}
              whileHover={{ scale: cell.building ? 1.08 : 1 }}
              whileTap={{ scale: cell.building ? 0.95 : 1 }}
              className={`relative rounded-md flex items-center justify-center transition-all ${
                cell.building
                  ? "cursor-pointer shadow-md shadow-black/40 border border-white/10 hover:z-10"
                  : "bg-neutral-900/50 border border-dashed border-white/5 pointer-events-none"
              }`}
              style={{
                backgroundColor: cell.building ? color : undefined
              }}
            >
              {cell.building ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className={`flex flex-col items-center justify-center select-none ${
                    cell.building.tier === 3
                      ? "scale-110 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                      : cell.building.tier === 2
                      ? "scale-100"
                      : "scale-90"
                  }`}
                  title={`${cell.building.name} (${
                    cell.sectorId === "state"
                      ? "Nhà nước"
                      : cell.sectorId === "private"
                      ? "Tư nhân"
                      : "FDI"
                  })`}
                >
                  {IconComponent ? (
                    <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-white/90" />
                  ) : (
                    <span className="text-xs">{cell.building.icon}</span>
                  )}
                </motion.div>
              ) : null}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
