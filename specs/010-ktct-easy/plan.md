# Implementation Plan: KTCT-Easy 6 Chapter Tools

**Branch**: `010-ktct-easy`  
**Date**: 2026-06-19  
**Spec**: [spec.md](spec.md)

## Summary

Refactor KTCT-Easy into a clear learning app with 6 chapter-aligned tools, flexible quiz practice, and inline Thay Nam AI. The plan prioritizes simple UI, deterministic calculations, textbook-grounded explanations, and strict data-source discipline.

> **Current implementation:** this is a forward plan. For the scanned code state, integrated flows, data files, AI key rotation, and known gaps, read [implementation-status.md](implementation-status.md).

The most important implementation rule is: **do not fabricate economic data**. Chapter 3 must not invent province/city living costs. Province/city may infer legal wage region only when a sourced mapping exists. Living-cost conclusions require user input or an imported official dataset with metadata.

## Technical Context

**Language/Version**: React 19 + TypeScript + Vite  
**Primary Dependencies**: React, Vite, TypeScript, lucide-react, existing CSS utilities. Keep chart libraries only where they genuinely improve understanding.  
**Storage**: Static JSON files in `public/`; no database.  
**Testing**: TypeScript check, Vite build, manual browser checks.  
**Target Platform**: Vercel static frontend. Gemini may be called directly with Vite env keys or through Vercel serverless only if already present.  
**Project Type**: Client-side educational SPA.  
**Performance Goals**: Local interactions feel instant; AI loading/failure states are explicit.  
**Constraints**:

- UI must be readable by non-technical students.
- Formulas stay behind detail sections.
- AI output cannot override local calculations.
- No fake province-level living-cost data.
- Any real number must have a source/date or be clearly labeled as user-entered/mock.
- Gemini key fallback order: `VITE_GEMINI_API_KEY`, then `VITE_GEMINI_API_KEY1`, then `VITE_GEMINI_API_KEY2`; 429 responses create a per-session cooldown.

## Constitution Check

Applicable safeguards for this frontend educational app:

- AI behavior is explicit, bounded, and reviewable through a shared helper.
- Prompt context is limited to the current question/result plus relevant curriculum excerpt.
- Deterministic calculations remain local and inspectable.
- AI failure has fallback behavior and never clears user work.
- No auth, payment, subscription, or destructive account actions are in scope.

Known mismatch: the repository constitution references a different backend-heavy V-FIT architecture. This plan follows the applicable AI/data safety controls and avoids backend/payment/auth assumptions.

## Project Structure

```text
specs/010-ktct-easy/
|-- spec.md
|-- plan.md
|-- chapter-functions-implementation-plan.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- ui-contracts.md
`-- tasks.md
```

```text
src/
|-- App.tsx
|-- components/
|   |-- CurriculumReadingPanel.tsx
|   |-- SalaryCalculatorPanel.tsx
|   |-- InlineThayNamAI.tsx                 # planned
|   |-- FlexibleQuizBuilder.tsx             # planned
|   `-- chapter-tools/
|       |-- Chapter1MethodMap.tsx           # planned
|       |-- Chapter2CommodityMarketLab.tsx  # planned
|       |-- Chapter3SalarySurplusTool.tsx   # planned/refactor
|       |-- Chapter4CompetitionMonopolyLab.tsx
|       |-- Chapter5VietnamEconomyRelations.tsx
|       `-- Chapter6ModernizationPlanner.tsx
|-- lib/
|   |-- ai.ts
|   |-- curriculum.ts
|   |-- quiz.ts
|   |-- salaryValidation.ts
|   |-- dataSourcePolicy.ts
|   `-- chapterToolTypes.ts
public/
|-- curriculum_chapter_lessons.json
|-- curriculum_knowledge.json
|-- curriculum_search_index.json
|-- quiz_questions.json
|-- chapter_tool_scenarios.json
|-- wage_regions.json
`-- official_living_cost_data.json          # only if real sourced dataset is imported
```

## Implementation Phases

### Phase 1: Shared Foundations

Goal: stop duplicating AI, curriculum, quiz and validation logic.

Implement:

- `src/lib/ai.ts`
  - reads `VITE_GEMINI_API_KEY`
  - retries with `VITE_GEMINI_API_KEY1` then `VITE_GEMINI_API_KEY2` only for auth/quota/rate-limit/server-style failures
  - never logs keys
  - returns typed success/error result
- `src/lib/curriculum.ts`
  - find chapter
  - find section by keyword
  - return short relevant excerpts for AI
- `src/lib/quiz.ts`
  - filter by chapter
  - random sample without duplicates
  - cap requested count to available count
- `src/lib/dataSourcePolicy.ts`
  - label data as `official`, `user_entered`, `teaching_example`, or `missing`
- `src/lib/salaryValidation.ts`
  - validate salary, hours, days, living cost, urban low-cost warnings

Acceptance:

- Local app can run without AI key.
- If primary key fails and backup key works, AI answers.
- If both keys fail, UI shows friendly error and keeps local results.

### Phase 2: Chapter 3 Salary/Surplus Analyzer Stabilization

Goal: make the salary feature understandable and trustworthy.

Implement:

- Keep province/city selector for wage-region inference only.
- Remove hard-coded living-cost defaults.
- Require user-entered living cost unless a sourced dataset exists.
- Add warnings for:
  - missing living cost
  - urban living cost too low
  - likely unit error
  - day/month > 31
  - hour/day > 24
  - hour/day > 16
  - hourly wage extremely low
- Simplify result UI:
  - "Chủ trả"
  - "Bạn cần để sống"
  - "Kết luận"
  - "Cần kiểm tra lại"
  - "So với sàn vùng"
  - "Giải thích thặng dư"
- Remove decorative controls such as irrelevant AI/technology toggle in surplus simulation.
- Put formulas `v`, `m`, `m'` behind details.

