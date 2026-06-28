# Research: Typography & Readability Scan

This research document details the current state of typography and font sizes in the KTCT-Easy codebase and outlines the proposed improvements.

## Findings & Survey of Current State

Our scan of components and styling files revealed multiple areas where text readability is compromised by excessively small font sizes, especially in sections containing long paragraphs or dense layout information.

### 1. Curriculum Reading Panels
- **File**: `CurriculumReadingPanel.tsx`
  - Metadata labels like `"Tổng quan chương"`, `"6 mục chính"`, `"Nội dung chi tiết"`, `"Nguồn"` are sized at `text-[10px]` with high letter-spacing. On mobile screens, 10px text is very hard to read.
  - Button card description snippets use `text-sm` (14px).
  - Detailed textbook paragraphs in `CurriculumReadingDetail` are formatted with `text-[15px]` and `text-white/72`. While 15px is close to standard, the light opacity (`white/72`) reduces contrast.
- **File**: `SectionDetailPanel.tsx`
  - Summary text is sized at `text-sm` (14px) and set to `italic font-light`.
  - Detailed textbook paragraphs are sized at `text-sm text-white/80 font-light select-text`. Reading long paragraphs of academic text at 14px with `font-light` is fatiguing.
- **File**: `ChapterSyllabusPanel.tsx`
  - Fallback chapter description uses `text-sm text-white/70 font-light`.

### 2. Quiz Practice Panel
- **File**: `FlexibleQuizBuilder.tsx`
  - Question prompts: `text-base md:text-lg`.
  - Options: `text-sm font-medium`. Since options can be long, complex sentences, 14px can feel cramped.
  - Correct/incorrect results and explanations: `text-sm leading-7 text-white/70`.
  - Excerpts of curriculum text: `text-xs leading-6 text-white/55` (12px is too small for dense text).

### 3. Chapter Tools & Calculator
- **File**: `SalaryCalculatorPanel.tsx` and `Chapter3SalarySurplusTool.tsx`
  - Form labels use `text-xs font-bold text-white/60`.
  - Descriptive notes, warning blocks, base pay info, and formulas definitions (v, t, t', m') use `text-xs leading-5 text-white/55` or `text-xs text-white/60`.

### 4. AI Consultant Interface
- **File**: `InlineThayNamAI.tsx`
  - Response blocks: `text-xs md:text-sm text-white/90 leading-relaxed font-light`.
  - Concepts tags: `text-[10px]`.
  - Form inputs and submit button: `text-xs`.

## Decisions & Proposed Scale

| UI Category | Current Size | Proposed Size | Rationale |
|---|---|---|---|
| **Textbook Detailed Paragraphs** | 14px (`text-sm`) / 15px | 16px (`text-base`) | 16px is the web standard body font size, offering optimal comfort for long-form reading. |
| **Quiz Prompts** | 16px (`text-base`) / 18px | 18px (`text-lg`) / 20px | Questions need to stand out clearly from the answers. |
| **Quiz Options** | 14px (`text-sm`) | 16px (`text-base`) | Better click targets and readability for long sentences. |
| **Quiz Excerpts & Explanations** | 12px (`text-xs`) / 14px | 14px (`text-sm`) / 16px | Increases details readability while keeping distinction from main question. |
| **Input Labels & Forms** | 12px (`text-xs`) | 14px (`text-sm`) | Standards form label size for modern accessibility. |
| **AI Responses** | 12px (`text-xs`) / 14px | 14px (`text-sm`) / 16px | Academic explanations from AI must be easy to read. |
| **System Micro-labels** | 10px / 11px | 12px (`text-xs`) | Prevents text sizing under 12px for primary interfaces. |

## Alternatives Considered
- **Universal CSS global scale-up**: We considered increasing the base `font-size` on `html` / `body` or modifying the root theme. However, since the layout is highly custom and absolute measurements might be used in some sub-layouts, a universal scale-up could break mobile UI spacing. Target changes via Tailwind utility classes is safer and more precise.
