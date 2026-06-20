export interface CurriculumChapter {
  id: number;
  title: string;
  summary: string;
}

export interface CurriculumSection {
  id: string;
  chapterId: number;
  title: string;
  body: string;
  keywords: string[];
  sourceLabel: string;
}

export interface QuizQuestionOption {
  id: "A" | "B" | "C" | "D";
  text: string;
}

export interface QuizQuestion {
  id: string;
  chapterId: number;
  prompt: string;
  options: QuizQuestionOption[];
  correctOptionId: "A" | "B" | "C" | "D";
  explanation: string;
  contextExcerpt?: string;
}

export interface QuizSession {
  selectedChapterIds: number[];
  questionCount: number;
  questionIds: string[];
  answers: {
    questionId: string;
    selectedOptionId: string;
    isCorrect: boolean;
  }[];
  score: number;
}

export interface SalaryInput {
  jobTitle: string;
  provinceId: string;
  monthlySalary: number;
  hoursPerDay: number;
  workingDaysPerMonth: number;
  livingCostPerMonth: number | null;
  familySupportPerMonth: number;
}

export interface ValidationWarning {
  code: string;
  severity: "info" | "warning" | "blocking";
  message: string;
}

export interface SalaryAnalysisResult {
  hourlyWage: number;
  minimumMonthlyPayForEnteredHours: number;
  minimumPayGap: number;
  totalIncome: number;
  livingCostGap: number | null;
  survivalPercent: number | null;
  jobCategory: string;
  suggestedHourlyRange: [number, number];
  verdict: string;
  plainExplanation: string;
  warnings: ValidationWarning[];
}

export type DataSourcePolicyType = "official" | "user_entered" | "teaching_example" | "missing";

export interface DataSourceMeta {
  sourceName: string;
  sourceUrl?: string;
  sourceDate?: string;
  policy: DataSourcePolicyType;
}

export interface ChapterTool {
  chapterId: number;
  toolId: string;
  title: string;
  purpose: string;
  inputs: string[];
  outputs: string[];
  dataSources: string[];
}

export interface AiContextRequest {
  mode: "quiz_explain" | "salary_explain" | "chapter_tool_explain";
  chapterId: number;
  userQuestion: string;
  currentStateSummary: string;
  curriculumContext: string;
  expectedFormat: string;
}

export interface AiContextResponse {
  answer: string;
  keyConcepts: string[];
  nextStep: string;
}
