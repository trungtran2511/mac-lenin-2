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

## Việc Còn Mở

- Chương 3 đã bỏ hard-code mức sống theo tỉnh/thành. App không tự điền chi phí sống; user phải nhập hoặc sau này import dataset gốc có nguồn. Cảnh báo chi phí quá thấp hiện chỉ so với mốc lương tối thiểu vùng theo tổng giờ user nhập, không coi đó là dữ liệu mức sống chính thức.
- `Chapter1MethodMap` đã dùng helper curriculum để ưu tiên excerpt từ `curriculum_chapter_lessons.json`; nếu không tải được dữ liệu thì fallback về nội dung tĩnh.
- UI polish đã cập nhật phần Tự học: tab còn 3 lựa chọn chính, card tải PDF gọn hơn, tổng quan/chi tiết giáo trình sạch chữ, quiz lẻ đơn giản hơn và ngữ cảnh giáo trình nằm trong phần mở rộng.
- Chưa kiểm thử thủ công desktop/mobile bằng browser vì automation trong môi trường hiện tại bị chặn bởi Windows sandbox.
- Chưa chạy đủ các kịch bản manual test: Chương 3 nhập số vô lý, quiz thiếu câu, fallback 3 key Gemini, và kiểm tra UI không chồng chữ.

## Kiểm Tra Gần Nhất

- `npx tsc -p tsconfig.app.json --noEmit`: đã chạy thành công.
- `npx vite build --outDir dist-verify-remaining-features`: đã chạy thành công.
- Build có cảnh báo chunk lớn và cảnh báo import động không tách chunk trong `src/lib/ai.ts`; đây là cảnh báo tối ưu bundle, không làm fail build.

## Gợi Ý Bước Tiếp Theo

1. Chốt chính sách dữ liệu Chương 3: hoặc import dataset mức sống có nguồn, hoặc bỏ toàn bộ ngưỡng tỉnh/thành và chỉ dựa vào số user nhập.
2. Kiểm thử UI bằng trình duyệt thật trên desktop/mobile.
3. Test luân phiên 3 Gemini key với trường hợp key lỗi, key hết quota và cả 3 key lỗi.
4. Nếu cần bàn giao cho AI khác, bắt đầu từ các task còn `[ ]` trong `tasks.md`.
