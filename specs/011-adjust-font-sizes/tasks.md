# Tasks: Adjust Font Sizes

**Input**: Design documents from `/specs/011-adjust-font-sizes/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/ui-contracts.md

**Tests**: N/A (Manual layout verification and production builds are used)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Verify project environment is ready for styling changes

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Verify local dev server compiles and runs without issues using npm run dev

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Tăng cỡ chữ phần đọc lý thuyết chính (Curriculum Reading) (Priority: P1) 🎯 MVP

**Goal**: Increase font size of curriculum summary and textbook paragraphs to text-base / text-lg with leading-relaxed.

**Independent Test**: Go to tab "Tự Học" and check if font sizes are readable.

### Implementation for User Story 1

- [x] T003 [P] [US1] Increase chapter outline metadata text and header titles font sizes in src/components/CurriculumReadingPanel.tsx
- [x] T004 [P] [US1] Scale detailed textbook paragraph text and source labels font sizes in src/components/CurriculumReadingPanel.tsx
- [x] T005 [P] [US1] Scale the summary paragraph and details textbook content font sizes in src/components/SectionDetailPanel.tsx
- [x] T006 [P] [US1] Scale the fallback chapter description and intro font sizes in src/components/ChapterSyllabusPanel.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Cải thiện độ hiển thị của bộ câu hỏi trắc nghiệm (Quiz) (Priority: P1)

**Goal**: Increase question prompts to text-lg/text-xl, option choices to text-base, and explanations to text-base.

**Independent Test**: Start a quiz session and verify font size readability of questions, options, explanations, and excerpts.

### Implementation for User Story 2

- [x] T007 [P] [US2] Scale question prompts and available count warning text sizes in src/components/FlexibleQuizBuilder.tsx
- [x] T008 [P] [US2] Scale option selection button labels text size to text-base in src/components/FlexibleQuizBuilder.tsx
- [x] T009 [P] [US2] Scale question explanation and context excerpt text sizes in src/components/FlexibleQuizBuilder.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Đồng bộ cỡ chữ các nhãn và giải thích ở các công cụ chương (Chapter Tools) (Priority: P2)

**Goal**: Scale up inputs, labels, AI feedback blocks, and surplus calculations text sizes.

**Independent Test**: Open salary calculator tool and check label sizing. Ask Thay Nam AI in the inline panel and verify response sizing.

### Implementation for User Story 3

- [x] T010 [P] [US3] Scale form input labels, regions, and info box text sizes in src/components/SalaryCalculatorPanel.tsx
- [x] T011 [P] [US3] Scale formulas (v, t, t', m') definitions and output results text sizes in src/components/SalaryCalculatorPanel.tsx
- [x] T012 [P] [US3] Scale input labels, placeholder and analysis section text sizes in src/components/chapter-tools/Chapter3SalarySurplusTool.tsx
- [x] T013 [P] [US3] Scale AI response text, tags, suggestions, and form buttons in src/components/InlineThayNamAI.tsx

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T014 Run TypeScript compiler verify: npx tsc -p tsconfig.app.json --noEmit
- [x] T015 Verify build compilation: npx vite build --outDir verify_font_adjustments
- [x] T016 [P] Verify layout responsiveness on mobile viewport widths (360px)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P2)**: Can start after Foundational (Phase 2)

---

## Parallel Example: User Story 1

```bash
# Launch parallel implementation of reading panels changes:
Task: "Scale detailed textbook paragraph text and source labels font sizes in src/components/CurriculumReadingPanel.tsx"
Task: "Scale the summary paragraph and details textbook content font sizes in src/components/SectionDetailPanel.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently (MVP!)
3. Add User Story 2 → Test independently
4. Add User Story 3 → Test independently
5. Polish layout and verify mobile rendering
