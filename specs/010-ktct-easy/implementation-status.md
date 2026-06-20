# Trạng Thái Triển Khai Thực Tế

**Ngày quét:** 2026-06-20  
**Phạm vi:** code và dữ liệu hiện có trong workspace. File này mô tả trạng thái thực tế sau đợt triển khai `$speckit-implement`, không thay thế mục tiêu trong `spec.md`.

## Đã Có Trong App

| Nhóm | Trạng thái |
|---|---|
| Tự học giáo trình | Đã có tab tóm tắt giáo trình, danh sách 6 chương, 6 mục chính mỗi chương và phần đọc chi tiết toàn chiều ngang bên dưới. |
| Trắc nghiệm cũ | Đang giữ nguyên để không phá luồng học hiện có. |
| Quiz lẻ | Đã thêm tab "Ôn luyện tự chọn": chọn chương, chọn số câu, tự giảm số câu nếu dữ liệu không đủ, chấm đúng/sai và hiện giải thích. |
| Thầy Nam AI inline | Đã có khung hỏi ngay dưới kết quả quiz/kết quả Chương 3, không chuyển trang. Prompt gửi context ngắn: chương, câu hỏi, đáp án user, đáp án đúng, giải thích và excerpt. |
| API Gemini dự phòng | `src/lib/ai.ts` dùng lần lượt `VITE_GEMINI_API_KEY`, `VITE_GEMINI_API_KEY1`, `VITE_GEMINI_API_KEY2`, có cooldown khi gặp 429. |
| Công cụ 6 chương | Đã thêm tab "Công cụ chương" trong Tự học, chọn Chương 1-6 và render từng tool tương ứng. |
| Chương 3 tính lương/thặng dư | App chính vẫn dùng `SalaryCalculatorPanel`; AI phân loại nghề đã chuyển sang helper 3 key chung. |

## Dữ Liệu Đang Dùng

| File | Nội dung |
|---|---|
| `public/curriculum_chapter_lessons.json` | Dữ liệu tóm tắt và nội dung đọc cho 6 chương. |
| `public/curriculum_knowledge.json` | Bộ câu hỏi/schema cũ dùng cho luồng trắc nghiệm cũ. |
| `public/quiz_questions.json` | Bộ câu hỏi schema mới cho quiz lẻ: `chapterId`, `prompt`, options, đáp án đúng, giải thích, context excerpt. |
| `public/wage_regions.json` | Dữ liệu vùng lương tối thiểu và ánh xạ tỉnh/thành. |
| `public/chapter_tool_scenarios.json` | Scenario học tập cho một số công cụ chương. |

- Đã tách `ChapterSyllabusPanel` và `SectionDetailPanel` làm 2 component độc lập ngang hàng và tràn ngang màn hình (Desktop) bên dưới danh sách chương.
- Đã sửa lỗi API key bằng cơ chế tự xoay vòng API key thông minh (askThayNamAI).
- Đã thêm chatbot tại chỗ `InlineQuizChat` dưới phần giải thích khi người dùng ấn nút "Hỏi Thầy Nam AI thêm câu này".
- `npx tsc -p tsconfig.app.json --noEmit` & `npx vite build`: Đã kiểm tra và chạy thành công, không còn lỗi biên dịch.

## Gợi Ý Bước Tiếp Theo

1. Đã hoàn thành toàn bộ yêu cầu, kiểm thử UI trên các trình duyệt desktop/mobile thực tế.
2. Xác nhận và nghiệm thu tính năng ôn luyện trắc nghiệm kèm trợ lý AI tại chỗ và giao diện tự học tối ưu.
