# UI Contracts: KTCT-Easy Next Features

> **Integration note:** these are target contracts. The legacy quiz in `App.tsx` is integrated and opens the main chat view for AI follow-up; `FlexibleQuizBuilder.tsx` and its inline AI panel exist but are not yet wired into the primary UI. See [implementation-status.md](../implementation-status.md).

## Salary Analyzer Contract

### Inputs

- Job title is free text.
- Province/city is selected from the app list.
- Monthly salary is a VND number.
- Hours per day is a number.
- Days per month is a number.
- Living cost is a user-entered VND number unless official data is imported.
- Family support is optional.

### Required Behavior

- Province/city may infer wage region.
- Province/city must not auto-fill living cost without source data.
- Missing living cost blocks enough-to-live conclusions.
- Unrealistic input shows warnings before analysis.
- AI failure falls back to deterministic rules.

### Required Output

- Plain verdict.
- Wage/hour.
- Minimum wage comparison.
- Living-cost comparison only when living cost exists.
- Job category and reasonable hourly range.
- Surplus-value explanation in everyday Vietnamese.
- Optional formula details.

## Quiz Contract

### Inputs

- Selected chapter ids.
- Requested question count.
- User selected answer.

### Required Behavior

- Question pool is filtered by selected chapters.
- Answer feedback appears immediately.
- Explanation is grounded in curriculum context.
- Inline AI receives the exact question, answer, explanation, and excerpt.

### Required Output

- Correct/incorrect state.
- Correct answer.
- Explanation.
- Inline "Ask Thay Nam AI" panel.

## Chapter Tool Contract

Each chapter tool must expose:

- A single clear purpose.
- 1-3 simple controls.
- A short conclusion.
- A curriculum-grounded explanation.
- A small quiz or reflection prompt.

Each chapter tool must not:

- Use unsourced real-world numbers.
- Hide important assumptions.
- Require the user to understand formulas before the plain explanation.

## AI Contract

### Environment Keys

- Primary key: `VITE_GEMINI_API_KEY`
- Backup keys: `VITE_GEMINI_API_KEY1`, `VITE_GEMINI_API_KEY2`
- The shared AI helper tries keys in that order and skips a key in the current browser session after a 429 until Gemini's `retryDelay` expires.
- Never show or log any key.

### Input Shape

```json
{
  "mode": "quiz_explain | salary_explain | chapter_tool_explain",
  "chapterId": 1,
  "userQuestion": "...",
  "currentStateSummary": "...",
  "curriculumContext": "...",
  "expectedFormat": "short Vietnamese explanation"
}
```

### Output Shape

```json
{
  "answer": "...",
  "keyConcepts": ["..."],
  "nextStep": "..."
}
```

### Failure Behavior

- If primary key fails and backup key succeeds, show the AI answer normally.
- If both keys fail, show a friendly error.
- Keep deterministic result visible.
- Do not clear user input.
