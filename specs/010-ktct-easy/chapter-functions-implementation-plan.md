# Handoff Plan: 6 Chức Năng Theo 6 Chương KTCT-Easy

Tài liệu này dùng để giao cho AI/coder khác triển khai. Đọc theo thứ tự:

1. [spec.md](spec.md)
2. [plan.md](plan.md)
3. [data-model.md](data-model.md)
4. [contracts/ui-contracts.md](contracts/ui-contracts.md)
5. [tasks.md](tasks.md)

> Trước khi làm, đọc [implementation-status.md](implementation-status.md) để phân biệt phần đã gắn vào `App.tsx` với component mới chỉ có file.

## Luật Bất Biến

- Mỗi chương có đúng 1 công cụ chính.
- UI giải thích bằng tiếng Việt dễ hiểu trước; công thức để phía sau.
- Không bịa dữ liệu kinh tế thật.
- Chương 3 không được bịa mức sống theo tỉnh/thành.
- Nếu không có dataset gốc về mức sống, bắt người dùng nhập chi phí sống.
- Thầy Nam AI chạy inline dưới câu hỏi/kết quả, không chuyển trang.
- Quiz lẻ cho phép chọn chương và số câu.
- AI chỉ giải thích/phân loại; phép tính quan trọng chạy local.
- Gemini dùng `VITE_GEMINI_API_KEY`, nếu lỗi phù hợp thì thử lần lượt `VITE_GEMINI_API_KEY1` và `VITE_GEMINI_API_KEY2`.
- Không log hoặc hiển thị API key.

## Kiến Trúc Mong Muốn

```text
src/components/
|-- InlineThayNamAI.tsx
|-- FlexibleQuizBuilder.tsx
`-- chapter-tools/
    |-- Chapter1MethodMap.tsx
    |-- Chapter2CommodityMarketLab.tsx
    |-- Chapter3SalarySurplusTool.tsx
    |-- Chapter4CompetitionMonopolyLab.tsx
    |-- Chapter5VietnamEconomyRelations.tsx
    `-- Chapter6ModernizationPlanner.tsx
```

```text
src/lib/
|-- ai.ts
|-- curriculum.ts
|-- quiz.ts
|-- salaryValidation.ts
|-- dataSourcePolicy.ts
`-- chapterToolTypes.ts
```

```text
public/
|-- curriculum_chapter_lessons.json
|-- curriculum_knowledge.json
|-- curriculum_search_index.json
|-- quiz_questions.json
|-- chapter_tool_scenarios.json
|-- wage_regions.json
`-- official_living_cost_data.json  # chỉ tạo khi có nguồn thật
```

## Chương 1 - Bản Đồ Phương Pháp Và Chức Năng

**Mục tiêu**: giúp người học hiểu Chương 1 qua sơ đồ ngắn thay vì đoạn lý thuyết dài.

**Input**

- Click vào khái niệm.

**UI**

- Cột trái: danh sách node khái niệm.
- Cột phải: nội dung node đang chọn.
- Mỗi node có: giải thích 3-5 dòng, ví dụ đời thường, câu hỏi kiểm tra nhanh.

**Node bắt buộc**

- Đối tượng nghiên cứu.
- Phương pháp trừu tượng hóa khoa học.
- Chức năng nhận thức.
- Chức năng thực tiễn.
- Chức năng phương pháp luận.
- Chức năng giáo dục.

**Output**

- Kết luận ngắn.
- Giải thích theo giáo trình.
- Ví dụ.
- Mini quiz.

**Data**

- Chỉ dùng giáo trình/curriculum JSON.

**Done khi**

- Click từng node đổi nội dung đúng.
- Không có wall-of-text dài ngay màn đầu.

## Chương 2 - Lab Hàng Hóa, Tiền Tệ, Thị Trường

**Mục tiêu**: cho thấy giá cả thị trường dao động quanh giá trị do cung - cầu, cạnh tranh và tiền tệ.

**Input**

- Chọn scenario học tập.
- Slider cung/cầu đơn giản.

**UI**

