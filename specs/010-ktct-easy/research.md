# Research: KTCT-Easy Next Features

## Decision 1: One Tool Per Chapter

**Decision**: Implement one focused interactive tool for each of the 6 textbook chapters.

**Rationale**: The app already has reading and quiz flows. Chapter tools should help users apply theory, not repeat the textbook. One tool per chapter keeps the navigation understandable.

**Alternatives considered**:

- Large dashboard with all concepts mixed together: rejected because users already reported the salary feature was hard to understand.
- Pure reading pages: rejected because the app goal is interactive learning.

## Decision 2: Salary Calculator Uses Deterministic Math First

**Decision**: The salary analyzer calculates wage/hour, minimum wage comparison, living-cost gap, and surplus-value explanation locally. AI only classifies job category and helps explain.

**Rationale**: Numeric conclusions must be repeatable and inspectable. AI can assist language and classification but should not invent or override calculations.

**Alternatives considered**:

- Full AI salary analysis: rejected because AI may hallucinate market rates or living costs.
- Fixed job presets: rejected because users need to enter real jobs and real wages.

## Decision 3: No Fake Province Living-Cost Defaults

**Decision**: Province/city selection infers wage region only. Living cost must come from user input or a future imported official dataset.

**Rationale**: Hard-coded living-cost numbers such as "Hà Nội 5.2m" look authoritative but were not sourced. The app must not present unsourced numbers as data.

**Alternatives considered**:

- Keep rough city defaults: rejected because the user explicitly requested data gốc, not guessed values.
- Ask AI to estimate city costs: rejected because AI estimates are not official data.

## Decision 4: Input Sanity Warnings Are Allowed

**Decision**: Add warnings for unlikely inputs, such as Hà Nội living cost below a practical threshold, day/month over 31, hour/day too high, or wage/hour extremely low.

**Rationale**: These warnings do not claim to be official data. They prevent obviously broken user input from producing misleading conclusions.

**Alternatives considered**:

- Block all low city living-cost values: rejected because some users may be subsidized by family, dormitory, employer meals, or free housing.
- No validation: rejected because the user wants unrealistic values flagged.

## Decision 5: AI Runs Inline With Context

> **Current implementation note:** the primary quiz in `App.tsx` currently opens the main AI chat view with bounded quiz context. Inline AI exists in `FlexibleQuizBuilder.tsx` but is not wired into the primary flow yet.

**Decision**: Thay Nam AI should appear inline under quiz answers or calculator results, using the current question/result and curriculum excerpt as context.

**Rationale**: Switching pages breaks the study flow. Inline context also helps ensure AI answers the specific question.

**Alternatives considered**:

- One global chat page only: rejected because it loses task context.
- AI always visible: rejected because it makes the interface busy.

## Decision 6: Teaching Scenarios Must Be Labeled

**Decision**: Market, monopoly, and integration scenarios may use synthetic teaching data only if labeled as examples.

**Rationale**: Chapter 2/4/5/6 tools need interactivity. Synthetic examples are acceptable for learning, but not as real economic claims.

**Alternatives considered**:

- Fetch live data: rejected for this project because data source, freshness, and Vercel/network reliability would add complexity.
- Use unsourced numbers: rejected.
