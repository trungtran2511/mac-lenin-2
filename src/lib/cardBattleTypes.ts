export interface DialecticalCard {
  id: string;
  name: string;
  category: "thesis" | "antithesis";
  quantityValue: number;
  icon: string;
  description: string;
  color: string;
}

export interface SynthesisCard {
  id: string;
  name: string;
  requiredThesis: string;
  requiredAntithesis: string;
  leapThreshold: number;
  description: string;
}

export interface DialecticalDebate {
  id: string;
  title: string;
  description: string;
  side_a: string;
  side_b: string;
  thesisCards: DialecticalCard[];
  antithesisCards: DialecticalCard[];
  synthesisCards: SynthesisCard[];
}