- Một vùng điều khiển nhỏ.
- Một bảng hoặc biểu đồ gọn:
  - Giá trị/hao phí lao động.
  - Cung - cầu.
  - Giá cả thị trường.
- Nhãn rõ: "Ví dụ học tập".

**Output**

- Vì sao giá tăng/giảm.
- Liên hệ: hàng hóa, giá trị, giá cả, tiền tệ, quy luật giá trị.

**Data**

- Scenario mô phỏng trong `chapter_tool_scenarios.json`.
- Không dùng số thị trường thật nếu thiếu nguồn/date.

**Done khi**

- Tăng cầu trong khi cung thấp làm kết luận giá tăng.
- UI không gọi scenario là dữ liệu thực tế.

## Chương 3 - Lương, Sức Lao Động, Giá Trị Thặng Dư

**Mục tiêu**: người dùng nhập công việc thật để biết lương có đủ tái tạo sức lao động không và hiểu thặng dư.

**Input**

- Tên công việc.
- Tỉnh/thành.
- Lương tháng.
- Giờ/ngày.
- Ngày/tháng.
- Chi phí sống/tháng.
- Trợ cấp gia đình hoặc hỗ trợ khác.

**UI phải đơn giản**

- Không dùng công việc cố định.
- Không có toggle công nghệ/AI nếu không phục vụ logic.
- Kết quả đầu:
  - Chủ trả cho bạn.
  - Bạn cần để sống.
  - Kết luận.
  - Cảnh báo cần kiểm tra.
- Phân tích sâu:
  - Lương/giờ.
  - So với sàn vùng.
  - So với khoảng nghề nếu có.
  - Lao động tất yếu/thặng dư.
  - Công thức `m`, `m'` đặt trong phần mở rộng.

**Validation bắt buộc**

- Chi phí sống trống: chặn kết luận đủ/không đủ sống.
- Hà Nội/TP.HCM/đô thị lớn + chi phí sống quá thấp: cảnh báo.
- Ngày/tháng > 31: invalid.
- Giờ/ngày > 24: invalid.
- Giờ/ngày > 16: warning.
- Lương/giờ quá thấp: warning.
- Dữ liệu âm hoặc bằng 0: invalid.

**Data**

- Tỉnh/thành chỉ suy ra vùng lương nếu có `wage_regions.json` có nguồn/date.
- Không hard-code "Hà Nội = X triệu".
- `official_living_cost_data.json` chỉ được thêm khi có dataset gốc.

**AI**

- AI phân loại nhóm nghề.
- AI giải thích kết quả bằng ngôn ngữ dễ hiểu.
- AI không tự sinh mức sống tỉnh.

**Done khi**

- Hà Nội + chi phí sống 3.000.000đ hiện cảnh báo vô lý/cần kiểm tra.
- Thiếu chi phí sống không hiện kết luận đủ sống.
- AI lỗi vẫn tính local được.

## Chương 4 - Lab Cạnh Tranh Và Độc Quyền

**Mục tiêu**: mô phỏng cạnh tranh, tập trung sản xuất, độc quyền và quyền lực thị trường.

**Input**

- Cấu trúc thị trường.
- Số doanh nghiệp.
- Rào cản gia nhập.
- Quyền lực định giá.

**Output**

- Mức cạnh tranh.
- Nguy cơ độc quyền.
- Ảnh hưởng tới giá.
- Ảnh hưởng tới người tiêu dùng.
- Ảnh hưởng tới người lao động.
- Liên hệ Chương 4.

**Data**

- Chỉ số 0-100 là mô phỏng.
- Case thật cần nguồn.

**Done khi**

- Ít doanh nghiệp + rào cản cao -> quyền lực thị trường tăng.

## Chương 5 - Bản Đồ Quan Hệ Lợi Ích Kinh Tế Việt Nam

**Mục tiêu**: giải thích kinh tế thị trường định hướng XHCN qua các chủ thể và quan hệ lợi ích.

**Input**

- Chọn case/chính sách.

**Chủ thể**

- Nhà nước.
- Doanh nghiệp tư nhân.
- FDI.
- Người lao động.
- Người tiêu dùng.
- Hợp tác xã/cộng đồng.

**Output**

