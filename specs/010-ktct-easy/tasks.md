# Tasks: KTCT-Easy 6 Chapter Tools

**Input:** `specs/010-ktct-easy/spec.md`, `plan.md`, `data-model.md`, `contracts/ui-contracts.md`  
**Goal:** triển khai 6 công cụ theo 6 chương, quiz lẻ, Thầy Nam AI inline, và sửa Chương 3 theo chính sách dữ liệu thật.

> File này là checklist triển khai. Trước khi làm tiếp task còn mở, đối chiếu thêm `implementation-status.md` để biết trạng thái code thực tế.

## Phase 1: Shared Foundations

- [X] T001 [P] Duy trì `src/lib/ai.ts` với helper gọi Gemini theo thứ tự `VITE_GEMINI_API_KEY`, `VITE_GEMINI_API_KEY1`, `VITE_GEMINI_API_KEY2` và cooldown khi gặp 429.
- [X] T002 [P] Trong `src/lib/ai.ts`, đảm bảo không log/hiển thị API key và trả về typed result cho success/error.
- [X] T003 [P] Tạo `src/lib/curriculum.ts` để đọc/tìm chương, section, excerpt liên quan từ dữ liệu giáo trình.
- [X] T004 [P] Tạo `src/lib/quiz.ts` để lọc câu theo chương, random không trùng, cap số câu theo số có sẵn.
- [X] T005 [P] Tạo `src/lib/dataSourcePolicy.ts` để phân loại dữ liệu: `official`, `user_entered`, `teaching_example`, `missing`.
- [X] T006 [P] Tạo `src/lib/chapterToolTypes.ts` chứa types dùng chung cho chapter tools.
- [X] T007 Cập nhật `.env.example` hoặc tài liệu env để có đủ ba biến `VITE_GEMINI_API_KEY`, `VITE_GEMINI_API_KEY1`, `VITE_GEMINI_API_KEY2`.

## Phase 2: Chapter 3 Salary/Surplus Analyzer

- [X] T008 Tạo `src/lib/salaryValidation.ts` với validation cho lương, giờ/ngày, ngày/tháng, chi phí sống, trợ cấp.
- [X] T009 Trong `salaryValidation.ts`, thêm cảnh báo chi phí sống quá thấp dựa trên mốc lương tối thiểu vùng theo tổng giờ user nhập, không tự bịa mức sống tỉnh/thành.
- [X] T010 Refactor `src/components/SalaryCalculatorPanel.tsx` hoặc tách sang `src/components/chapter-tools/Chapter3SalarySurplusTool.tsx`.
- [X] T011 Bỏ mọi hard-code mức sống theo tỉnh/thành trong Chương 3.
- [X] T012 Giữ tỉnh/thành chỉ để suy ra vùng lương tối thiểu nếu có dữ liệu nguồn.
- [X] T013 Bắt user nhập chi phí sống nếu chưa có `official_living_cost_data.json` có nguồn thật.
- [X] T014 Sửa UI kết quả Chương 3 thành các card dễ hiểu: chủ trả, bạn cần để sống, kết luận, cần kiểm tra lại.
- [X] T015 Đưa công thức `v`, `m`, `m'`, lao động tất yếu/thặng dư vào phần chi tiết mở rộng.
- [X] T016 Xóa control thừa không phục vụ logic, ví dụ toggle AI/công nghệ trong mô phỏng thặng dư.
- [X] T017 Đảm bảo AI phân loại nghề chỉ là phụ trợ; phép tính chính vẫn chạy local khi AI lỗi.

## Phase 3: Flexible Quiz

- [X] T018 Tạo hoặc chuẩn hóa `public/quiz_questions.json` với schema: `id`, `chapterId`, `prompt`, 4 options, `correctOptionId`, `explanation`, `contextExcerpt`.
- [X] T019 Bổ sung dữ liệu hướng tới khoảng 40 câu mỗi chương, hoặc ghi rõ chương nào chưa đủ câu.
- [X] T020 Tạo `src/components/FlexibleQuizBuilder.tsx`.
- [X] T021 Cho phép chọn 1 chương, nhiều chương hoặc tất cả chương.
- [X] T022 Cho phép chọn số câu 5, 10, 20, 40 hoặc custom trong giới hạn.
- [X] T023 Khi số câu yêu cầu lớn hơn số có sẵn, tự giảm và hiển thị thông báo.
- [X] T024 Sau khi trả lời, hiển thị đúng/sai, đáp án đúng, giải thích và excerpt giáo trình.

## Phase 4: Inline Thầy Nam AI

