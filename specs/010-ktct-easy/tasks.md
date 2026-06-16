# Nhiệm vụ: Kinh Tế Chính Trị Easy (KTCT-Easy)

**Đầu vào**: Hồ sơ thiết kế từ `/specs/010-ktct-easy/`

**Điều kiện tiên quyết**: plan.md (bắt buộc), spec.md (bắt buộc cho câu chuyện người dùng), research.md, data-model.md

---

## Quy tắc định dạng: `[ID] [P?] [Story] Mô tả`

- **[P]**: Có thể thực hiện song song (các tệp khác nhau, không có phụ thuộc)
- **[Story]**: Thuộc câu chuyện người dùng nào (ví dụ: US1, US2, US3)
- Ghi rõ đường dẫn tệp chính xác trong phần mô tả.

---

## Giai đoạn 1: Thiết lập cấu trúc (Setup)

**Mục tiêu**: Cấu hình các gói phụ thuộc và môi trường chạy dự án.

- [x] T001 Cài đặt các thư viện `recharts`, `lucide-react`, `@google/genai` và Tailwind CSS v4 trong package.json
- [x] T002 Cấu hình plugin `@tailwindcss/vite` trong tệp vite.config.js
- [x] T003 Nhập Tailwind CSS trong tệp src/index.css và thiết lập màu nền tối
- [x] T004 Tạo tệp dữ liệu public/economy_data.json chứa dữ liệu mẫu chuẩn của Việt Nam
- [x] T005 Tạo tệp cấu hình môi trường .env chứa mã VITE_GEMINI_API_KEY

---

## Giai đoạn 2: Cơ sở nền tảng (Foundational)

**Mục tiêu**: Thiết lập cấu trúc khung điều hướng SPA cốt lõi.

- [x] T006 Thiết lập Sidebar điều hướng cố định bên trái và quản lý chuyển trang bằng state `currentPage` trong tệp src/App.jsx

---

## Giai đoạn 3: User Story 1 - Bảng điều khiển tổng quan (US1) 🎯 MVP

**Mục tiêu**: Hiển thị số liệu tổng quan kinh tế và liên kết chuyển trang.

- [x] T007 [US1] Xây dựng giao diện Stats Cards và 5 thẻ chức năng chuyển trang tương tác trong tệp src/App.jsx

---

## Giai đoạn 4: User Story 2 - Phân tích tiền lương & Đổi đồ (US2)

**Mục tiêu**: Lựa chọn công việc, phân tích thời gian thặng dư và tính quy đổi đồ dùng.

- [x] T008 [US2] Triển khai giao diện chọn công việc từ economy_data.json trong tệp src/App.jsx
- [x] T009 [US2] Vẽ thanh tiến trình Progress Bar chia ngày làm 8 tiếng (tất yếu vs thặng dư) và tỷ suất m' trong tệp src/App.jsx
- [x] T010 [US2] Xây dựng máy tính quy đổi thặng dư ra trà sữa, vé xem phim theo số tháng tích lũy trong tệp src/App.jsx

---

## Giai đoạn 5: User Story 3 - Trợ lý AI Các Mác (US3)

**Mục tiêu**: Gọi API Gemini phân tích nỗi đau đi làm của Gen Z.

- [x] T011 [US3] Thiết lập giao diện trò chuyện chatbox gửi tâm sự đi làm trong tệp src/App.jsx
- [x] T012 [US3] Triển khai logic gọi Gemini API với prompt systemInstruction và hiển thị câu trả lời trong tệp src/App.jsx

---

## Giai đoạn 6: User Story 4 - Giải mã biến động thị trường (US4)

**Mục tiêu**: Vẽ biểu đồ Recharts chênh lệch Giá cả và Giá trị.

- [x] T013 [US4] Tích hợp Recharts Line Chart vẽ đường Giá trị gốc và Giá cả thực tế cho các sự kiện cung cầu trong tệp src/App.jsx

---

## Giai đoạn 7: User Story 5 - Thử thách làm sếp (US5)

**Mục tiêu**: Mini-quiz trắc nghiệm tình huống đạo đức kinh doanh.

- [x] T014 [US5] Thiết lập trắc nghiệm tình huống kinh doanh và 3 thanh trạng thái động (Lợi nhuận, Cạnh tranh, Xã hội) trong tệp src/App.jsx

---

## Giai đoạn 8: User Story 6 - Bản đồ thành phần kinh tế (US6)

**Mục tiêu**: Biểu đồ tròn Recharts Pie Chart thể hiện các khối kinh tế Việt Nam.

- [x] T015 [US6] Tích hợp Recharts Pie Chart hiển thị tỷ lệ đóng góp GDP và vai trò hiến định của các khối kinh tế trong tệp src/App.jsx

---

## Giai đoạn cuối: Hoàn thiện (Polish)

**Mục tiêu**: Tối ưu hóa UI/UX và kiểm thử hoàn chỉnh.

- [x] T016 Chạy build ứng dụng `npm run build` để kiểm tra lỗi cú pháp và đóng gói
- [x] T017 Điều chỉnh thiết kế responsive và hoàn thiện hiệu ứng chuyển trang trong tệp src/App.jsx
