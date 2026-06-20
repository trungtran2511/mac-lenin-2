# KTCT-Easy

Ứng dụng học Kinh tế chính trị Mác - Lênin bằng tóm tắt giáo trình, trắc nghiệm, Thầy Nam AI và công cụ minh họa giá trị thặng dư.

## Trạng Thái Hiện Tại

Nguồn trạng thái chính xác sau khi quét mã: [implementation-status.md](specs/010-ktct-easy/implementation-status.md).

Các luồng đã được gắn vào `src/App.tsx`:

- Tự học 6 chương: chọn chương, xem 6 mục chính, bấm để mở nội dung chi tiết toàn chiều ngang.
- Trắc nghiệm cũ theo chương từ `curriculum_knowledge.json` với 240 câu.
- Hỏi Thầy Nam AI từ một câu trắc nghiệm: gửi ngữ cảnh ngắn của đúng chương, mục, đề, đáp án và luận giải.
- Màn hình chat Thầy Nam AI và mascot chat.
- Tính lương/thặng dư tại `SalaryCalculatorPanel`.

Các component đã có file nhưng **chưa được gắn vào `App.tsx`** gồm Flexible Quiz Builder, Inline Thầy Nam AI và 6 chapter tools. Chúng không được xem là tính năng đã phát hành.

## Chạy Ứng Dụng

```powershell
npm install
npm run dev
```

Vite hiển thị URL local trong terminal, thường là `http://localhost:5173`.

## Gemini AI

App chat chính gọi trực tiếp Gemini và lần lượt dùng:

1. `VITE_GEMINI_API_KEY`
2. `VITE_GEMINI_API_KEY1`
3. `VITE_GEMINI_API_KEY2`

Khi một key trả `429`, app ghi nhớ thời gian chờ trong phiên hiện tại và bỏ qua key đó đến khi hết cooldown. Xem `.env.example` để biết tên biến.

Lưu ý: biến `VITE_*` được đưa vào bundle trình duyệt. Đây là lựa chọn hiện tại của dự án theo yêu cầu static Vercel, không phải cách giữ bí mật API key. Nếu cần bảo vệ key, chuyển lời gọi Gemini sang `api/chat.js` với biến server-side `GEMINI_API_KEY`.

## Kiểm Tra

```powershell
npx vite build --outDir dist-verify
```

`npx tsc -p tsconfig.app.json --noEmit` hiện chưa qua do các chapter tools chưa tích hợp có import không dùng và `Chapter3SalarySurplusTool.tsx` còn tham chiếu `formatMoney` chưa định nghĩa. Chi tiết nằm trong bản trạng thái triển khai.

## Tài Liệu

- [Trạng thái triển khai hiện tại](specs/010-ktct-easy/implementation-status.md)
- [Đặc tả mục tiêu](specs/010-ktct-easy/spec.md)
- [Kế hoạch triển khai](specs/010-ktct-easy/plan.md)
- [Danh sách công việc còn lại](specs/010-ktct-easy/tasks.md)
- [Hướng dẫn triển khai tiếp](specs/010-ktct-easy/quickstart.md)
