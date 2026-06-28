# Implementation Plan: Adjust Font Sizes

**Branch**: `011-adjust-font-sizes` | **Date**: 2026-06-28 | **Spec**: [spec.md](spec.md)

## Summary

Scan the project's components and views to identify where font sizes are too small for students (e.g. `text-xs`, `text-[10px]` or `text-sm` with `font-light` in long text sections). Adjust them to standard sizes (`text-sm` or `text-base` for general text/descriptions, and `text-base` or `text-lg` for headings/prompts/reading blocks) to improve readability. Ensure layout stability and mobile responsiveness.

## Technical Context

**Language/Version**: React 19 + TypeScript + Vite

**Primary Dependencies**: React, Tailwind CSS v4, Lucide React

**Storage**: N/A (this is a client-side layout adjustment)

**Testing**: TypeScript typecheck + Vite production build

**Target Platform**: Vercel static frontend

**Project Type**: Client-side educational SPA

**Performance Goals**: Typography adjustments must not impact page rendering performance.

**Constraints**:
- Keep layouts stable on mobile viewport widths (360px - 480px) and prevent horizontal scrolling or overflowing buttons.
- Do not modify functional or logical code, only CSS/Tailwind utility classes.
- Sourced metadata annotations (e.g. DataSourceMeta, licensing footnotes) can remain at `text-xs` (12px) to preserve screen real estate, but never below 11px.

## Constitution Check

Validate the active plan against the KTCT-Easy constitution:

- **AI-Native Control Plane (Thay Nam AI)**: No changes to reasoning models or prompts. Only the font size of the AI responses in `InlineThayNamAI.tsx` is scaled for readability. (Complies)
- **Prompt Governance**: No changes to prompts or LLM configurations. (Complies)
- **Data Source Discipline**: No new mock data or statistics added. Layout uses existing sourced datasets. (Complies)
- **Observable Static Frontend**: React static structure remains intact. No backend service is introduced. (Complies)
- **API Key Rotation & Safety Gates**: Key rotation fallback behavior is preserved. (Complies)

## Project Structure

### Documentation

```text
specs/011-adjust-font-sizes/
├── spec.md                  # Feature Specification
├── plan.md                  # This Implementation Plan
├── research.md              # Research document (Phase 0)
├── data-model.md            # Data model mappings (Phase 1)
├── quickstart.md            # Quickstart instructions (Phase 1)
└── contracts/
    └── ui-contracts.md      # UI Contract description (Phase 1)
```

### Source Code

```text
src/
└── components/
    ├── ChapterSyllabusPanel.tsx
    ├── CurriculumReadingPanel.tsx
    ├── FlexibleQuizBuilder.tsx
    ├── InlineThayNamAI.tsx
    ├── SalaryCalculatorPanel.tsx
    ├── SectionDetailPanel.tsx
    └── chapter-tools/
        └── Chapter3SalarySurplusTool.tsx
```

## Proposed Changes

We will modify the styling classes in the following UI components to scale up font sizes:

### Component: Curriculum & Reading

#### [MODIFY] [CurriculumReadingPanel.tsx](file:///D:/DemoCodeTriet/my-mln-learning-2/src/components/CurriculumReadingPanel.tsx)
- Scale `text-[10px]` metadata tags to `text-xs` and adjust letter-spacing.
- Increase reading description from `text-sm` to `text-base` where appropriate.

#### [MODIFY] [App.tsx](file:///D:/DemoCodeTriet/my-mln-learning-2/src/App.tsx)
- Move `SectionDetailPanel` out of `md:col-span-6` grid column and render it full-width below the grid when active.

#### [MODIFY] [SectionDetailPanel.tsx](file:///D:/DemoCodeTriet/my-mln-learning-2/src/components/SectionDetailPanel.tsx)
- Scale key point summaries from `text-sm` to `text-base` for improved readability.
- Scale main textbook details from `text-sm text-white/80 font-light` to `text-base text-white/85` and ensure proper line height.
- Add `panelRef` and `useEffect` to scroll smoothly to the detail panel once it becomes active.

#### [MODIFY] [ChapterSyllabusPanel.tsx](file:///D:/DemoCodeTriet/my-mln-learning-2/src/components/ChapterSyllabusPanel.tsx)
- Scale the chapter syllabus summary paragraph from `text-sm` to `text-base`.

### Component: Quiz & Practice

#### [MODIFY] [FlexibleQuizBuilder.tsx](file:///D:/DemoCodeTriet/my-mln-learning-2/src/components/FlexibleQuizBuilder.tsx)
- Scale question prompts from `text-base/text-lg` to `text-lg/text-xl`.
- Scale answer options from `text-sm` to `text-base`.
- Scale question explanations from `text-sm` to `text-base`.
- Scale textbook context excerpts from `text-xs` to `text-sm`.

### Component: Input Tools & AI Feedback

#### [MODIFY] [SalaryCalculatorPanel.tsx](file:///D:/DemoCodeTriet/my-mln-learning-2/src/components/SalaryCalculatorPanel.tsx)
- Scale form labels from `text-xs` to `text-sm`.
- Scale the deterministic surplus analysis (v, t, t', m') definitions from `text-xs` to `text-sm`.
- Ensure buttons and inputs remain well-aligned.

#### [MODIFY] [Chapter3SalarySurplusTool.tsx](file:///D:/DemoCodeTriet/my-mln-learning-2/src/components/chapter-tools/Chapter3SalarySurplusTool.tsx)
- Scale forms labels and descriptions from `text-xs` to `text-sm`.
- Scale deep analysis paragraphs from `text-xs` to `text-sm` or `text-base`.

#### [MODIFY] [InlineThayNamAI.tsx](file:///D:/DemoCodeTriet/my-mln-learning-2/src/components/InlineThayNamAI.tsx)
- Scale AI answer text blocks from `text-xs md:text-sm` to `text-sm md:text-base`.
- Scale question form input and buttons to `text-sm`.

## Verification Plan

### Automated Tests
- Run TypeScript compilation check:
  ```powershell
  npx tsc -p tsconfig.app.json --noEmit
  ```
- Run Vite production bundle build to ensure no bundling/parsing errors:
  ```powershell
  npx vite build --outDir verify_font_adjustments
  ```

### Manual Verification
- Deploy locally and check the modified views in the browser:
  - Tab "Tự Học": Select a chapter and open detail sections, verify curriculum text readability.
  - Tab "Tự Học" -> Quiz: Start a quiz session, check font sizes of prompt, choices, explanations, and context excerpts.
  - Tab "Tính Lương": Check input forms and analysis output.
  - Ask Thầy Nam AI in the inline panel and verify response size.
  - Verify layout responsiveness by scaling the window down to mobile width using Chrome DevTools (360px).
