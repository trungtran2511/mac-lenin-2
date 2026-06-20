import React from "react";
import { SIM_ECON_SECTORS } from "../../lib/simEconData";

interface SectorSlidersProps {
  contributions: { [key: string]: number };
  onChange: (sectorId: string, value: number) => void;
}

export const SectorSliders: React.FC<SectorSlidersProps> = ({ contributions, onChange }) => {
  return (
    <div className="flex flex-col gap-5 w-full bg-neutral-900/30 border border-white/5 rounded-2xl p-5">
      <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
        📊 Điều phối Tỷ trọng GDP (Tổng = 100%)
      </h3>

      {SIM_ECON_SECTORS.map((sector) => {
        const val = contributions[sector.id] || 0;

        return (
          <div key={sector.id} className="flex flex-col gap-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sector.color }} />
                {sector.name}
              </span>
              <span className="font-mono font-black" style={{ color: sector.color }}>
                {Math.round(val)}%
              </span>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="range"
                min="5"
                max="80"
                value={Math.round(val)}
                onChange={(e) => onChange(sector.id, Number(e.target.value))}
                className="flex-grow h-1.5 rounded-lg appearance-none cursor-pointer bg-neutral-950 accent-current"
                style={{ color: sector.color }}
              />
              <span className="text-[10px] text-neutral-500 w-8 text-right font-mono">
                {Math.round(val)} ô
              </span>
            </div>
            <p className="text-[9px] text-neutral-400 font-light leading-snug">
              {sector.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};
