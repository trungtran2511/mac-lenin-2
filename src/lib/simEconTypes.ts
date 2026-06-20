export interface BuildingType {
  id: string;
  sectorId: string;
  name: string;
  icon: string;
  tier: number;
}

export interface KeyIndustry {
  name: string;
  icon: string;
  importance: "critical" | "important" | "supporting";
  description: string;
}

export interface EconomicSectorExtended {
  id: string;
  name: string;
  gdp_contribution: number; // Tỷ trọng mặc định
  constitutional_role: string;
  description: string;
  color: string;
  buildingTypes: BuildingType[];
  keyIndustries: KeyIndustry[];
}

export interface GridCell {
  index: number;
  sectorId: string | null;
  building: BuildingType | null;
  isAnimating: boolean;
}
