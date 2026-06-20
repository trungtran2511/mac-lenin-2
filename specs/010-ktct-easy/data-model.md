# Data Model: KTCT-Easy Next Features

> **Current serialized data differs from this target model in two places.** `public/curriculum_knowledge.json` uses the legacy quiz shape (`chapter`, `question`, string `options`, `correctAnswer`), while `public/quiz_questions.json` uses the target shape below. `public/curriculum_chapter_lessons.json` stores `intro`, `studyGuide`, and 5 `keyPoints`; the current UI turns that into 6 readable cards by adding the intro. See [implementation-status.md](implementation-status.md).

## CurriculumChapter

Represents one textbook chapter.

- `chapterId`: number from 1 to 6
- `title`: string
- `summary`: short overview
- `sections`: `CurriculumSection[]`
- `quizQuestionIds`: string[]

Validation:

- `chapterId` must be 1-6.
- Content must come from extracted textbook/curriculum files.

## CurriculumSection

Represents a readable lesson section.

- `id`: string
- `chapterId`: number
- `title`: string
- `body`: string
- `keywords`: string[]
- `sourceLabel`: e.g. "GIÁO TRÌNH FULL (1).docx"

Validation:

- Must preserve textbook meaning.
- Long body should be split for readability.

## QuizQuestion

Represents one multiple-choice question.

- `id`: string
- `chapterId`: number
- `prompt`: string
- `options`: `{ id: "A" | "B" | "C" | "D"; text: string }[]`
- `correctOptionId`: string
- `explanation`: string
- `contextExcerpt`: string

Validation:

- Exactly 4 options.
- Correct option must exist.
- Explanation must include curriculum-grounded context.

## QuizSession

Represents a custom quiz run.

- `selectedChapterIds`: number[]
- `questionCount`: number
- `questionIds`: string[]
- `answers`: `{ questionId: string; selectedOptionId: string; isCorrect: boolean }[]`
- `score`: number

Validation:

- `questionCount` cannot exceed available questions for selected chapters.
- Selected chapters must be 1-6.

## SalaryInput

Represents user input for Chapter 3 calculator.

- `jobTitle`: string
- `provinceId`: string
- `monthlySalary`: number
- `hoursPerDay`: number
- `workingDaysPerMonth`: number
- `livingCostPerMonth`: number | null
- `familySupportPerMonth`: number

Validation:

- `monthlySalary > 0`
- `hoursPerDay > 0`
- `workingDaysPerMonth > 0`
- `workingDaysPerMonth <= 31`
- `hoursPerDay <= 24`
- `livingCostPerMonth` is required before enough-to-live conclusions.
- Province is used for wage-region inference only unless official living-cost data is imported.

## ProvinceWageRegion

Represents legal wage-region mapping.

- `provinceId`: string
- `provinceName`: string
- `regionId`: `vung1 | vung2 | vung3 | vung4`
- `minHourlyWage`: number
- `sourceName`: string
- `sourceDate`: string

Validation:

- Must include source metadata when updated.

## OfficialLivingCostRecord

Planned dataset entity. Do not create fake records.

- `provinceId`: string
- `provinceName`: string
- `metricName`: string
- `amountPerMonth`: number
- `unit`: string
- `year`: number
- `sourceName`: string
- `sourceUrl`: string
- `notes`: string

Validation:

- Records must come from an official or clearly cited dataset.
- If missing, UI must require user input.

## SalaryAnalysisResult

Derived from `SalaryInput` and reference data.

- `hourlyWage`: number
- `minimumMonthlyPayForEnteredHours`: number
- `minimumPayGap`: number
- `totalIncome`: number
- `livingCostGap`: number | null
- `survivalPercent`: number | null
- `jobCategory`: string
- `suggestedHourlyRange`: `[number, number]`
- `verdict`: string
- `plainExplanation`: string
- `warnings`: `ValidationWarning[]`

Validation:

- Must not calculate living-cost gap when `livingCostPerMonth` is missing.
- Must show warnings when input is unusual.

## ValidationWarning

Represents an issue with user input.

- `code`: string
- `severity`: `info | warning | blocking`
- `message`: string

Examples:

- `missing_living_cost`
- `living_cost_below_minimum_wage_reference`
- `days_too_high`
- `hours_too_high`
- `hourly_wage_extremely_low`

## ChapterTool

Represents one interactive chapter feature.

- `chapterId`: number
- `toolId`: string
- `title`: string
- `purpose`: string
- `inputs`: string[]
- `outputs`: string[]
- `dataSources`: string[]

Validation:

- Each chapter must have exactly one primary tool.
- Tool must reference curriculum content.

## AiContextRequest

Represents a bounded AI help request.

- `mode`: `quiz_explain | salary_explain | chapter_tool_explain`
- `chapterId`: number
- `userQuestion`: string
- `currentStateSummary`: string
- `curriculumContext`: string
- `expectedFormat`: string

Validation:

- Must include current context.
- Must not include secrets.
- Output must be displayed as explanation, not authoritative numeric data.
