# Research: KTCT-Easy Technology Stack & Integration

## 1. Tailwind CSS Integration
- **Decision**: Use Tailwind CSS v4 (latest standard for Vite 8).
- **Rationale**: Vite 8 supports the official `@tailwindcss/vite` plugin which configures Tailwind directly via CSS imports, eliminating the need for a separate `tailwind.config.js`.
- **Implementation**:
  - Install `@tailwindcss/vite` and `tailwindcss` as dev dependencies.
  - Add the Tailwind plugin in `vite.config.js`:
    ```javascript
    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'
    import tailwindcss from '@tailwindcss/vite'

    export default defineConfig({
      plugins: [react(), tailwindcss()],
    })
    ```
  - Import Tailwind in `src/index.css`:
    ```css
    @import "tailwindcss";
    ```

## 2. Recharts & Lucide React
- **Decision**: Install `recharts` and `lucide-react` for rich data visualization and high-quality iconography.
- **Rationale**: Recharts provides excellent, responsive charting components (LineChart, PieChart, Tooltips) that render client-side from React state. Lucide React provides modern SVG icons that match the premium dark mode aesthetic.

## 3. Google Gemini AI Integration
- **Decision**: Use the official `@google/genai` SDK (version `^1.39.0` for consistency with `my-mln-learning`) or direct native Fetch API calls to Gemini API.
- **Rationale**: Using the SDK makes the API calls very simple, but we must read the API Key from `import.meta.env.VITE_GEMINI_API_KEY` securely.
- **System Instruction**: Force the model to adopt the persona of a Marxist Economic Consultant who explains exploitation rate ($m'$), necessary labor time, and surplus labor time using modern Vietnamese teen slang.

## 4. economy_data.json Structure
- **Decision**: Design a single structured JSON file containing all data models representing actual Vietnamese market wages, sectors, and scenarios.
