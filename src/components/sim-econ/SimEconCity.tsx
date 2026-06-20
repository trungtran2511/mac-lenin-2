import React, { useState, useEffect } from "react";
import { Sparkles, BrainCircuit, ShieldCheck, HelpCircle } from "lucide-react";
import { SIM_ECON_SECTORS } from "../../lib/simEconData";
import type { GridCell, EconomicSectorExtended } from "../../lib/simEconTypes";
import { CityGrid } from "./CityGrid";
import { SectorSliders } from "./SectorSliders";
import { XRayPanel } from "./XRayPanel";
import { askThayNamAI } from "../../lib/ai";

export default function SimEconCity() {
  // Contributions State
  const [contributions, setContributions] = useState<{ [key: string]: number }>({
    state: 29,
    private: 45,
    fdi: 26
  });

  const [grid, setGrid] = useState<GridCell[]>([]);
  const [selectedSector, setSelectedSector] = useState<EconomicSectorExtended | null>(null);

  // AI Forecast State
  const [forecast, setForecast] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const rebuildGrid = (stateC: number, privateC: number, fdiC: number): GridCell[] => {
    const cells: GridCell[] = [];
    const sCount = Math.round(stateC);
    const pCount = Math.round(privateC);
    const fCount = 100 - sCount - pCount; // Ensure it adds exactly to 100

    const pool: string[] = [];
    for (let i = 0; i < sCount; i++) pool.push("state");
    for (let i = 0; i < pCount; i++) pool.push("private");
    for (let i = 0; i < fCount; i++) pool.push("fdi");

    for (let i = 0; i < 100; i++) {
      const sectorId = pool[i] || null;
      let building = null;

      if (sectorId) {
        const sector = SIM_ECON_SECTORS.find((s) => s.id === sectorId);
        if (sector && sector.buildingTypes.length > 0) {
          const bIndex = i % sector.buildingTypes.length;
          building = sector.buildingTypes[bIndex];
        }
      }

      cells.push({
        index: i,
        sectorId,
        building,
        isAnimating: false
      });
    }
    return cells;
  };

  useEffect(() => {
    setGrid(rebuildGrid(contributions.state, contributions.private, contributions.fdi));
    // Default forecast
    setForecast("Nhấn nút 'Dự báo vĩ mô AI' để nhận phân tích học thuật từ Thầy Nam về cơ cấu GDP này.");
  }, []);

  const handleSliderChange = (changedId: string, value: number) => {
    const prevVal = contributions[changedId];
    const delta = value - prevVal;
    const otherIds = Object.keys(contributions).filter((id) => id !== changedId);

    const sumOthers = otherIds.reduce((sum, id) => sum + contributions[id], 0);

    const nextContributions = { ...contributions };
    nextContributions[changedId] = value;

    if (sumOthers > 0) {
      otherIds.forEach((id) => {
        const portion = contributions[id] / sumOthers;
        nextContributions[id] = Math.max(5, contributions[id] - delta * portion);
      });
    } else {
      otherIds.forEach((id) => {
        nextContributions[id] = Math.max(5, (100 - value) / 2);
      });
    }

    // Normalize to make sure they sum exactly to 100
    const total = Object.values(nextContributions).reduce((sum, v) => sum + v, 0);
    const diff = 100 - total;
    if (diff !== 0) {
      const largestOtherId = otherIds.reduce((maxId, id) =>
        nextContributions[id] > nextContributions[maxId] ? id : maxId
      , otherIds[0]);
      nextContributions[largestOtherId] += diff;
    }

    setContributions(nextContributions);
    setGrid(rebuildGrid(nextContributions.state, nextContributions.private, nextContributions.fdi));
  };

  const handleCellClick = (sectorId: string) => {
    const sector = SIM_ECON_SECTORS.find((s) => s.id === sectorId);
    if (sector) {
      setSelectedSector(sector);
    }
  };

  const getAiForecast = async () => {
    setIsAiLoading(true);
    const systemInstruction = `Bạn là Thầy Nam AI, giảng viên Kinh tế chính trị Mác - Lênin. 
Hãy đưa ra một nhận định định tính sâu sắc, khoảng 3 câu về tỷ trọng GDP hiện tại. 
Phân tích xem cơ cấu này có đảm bảo định hướng xã hội chủ nghĩa hay không (đặc biệt là vai trò chủ đạo của Kinh tế Nhà nước - tối thiểu phải đủ sức giữ các ngành then chốt).
Tuyệt đối KHÔNG tự bịa ra bất kỳ số liệu định lượng phần trăm tăng trưởng hoặc GDP mới nào ngoài các số liệu đã được cung cấp.`;

    const prompt = `Cơ cấu đóng góp GDP hiện tại:
- Kinh tế Nhà nước: ${Math.round(contributions.state)}%
- Kinh tế Tư nhân: ${Math.round(contributions.private)}%
- Kinh tế FDI (Đầu tư nước ngoài): ${Math.round(contributions.fdi)}%`;

    try {
      const result = await askThayNamAI(prompt, systemInstruction);
      setForecast(result);
    } catch (err) {
      setForecast("Hệ thống dự báo AI tạm thời gián đoạn. Nhìn chung, hãy giữ Kinh tế Nhà nước ở mức phù hợp để làm công cụ định hướng vĩ mô.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {selectedSector && (
        <XRayPanel sector={selectedSector} onClose={() => setSelectedSector(null)} />
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            🏙️ Kinh Tế Kỳ Thành: SimEcon Việt Nam 2026
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-light max-w-xl">
            Lưới sa bàn 10x10 đại diện cho 100% GDP quốc gia. Click vào các tòa nhà đại diện để chụp X-Ray xem vai trò hiến định và các ngành then chốt.
          </p>
        </div>
      </div>

      {/* Main Layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Grid Board */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <span className="text-xs font-bold text-neutral-300 self-center lg:self-start">
            Sa bàn Thành phố GDP (Mỗi ô = 1% tỷ trọng)
          </span>
          <CityGrid grid={grid} onCellClick={handleCellClick} />

          {/* Color Legend */}
          <div className="flex justify-center gap-4 mt-2">
            {SIM_ECON_SECTORS.map((s) => (
              <button
                key={s.id}
                onClick={() => handleCellClick(s.id)}
                className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold hover:scale-105 transition-transform"
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                {s.name.split(" ")[2]}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Controls & AI Forecast */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Sliders control */}
          <SectorSliders contributions={contributions} onChange={handleSliderChange} />

          {/* AI Forecast panel */}
          <div className="bg-neutral-900/30 border border-white/5 rounded-2xl p-5 flex flex-col gap-4 text-left">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4 text-blue-400" />
                Đánh giá cấu trúc & Dự báo vĩ mô
              </span>

              <button
                onClick={getAiForecast}
                disabled={isAiLoading}
                className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white text-xs font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 shadow-md shadow-blue-900/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isAiLoading ? "Đang phân tích..." : "Dự báo vĩ mô AI"}
              </button>
            </div>

            {/* AI Speech Bubble */}
            <div className="bg-black/40 rounded-2xl p-4 border border-white/5 min-h-[90px] flex items-center justify-center relative">
              {isAiLoading ? (
                <div className="flex items-center gap-1.5 py-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              ) : (
                <div className="text-xs md:text-sm text-neutral-200 leading-relaxed font-light w-full">
                  {forecast}
                </div>
              )}
            </div>

            {/* Constitutional compliance check */}
            <div className="flex items-center gap-2 text-[10px] text-neutral-500 border-t border-white/5 pt-3">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>
                {contributions.state >= 25
                  ? "Kinh tế Nhà nước đủ tỷ trọng (>= 25%) để giữ vai trò chủ đạo nền kinh tế."
                  : "Cảnh báo: Tỷ trọng Kinh tế Nhà nước quá thấp (< 25%), có nguy cơ mất vai trò định hướng vĩ mô."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