Acceptance:

- Hà Nội + 3.000.000đ living cost warns as suspiciously low unless support is declared.
- Empty living cost blocks enough-to-live conclusion.
- 25 hours/day is invalid.
- AI classification failure does not block calculations.

### Phase 3: Flexible Quiz + Inline AI

Goal: make practice usable before adding more chapter tools.

Implement:

- `FlexibleQuizBuilder`
  - choose chapters 1-6
  - choose question count 5/10/20/40/custom
  - show available question count
  - randomize without duplicates
- Answer feedback:
  - correct/incorrect
  - correct answer
  - explanation
  - curriculum context
- `InlineThayNamAI`
  - appears under the answered question
  - preloads context from the current question/result
  - accepts follow-up user input without page navigation

Acceptance:

- Chapter 2 + 10 questions returns only Chapter 2 questions.
- Requesting 40 when only 25 exist shows "chỉ có 25 câu khả dụng".
- AI receives question, selected answer, correct answer, explanation and excerpt.

### Phase 4: Chapter 1 Method Map

Goal: explain object, method and functions of the discipline.

Implement:

- Interactive nodes for core concepts.
- Right-side detail panel.
- Short example and exam wording for each node.
- One mini quiz/reflection per node.

Acceptance:

- Student can understand "đối tượng nghiên cứu", "trừu tượng hóa khoa học" and "chức năng" without reading a long wall of text.

### Phase 5: Chapter 2 Commodity/Market Lab

Goal: explain commodity, money, market, law of value and price fluctuation.

Implement:

- Teaching scenarios labeled as examples.
- Controls for supply/demand pressure.
- Output table or compact visual showing value vs market price.
- Concept explanation tied to Chapter 2.

Acceptance:

- UI clearly says scenario numbers are teaching examples, not real market data.

### Phase 6: Chapter 4 Competition/Monopoly Lab

Goal: show competition, concentration, monopoly tendency and market power.

Implement:

- Market structure selector.
- Controls for number of firms, entry barrier, price power.
- Output: competition level, monopoly risk, consumer/worker impact.

Acceptance:

- Fewer firms + higher barriers increases market power in the explanation.

### Phase 7: Chapter 5 Vietnam Economy Relations

Goal: teach socialist-oriented market economy and benefit relations.

Implement:

- Actor map: State, private sector, FDI, workers, consumers, cooperatives/community.
- Scenario selector.
- Output: who benefits, who bears cost, state regulation role, curriculum link.

Acceptance:

- Case "tăng lương tối thiểu" explains effects across actors without unsupported macro numbers.

### Phase 8: Chapter 6 Modernization/Integration Planner

Goal: connect industrialization, modernization and integration to a career/industry.

Implement:

- User enters/selects industry/career.
- App maps it to technology, skills, global value chain, opportunities and risks.
- Optional AI can draft a short study reflection, labeled as suggestion.

Acceptance:

- "Lập trình viên" links to digital transformation and global value chains.
- "Nông nghiệp" links to mechanization, logistics, export standards and integration risks.

### Phase 9: Polish and Verification

Goal: make the app feel simple, not academic-overloaded.

Implement:

- Remove unused controls and decorative explanatory blocks.
- Collapse formulas behind details.
- Ensure cards do not overlap on desktop/mobile.
- Add loading, empty, invalid, success and AI failure states.

Acceptance:

- A first-time user can understand what to do on each screen without reading a paragraph of instructions.

## Data Source Policy

Allowed:

- Textbook/curriculum extraction.
- User-entered data.
- Official/source-labeled datasets.
- Wage-region mapping with source/date.
- Teaching examples clearly labeled.

Not allowed:

- Hard-coded living cost by province/city without source.
- "Current" market numbers without source/date.
- AI-generated numbers presented as factual.

## Quality Gates

Run before handoff:

```powershell
npx tsc -p tsconfig.app.json --noEmit
npx vite build --outDir verify_ktct_easy
```

- [x] Desktop layout (verified and optimized chapter layout with SectionDetailPanel).
- [x] Mobile layout (verified responsive grid wrapping).
- [x] Chapter 3 validation warnings.
- [x] Inline AI context (integrated via InlineQuizChat component).
- [x] AI primary key failure (API Key Rotation via askThayNamAI).
- [x] Both AI keys failure (proper fallback errors).

## Status: COMPLETE
All implementation phases have been completed and verified using local TS compiler tests and production static bundle compilation. No further modifications required.
