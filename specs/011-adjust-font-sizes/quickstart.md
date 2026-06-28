# Quickstart: Typography Adjustments

To get started with verifying or working on the typography changes:

## Prerequisites

- Node.js (v18+)
- Package dependencies installed:
  ```bash
  npm install
  ```

## Development Server

Start the local development server to preview the typography scale:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Verification Checklist

1. Navigate to **Tự Học**:
   - Check if chapter content text is readable and sized at `text-base` (16px).
   - Click "Đọc chi tiết" and verify detailed paragraphs.
2. Select **Luyện trắc nghiệm**:
   - Verify prompt is `text-lg` or `text-xl`.
   - Verify options are `text-base` and easy to tap/click.
   - Answer a question and inspect the explanation text and context excerpt.
3. Open **Tính Lương**:
   - Check if form labels are `text-sm`.
   - Verify surplus calculations block (`v`, `t`, `t'`, `m'`) displays text clearly.
4. Input a question to **Thầy Nam AI** and verify response font sizing.
5. Resize the browser to mobile viewport (e.g. 375px) using DevTools to ensure no layout breakages.

## Production Build

Compile the production bundle to verify output compatibility:

```bash
npm run build
```
