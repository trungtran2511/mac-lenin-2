export interface CurriculumChapter {
  id: number;
  title: string;
  summary: string;
}

export interface KeyPoint {
  heading: string;
  text: string;
  source: string;
  details: string[];
}

export interface ChapterLessons {
  chapterId: number;
  title: string;
  intro: string;
  studyGuide: string[];
  keyPoints: KeyPoint[];
}

export interface QuizCurriculumContext {
  chapterId: number;
  sectionHeading: string;
  excerpt: string;
}

let cachedLessons: ChapterLessons[] | null = null;
let cachedKnowledge: any | null = null;

export async function loadCurriculumLessons(): Promise<ChapterLessons[]> {
  if (cachedLessons) return cachedLessons;
  const res = await fetch("/curriculum_chapter_lessons.json");
  if (!res.ok) throw new Error("Failed to load curriculum lessons");
  cachedLessons = await res.json();
  return cachedLessons!;
}

export async function loadCurriculumKnowledge(): Promise<any> {
  if (cachedKnowledge) return cachedKnowledge;
  const res = await fetch("/curriculum_knowledge.json");
  if (!res.ok) throw new Error("Failed to load curriculum knowledge");
  cachedKnowledge = await res.json();
  return cachedKnowledge!;
}

export async function getExcerptForChapter(chapterId: number, keywords: string[] = []): Promise<string> {
  try {
    const lessons = await loadCurriculumLessons();
    const chapter = lessons.find(c => c.chapterId === chapterId);
    if (!chapter) {
      // Fallback: try reading from knowledge
      const knowledge = await loadCurriculumKnowledge();
      const kCh = knowledge.chapters?.find((c: any) => c.id === chapterId);
      return kCh ? `Chương ${chapterId}: ${kCh.title}\nTóm tắt: ${kCh.summary}` : `Chương ${chapterId}`;
    }

    if (keywords.length === 0) {
      return `Chương ${chapterId}: ${chapter.title}\nGiới thiệu: ${chapter.intro}`;
    }

    const matches: string[] = [];
    const lowerKws = keywords.map(kw => kw.toLowerCase());

    for (const kp of chapter.keyPoints || []) {
      const textToSearch = `${kp.heading} ${kp.text} ${(kp.details || []).join(" ")}`.toLowerCase();
      const isMatched = lowerKws.some(kw => textToSearch.includes(kw));
      if (isMatched) {
        matches.push(
          `[Chủ đề: ${kp.heading}]\n${kp.text}\nChi tiết giáo trình:\n${(kp.details || []).map(d => `- ${d}`).join("\n")}`
        );
      }
    }

    if (matches.length > 0) {
      return matches.join("\n\n");
    }

    // Default fallback to first key point if no match is found
    if (chapter.keyPoints && chapter.keyPoints.length > 0) {
      const firstKp = chapter.keyPoints[0];
      return `[Chủ đề: ${firstKp.heading}]\n${firstKp.text}\nChi tiết:\n${(firstKp.details || []).join("\n")}`;
    }

    return `Chương ${chapterId}: ${chapter.title}\nGiới thiệu: ${chapter.intro}`;
  } catch (error) {
    console.error("Error in getExcerptForChapter:", error);
    return `Thông tin giáo trình Chương ${chapterId}`;
  }
}

const normalizeText = (value: string) => value
  .toLocaleLowerCase("vi-VN")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/đ/g, "d");

export async function getQuizCurriculumContext(
  chapterId: number,
  question: string,
  explanation: string
): Promise<QuizCurriculumContext> {
  const lessons = await loadCurriculumLessons();
  const chapter = lessons.find(item => item.chapterId === chapterId);

  if (!chapter) {
    return {
      chapterId,
      sectionHeading: `Chương ${chapterId}`,
      excerpt: `Giáo trình - Chương ${chapterId}.\nCâu hỏi: ${question}\nLuận giải có sẵn: ${explanation}`
    };
  }

  const explicitSection = question.match(/mục\s+['“"]([^'”"]+)['”"]/i)?.[1];
  const normalizedQuestion = normalizeText(`${question} ${explanation}`);
  const keywords = normalizedQuestion
    .split(/[^\p{L}\p{N}]+/u)
    .filter(token => token.length >= 4);

  const matchedPoint = chapter.keyPoints
    .map(point => {
      const normalizedHeading = normalizeText(point.heading);
      const normalizedContent = normalizeText(`${point.heading} ${point.text}`);
      const exactSectionScore = explicitSection && normalizedHeading === normalizeText(explicitSection) ? 100 : 0;
      const keywordScore = keywords.reduce(
        (score, keyword) => score + (normalizedContent.includes(keyword) ? 1 : 0),
        0
      );
      return { point, score: exactSectionScore + keywordScore };
    })
    .sort((left, right) => right.score - left.score)[0]?.point;

  if (!matchedPoint) {
    return {
      chapterId,
      sectionHeading: "Mở đầu chương",
      excerpt: `Giáo trình - Chương ${chapterId}, Mở đầu chương.\n${chapter.intro.slice(0, 1100)}`
    };
  }

  const supportingDetail = matchedPoint.details[0]?.slice(0, 700) || "";
  return {
    chapterId,
    sectionHeading: matchedPoint.heading,
    excerpt: [
      `Giáo trình - Chương ${chapterId}, mục "${matchedPoint.heading}".`,
      `Nội dung cốt lõi: ${matchedPoint.text}`,
      supportingDetail ? `Chi tiết hỗ trợ: ${supportingDetail}` : ""
    ].filter(Boolean).join("\n")
  };
}