- Ai hưởng lợi?
- Ai chịu chi phí?
- Nhà nước điều tiết ở đâu?
- Liên hệ giáo trình.

**Data**

- Định tính là mặc định.
- Số GDP/tỷ trọng chỉ hiển thị nếu có nguồn/date.

**Done khi**

- Case "tăng lương tối thiểu" giải thích tác động tới nhiều chủ thể, không chỉ một chiều.

## Chương 6 - Planner Công Nghiệp Hóa, Hiện Đại Hóa, Hội Nhập

**Mục tiêu**: liên hệ Chương 6 với ngành/nghề của người học.

**Input**

- Ngành/nghề quan tâm.
- Mức công nghệ hiện tại.
- Mục tiêu kỹ năng.
- Mức hội nhập quốc tế.

**Output**

- Liên hệ công nghiệp hóa.
- Công nghệ/kỹ năng cần học.
- Cơ hội hội nhập.
- Rủi ro phụ thuộc bên ngoài.
- Gợi ý lộ trình học.

**AI**

- Có thể hỗ trợ viết reflection ngắn.
- Phải ghi là gợi ý học tập, không phải dự báo chắc chắn.

**Done khi**

- "Lập trình viên" liên hệ chuyển đổi số và chuỗi giá trị toàn cầu.
- "Nông nghiệp" liên hệ cơ giới hóa, logistics, xuất khẩu, tiêu chuẩn quốc tế.

## Quiz Lẻ

**Input**

- Chương: 1-6, nhiều chương hoặc tất cả.
- Số câu: 5, 10, 20, 40 hoặc custom.

**Logic**

- Lọc theo chương.
- Random không trùng trong một lượt.
- Nếu số câu yêu cầu > số câu có sẵn, tự giảm và báo.
- Chấm ngay sau khi chọn.

**Output**

- Đúng/sai.
- Đáp án đúng.
- Giải thích.
- Trích đoạn giáo trình.
- Khung Thầy Nam AI inline.

**Done khi**

- Chọn Chương 2 + 10 câu chỉ ra câu Chương 2.
- Chọn 40 nhưng chỉ có 25 câu thì báo chỉ có 25 câu khả dụng.

## Thầy Nam AI Inline

**Vị trí**

- Dưới câu quiz sau khi trả lời.
- Dưới kết quả Chương 3.
- Dưới công cụ chương nếu có câu hỏi mở.

**Context gửi cho AI**

```json
{
  "mode": "quiz_explain | salary_explain | chapter_tool_explain",
  "chapterId": 3,
  "userQuestion": "...",
  "currentStateSummary": "...",
  "curriculumContext": "...",
  "expectedFormat": "ngắn, dễ hiểu, bám giáo trình"
}
```

**Key fallback**

1. Thử `VITE_GEMINI_API_KEY`.
2. Nếu lỗi auth/quota/rate-limit/server tạm thời, thử lần lượt `VITE_GEMINI_API_KEY1`, rồi `VITE_GEMINI_API_KEY2`; khi gặp 429 phải tôn trọng cooldown trả về từ Gemini.
3. Nếu cả hai lỗi, báo lỗi thân thiện và giữ kết quả local.

## Thứ Tự Code Đề Xuất

1. Tạo shared helpers: AI, curriculum, quiz, data policy.
2. Tạo validation Chương 3.
3. Sửa Chương 3 cho đúng logic dữ liệu.
4. Tạo quiz lẻ.
5. Tạo Thầy Nam AI inline.
6. Tạo công cụ Chương 1.
7. Tạo công cụ Chương 2.
8. Tạo công cụ Chương 4.
9. Tạo công cụ Chương 5.
10. Tạo công cụ Chương 6.
11. Polish UI và kiểm thử.

## Quality Gates

```powershell
npx tsc -p tsconfig.app.json --noEmit
npx vite build --outDir verify_ktct_easy
```

Manual:

- Desktop không vỡ layout.
- Mobile không tràn chữ.
- Input rỗng có trạng thái rỗng.
- Input vô lý có cảnh báo.
- AI lỗi có fallback.
- Công thức không lấn át giải thích dễ hiểu.
