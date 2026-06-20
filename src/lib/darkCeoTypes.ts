export interface Department {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

export interface CeoChoice {
  id: string;
  text: string;
  immediateImpact: {
    profit: number;
    competitiveness: number;
    socialResponsibility: number;
    workerMorale: number;
  };
  karmaEvent?: {
    text: string;
    delayedImpact: {
      profit: number;
      competitiveness: number;
      socialResponsibility: number;
      workerMorale: number;
    };
  };
}

export interface CrisisMessage {
  id: string;
  departmentId: string;
  text: string;
  timestamp: string;
  isUrgent: boolean;
  choices: CeoChoice[];
  karmaDelay?: number;
}

export interface ChatEntry {
  type: "department" | "ceo" | "system" | "karma";
  departmentId?: string;
  text: string;
  timestamp: string;
  isKarma?: boolean;
}

export interface KarmaTimer {
  triggerAtTurn: number;
  event: {
    text: string;
    delayedImpact: {
      profit: number;
      competitiveness: number;
      socialResponsibility: number;
      workerMorale: number;
    };
  };
  sourceChoiceText: string;
}
