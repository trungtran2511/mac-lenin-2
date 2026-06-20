# Quickstart: Read Before Implementing Next Features

## 1. Run The App

```powershell
npm install
npm run dev
```

Open the local Vite URL, usually `http://localhost:5173`.

## 2. Current Code Status

Read [implementation-status.md](implementation-status.md) before changing a feature. It lists which flows are actually connected to `App.tsx` and which components are present but unused.

## 3. Required Quality Gates

Run before handing off any feature:

```powershell
npx tsc -p tsconfig.app.json --noEmit
npx vite build --outDir verify_next_feature
```

## 4. Implementation Order

1. Extract shared helpers: AI, curriculum, quiz, data-source policy.
2. Keep the three-key Gemini fallback: `VITE_GEMINI_API_KEY`, `VITE_GEMINI_API_KEY1`, `VITE_GEMINI_API_KEY2`.
3. Add shared validation helper for salary/living-cost input.
4. Stabilize Chapter 3 salary analyzer.
5. Add flexible custom quiz builder.
6. Add inline Thay Nam AI context panels.
7. Add Chapter 1 method map.
8. Add Chapter 2 commodity/market lab.
9. Add Chapter 4 competition/monopoly lab.
10. Add Chapter 5 Vietnam economy relation map.
11. Add Chapter 6 industrialization/integration planner.

## 5. Salary Analyzer Manual Checks

Use these cases after any Chapter 3 change:

### Case A: Missing Living Cost

- Province: Hà Nội
- Salary: 3,000,000
- Hours/day: 4
- Days/month: 26
- Living cost: empty

Expected:

- Shows warning asking for living cost.
- Does not claim enough/not enough to live.

### Case B: Unrealistic Hanoi Living Cost

- Province: Hà Nội
- Salary: 3,000,000
- Hours/day: 4
- Days/month: 26
- Living cost: 3,000,000

Expected:

- Warns this is very low for Hà Nội unless housing/food/transport is covered.
- Analysis says result may be lighter than reality if costs are missing.

### Case C: Invalid Time

- Hours/day: 25
- Days/month: 40

Expected:

- Blocks AI analysis.
- Shows clear warnings.

## 6. Data Source Rules

Before adding any number that looks like real economic data, answer:

- Where did this number come from?
- What year is it?
- Is it official, user-entered, or a teaching example?
- Is the UI labeling it correctly?

If the answer is unclear, do not add the number.

## 7. AI Rules

AI can:

- classify job category
- explain concepts
- answer quiz follow-up
- draft study guidance

AI cannot:

- invent official province living-cost data
- override deterministic salary calculations
- return unparsed arbitrary text where JSON is expected

AI key fallback in `src/lib/ai.ts`:

- `VITE_GEMINI_API_KEY` is the primary key.
- `VITE_GEMINI_API_KEY1` and `VITE_GEMINI_API_KEY2` are fallback keys.
- A 429 quota response puts that key in a per-session cooldown using Gemini's retry delay.
- Test with one invalid/quota-limited key and a later working key; the chat should still answer.
- Note: `SalaryCalculatorPanel.tsx` still has a separate AI call and does not yet use this shared fallback.

## 8. UI Rules

- Keep the first result readable without knowing symbols `m`, `m'`, `v`.
- Put formulas behind details/secondary sections.
- Avoid decorative controls that do not change useful learning output.
- Every warning should tell the user what to fix.

## 9. Done Definition

A feature is ready when:

- It matches the chapter concept.
- It uses sourced/static/user-entered data correctly.
- It has clear empty, invalid, loading, success, and AI-failure states.
- It passes TypeScript and build checks.
- It is readable on desktop and mobile.
