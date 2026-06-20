import type { QuizQuestion } from "./chapterToolTypes";

let quizQuestionsCache: QuizQuestion[] | null = null;

export async function fetchAllQuizQuestions(): Promise<QuizQuestion[]> {
  if (quizQuestionsCache) return quizQuestionsCache;
  
  try {
    const res = await fetch("/quiz_questions.json");
    if (res.ok) {
      quizQuestionsCache = await res.json();
      return quizQuestionsCache!;
    }
  } catch (e) {
    console.warn("Could not load /quiz_questions.json, falling back to curriculum_knowledge.json", e);
  }

  // Fallback to curriculum_knowledge.json
  const res = await fetch("/curriculum_knowledge.json");
  if (!res.ok) {
    throw new Error("Failed to load curriculum knowledge for quiz fallback");
  }
  const data = await res.json();
  const optionIds: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];
  
  quizQuestionsCache = (data.quiz_questions || []).map((q: any) => ({
    id: q.id || `q-${Math.random()}`,
    chapterId: q.chapter,
    prompt: q.question,
    options: (q.options || []).map((text: string, idx: number) => ({
      id: optionIds[idx] || "A",
      text
    })),
    correctOptionId: optionIds[q.correctAnswer] || "A",
    explanation: q.explanation || "",
    contextExcerpt: q.contextExcerpt || ""
  }));

  return quizQuestionsCache!;
}

export async function getQuizQuestions(
  chapterIds: number[],
  requestedCount: number
): Promise<{
  questions: QuizQuestion[];
  isCapped: boolean;
  totalAvailableCount: number;
}> {
  const allQuestions = await fetchAllQuizQuestions();
  
  // Filter by chapterIds. If empty, include all.
  const filtered = allQuestions.filter(q => 
    chapterIds.length === 0 || chapterIds.includes(q.chapterId)
  );

  const totalAvailableCount = filtered.length;
  let isCapped = false;
  let countToSelect = requestedCount;

  if (countToSelect > totalAvailableCount) {
    countToSelect = totalAvailableCount;
    isCapped = true;
  }

  // Fisher-Yates shuffle algorithm for better randomness
  const shuffled = [...filtered];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const questions = shuffled.slice(0, countToSelect);

  return {
    questions,
    isCapped,
    totalAvailableCount
  };
}