- [X] T025 Tạo `src/components/InlineThayNamAI.tsx`.
- [X] T026 Tích hợp inline AI dưới kết quả quiz, không chuyển trang.
- [X] T027 Tích hợp inline AI dưới kết quả Chương 3.
- [X] T028 Prompt inline AI phải gửi đúng context: chương, câu hỏi/kết quả, đáp án user, đáp án đúng nếu có, giải thích, excerpt.
- [X] T029 Nếu cả ba Gemini key lỗi, giữ nguyên kết quả local và báo lỗi thân thiện.

## Phase 5: Chapter 1 Tool

- [X] T030 Tạo `src/components/chapter-tools/Chapter1MethodMap.tsx`.
- [X] T031 Thêm node: đối tượng nghiên cứu, trừu tượng hóa khoa học, chức năng nhận thức, thực tiễn, phương pháp luận, giáo dục.
- [X] T032 Mỗi node hiển thị giải thích ngắn, ví dụ, câu hỏi ôn nhanh.
- [X] T033 Kết nối dữ liệu Chương 1 từ curriculum helper.

## Phase 6: Chapter 2 Tool

- [X] T034 Tạo `src/components/chapter-tools/Chapter2CommodityMarketLab.tsx`.
- [X] T035 Tạo/chuẩn hóa scenario học tập trong `public/chapter_tool_scenarios.json`.
- [X] T036 Gắn nhãn rõ các số mô phỏng là "ví dụ học tập".
- [X] T037 Thêm controls cung/cầu và output giải thích giá trị, giá cả, tiền tệ, quy luật giá trị.

## Phase 7: Chapter 4 Tool

- [X] T038 Tạo `src/components/chapter-tools/Chapter4CompetitionMonopolyLab.tsx`.
- [X] T039 Thêm selector cấu trúc thị trường và controls số doanh nghiệp, rào cản gia nhập, quyền lực định giá.
- [X] T040 Output mức cạnh tranh, nguy cơ độc quyền, tác động tới giá, người tiêu dùng, người lao động.

## Phase 8: Chapter 5 Tool

- [X] T041 Tạo `src/components/chapter-tools/Chapter5VietnamEconomyRelations.tsx`.
- [X] T042 Thêm bản đồ chủ thể: Nhà nước, tư nhân, FDI, người lao động, người tiêu dùng, hợp tác xã/cộng đồng.
- [X] T043 Thêm case chính sách/tình huống và output ai hưởng lợi, ai chịu chi phí, Nhà nước điều tiết ở đâu.
- [X] T044 Đảm bảo số liệu vĩ mô nếu có phải có source/date; nếu không thì dùng mô tả định tính.

## Phase 9: Chapter 6 Tool

- [X] T045 Tạo `src/components/chapter-tools/Chapter6ModernizationPlanner.tsx`.
- [X] T046 Cho user nhập/chọn ngành/nghề, mức công nghệ, mục tiêu kỹ năng, mức hội nhập.
- [X] T047 Output liên hệ công nghiệp hóa, công nghệ/kỹ năng, cơ hội hội nhập, rủi ro phụ thuộc.
- [X] T048 Nếu dùng AI để viết reflection, ghi rõ là gợi ý học tập.

## Phase 10: App Integration

- [X] T049 Gắn 6 chapter tools vào navigation/trang học hiện có trong `src/App.tsx`.
- [X] T050 Đảm bảo layout nội dung chiếm đủ chiều ngang desktop và không tràn mobile.
- [X] T051 Bỏ các đoạn mô tả dư thừa khiến UI khó hiểu; chỉ giữ hướng dẫn ngắn tại đúng chỗ.
- [X] T052 Đảm bảo công thức/giải thích học thuật nằm sau phần kết luận dễ hiểu.

## Phase 11: Verification

- [X] T053 Chạy `npx tsc -p tsconfig.app.json --noEmit`.
- [X] T054 Chạy `npx vite build --outDir verify_ktct_easy`.
- [ ] T055 Manual test Chương 3: thiếu chi phí sống, Hà Nội + 3.000.000đ, giờ/ngày 25, ngày/tháng 40.
- [ ] T056 Manual test quiz: Chương 2 + 10 câu, request 40 câu khi dữ liệu không đủ.
- [ ] T057 Manual test AI: key chính sai/quota, key phụ 1/quota, key phụ 2 đúng; tất cả key lỗi; kiểm tra cooldown 429 không gọi lặp key đang chờ.
- [ ] T058 Manual test desktop/mobile: không chồng card, không mất chữ, không có border/container thừa.
