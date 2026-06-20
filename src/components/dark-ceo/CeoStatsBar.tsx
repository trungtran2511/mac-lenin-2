import React from "react";
import { DollarSign, ShieldAlert, Award, HeartHandshake } from "lucide-react";

interface CeoStatsBarProps {
  scores: {
    profit: number;
    competitiveness: number;
    socialResponsibility: number;
    workerMorale: number;
  };
}

export const CeoStatsBar: React.FC<CeoStatsBarProps> = ({ scores }) => {
  const stats = [
    {
      key: "profit",
      name: "Lợi nhuận",
      value: scores.profit,
      icon: DollarSign,
      color: "bg-amber-500",
      description: "Doanh thu trừ chi phí. Chạm 0% = phá sản; chạm 100% = bóc lột cực đoan."
    },
    {
      key: "competitiveness",
      name: "Sức Cạnh Tranh",
      value: scores.competitiveness,
      icon: ShieldAlert,
      color: "bg-blue-500",
      description: "Thế lực trên thị trường. Chạm 0% = bị nuốt chửng; chạm 100% = độc quyền trì trệ."
    },
    {
      key: "socialResponsibility",
      name: "Trách Nhiệm Xã Hội",
      value: scores.socialResponsibility,
      icon: Award,
      color: "bg-emerald-500",
      description: "Sự tuân thủ pháp luật, bảo vệ môi trường. Chạm 0% = bị đóng cửa."
    },
    {
      key: "workerMorale",
      name: "Tinh Thần Lao Động",
      value: scores.workerMorale,
      icon: HeartHandshake,
      color: "bg-red-500",
      description: "Độ gắn bó của nhân sự. Chạm 0% = đình công hàng loạt; chạm 100% = quỹ phúc lợi quá tải."
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full bg-neutral-900/30 border border-white/5 rounded-2xl p-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isDanger = stat.value <= 15 || stat.value >= 85;
        const isExtremeDanger = stat.value <= 10 || stat.value >= 90;

        return (
          <div
            key={stat.key}
            className={`flex flex-col gap-2 p-3 rounded-xl border transition-all ${
              isExtremeDanger
                ? "border-red-600 bg-red-950/20 shadow-[0_0_10px_rgba(220,38,38,0.2)] animate-pulse"
                : isDanger
                ? "border-orange-500/50 bg-orange-950/10"
                : "border-white/5 bg-black/10"
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <span className="text-[10px] md:text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                <Icon className={`w-3.5 h-3.5 ${isDanger ? "text-red-400" : "text-neutral-400"}`} />
                {stat.name}
              </span>
              <span className={`font-mono text-xs font-black ${isDanger ? "text-red-400" : "text-white"}`}>
                {stat.value}%
              </span>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden border border-white/5 relative">
              {/* Progress Fill */}
              <div
                className={`h-full ${stat.color} transition-all duration-500 rounded-full`}
                style={{ width: `${stat.value}%` }}
              />

              {/* Danger Zone Markers */}
              <div className="absolute top-0 bottom-0 left-[15%] w-[1px] bg-red-500/30" />
              <div className="absolute top-0 bottom-0 left-[85%] w-[1px] bg-red-500/30" />
            </div>

            {/* Description Tooltip helper */}
            <p className="text-[8px] md:text-[9px] text-neutral-500 font-light leading-tight">
              {stat.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};
