# Quickstart Guide: KTCT-Easy

Follow these instructions to run the "Kinh Tế Chính Trị Easy" application.

## 1. Install Dependencies
Run the following command in the project root to install Tailwind CSS, Recharts, Lucide React, and Google Gen AI SDK:

```bash
npm install recharts lucide-react @google/genai
npm install -D tailwindcss @tailwindcss/vite
```

## 2. Configure Tailwind CSS
Update your `vite.config.js` to include the Tailwind Vite plugin:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

Add the Tailwind imports to `src/index.css`:

```css
@import "tailwindcss";
```

## 3. Launch Development Server
```bash
npm run dev
```
Open `http://localhost:5173` to see the application.
