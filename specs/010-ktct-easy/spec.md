# Đặc Tả Tính Năng: KTCT-Easy 6 Công Cụ Theo 6 Chương

**Nhánh tính năng**: `010-ktct-easy`  
**Ngày cập nhật**: 2026-06-19  
**Trạng thái**: Mục tiêu sản phẩm; triển khai mới một phần  
**Nguồn nội dung chính**: `GIÁO TRÌNH FULL (1).docx` đã được bóc tách vào dữ liệu giáo trình của ứng dụng.

> **Trạng thái mã nguồn:** xem [implementation-status.md](implementation-status.md) trước khi triển khai tiếp. Đặc tả này mô tả mục tiêu; không phải mọi tiêu chí bên dưới đã có trong UI chính.

## Mục Tiêu

KTCT-Easy là ứng dụng học Kinh tế chính trị Mác - Lênin theo hướng dễ hiểu, thực hành được, không nhồi chữ. Ứng dụng cần có 6 công cụ học tương ứng 6 chương, một hệ thống quiz linh hoạt, và Thầy Nam AI chạy ngay trong ngữ cảnh người học đang cần giải thích.

Nguyên tắc quan trọng nhất: **dữ liệu nào không có nguồn thì không được trình bày như dữ liệu thật**. Với Chương 3, không được tự bịa mức sống theo tỉnh/thành. Nếu chưa import dataset gốc, ứng dụng phải bắt người dùng nhập chi phí sống và chỉ dùng số đó để phân tích.

## Người Dùng Chính

- Sinh viên ôn thi Kinh tế chính trị Mác - Lênin.
- Người học muốn hiểu lý thuyết bằng ví dụ đời sống.
- Người dùng muốn tự nhập công việc/lương để hiểu giá trị sức lao động và giá trị thặng dư.

## User Stories & Acceptance Criteria

### US1 - Học theo 6 chương bằng công cụ riêng

Là người học, tôi muốn mỗi chương có một công cụ thực hành riêng để hiểu khái niệm chính mà không phải đọc một khối lý thuyết dài.

**Acceptance**

1. Ứng dụng hiển thị đủ 6 công cụ tương ứng Chương 1 đến Chương 6.
2. Mỗi công cụ có một mục tiêu rõ, 1-3 thao tác chính, kết luận ngắn và phần giải thích chi tiết mở rộng.
3. Mỗi công cụ lấy nội dung lý luận từ dữ liệu giáo trình, không tự thêm kiến thức ngoài giáo trình nếu không ghi rõ là ví dụ học tập.

### US2 - Chương 1: Bản đồ đối tượng, phương pháp, chức năng

Là người học Chương 1, tôi muốn bấm vào từng khái niệm để hiểu đối tượng nghiên cứu, phương pháp nghiên cứu và chức năng của môn học.

**Acceptance**

1. Có các nút khái niệm: đối tượng nghiên cứu, phương pháp trừu tượng hóa khoa học, chức năng nhận thức, chức năng thực tiễn, chức năng phương pháp luận, chức năng giáo dục.
2. Khi chọn một khái niệm, app hiển thị: giải thích ngắn, ví dụ dễ hiểu, câu hỏi ôn nhanh.
3. Không hiển thị một đoạn giáo trình quá dài ngay từ đầu; chi tiết được đặt sau nút mở rộng.

### US3 - Chương 2: Lab hàng hóa, tiền tệ, thị trường

Là người học Chương 2, tôi muốn điều chỉnh một tình huống mô phỏng để thấy giá cả thị trường có thể dao động quanh giá trị.

**Acceptance**

1. Người dùng chọn hoặc chỉnh một scenario học tập.
2. App hiển thị quan hệ giữa giá trị, cung - cầu, giá cả thị trường và tiền tệ.
3. Nếu dùng số liệu mô phỏng, UI phải ghi rõ "ví dụ học tập", không nói đó là dữ liệu thị trường hiện tại.
4. Nếu dùng số liệu thật, dữ liệu phải có `sourceName`, `sourceUrl` hoặc `sourceDate`.

### US4 - Chương 3: Công cụ lương, sức lao động, giá trị thặng dư

Là người dùng, tôi muốn nhập công việc thật, lương thật, số giờ làm và chi phí sống thật để app phân tích lương có đủ tái tạo sức lao động không và giải thích giá trị thặng dư dễ hiểu.

**Acceptance**

1. Người dùng tự nhập tên công việc; app không được ép chọn 4 công việc cố định.
2. Người dùng chọn tỉnh/thành để suy ra vùng lương tối thiểu nếu có dữ liệu nguồn.
3. Tỉnh/thành không được tự động sinh chi phí sống nếu chưa có dataset gốc.
4. Nếu chi phí sống trống, app không được kết luận "đủ sống" hoặc "không đủ sống"; app phải yêu cầu nhập thêm.
5. Nếu người dùng nhập Hà Nội/TP.HCM hoặc đô thị lớn với chi phí sống quá thấp, ví dụ 3.000.000đ/tháng, app phải cảnh báo số này có thể vô lý nếu nhà ở, ăn uống, đi lại chưa được hỗ trợ.
6. Nếu giờ/ngày > 24 hoặc ngày/tháng > 31, app chặn phân tích.
7. Nếu giờ/ngày > 16, app cảnh báo cường độ lao động bất thường.
8. Kết quả đầu tiên phải dễ hiểu: "Chủ trả bao nhiêu", "Bạn cần bao nhiêu để sống", "Kết luận", "Điểm cần kiểm tra lại".
9. Công thức `m`, `m'`, lao động tất yếu, lao động thặng dư chỉ hiển thị ở phần chi tiết phía sau.
10. AI chỉ được hỗ trợ phân loại nghề và giải thích; phép tính chính phải chạy local, deterministic.

### US5 - Chương 4: Lab cạnh tranh và độc quyền

Là người học Chương 4, tôi muốn thay đổi số doanh nghiệp, rào cản gia nhập và quyền lực định giá để hiểu cạnh tranh dẫn tới tập trung sản xuất và độc quyền như thế nào.

**Acceptance**

1. Có lựa chọn cấu trúc thị trường: nhiều người bán, vài doanh nghiệp lớn, doanh nghiệp thống lĩnh, độc quyền tự nhiên.
2. Người dùng chỉnh được số doanh nghiệp, rào cản gia nhập, quyền lực định giá.
3. App kết luận mức cạnh tranh, nguy cơ độc quyền, tác động tới giá, người tiêu dùng và người lao động.
4. Số điểm 0-100 nếu dùng chỉ là chỉ số mô phỏng, phải ghi rõ.

### US6 - Chương 5: Bản đồ quan hệ lợi ích kinh tế ở Việt Nam

Là người học Chương 5, tôi muốn chọn một chính sách/tình huống để xem các chủ thể kinh tế hưởng lợi, chịu chi phí và Nhà nước điều tiết ra sao.

**Acceptance**

1. Có các chủ thể: Nhà nước, doanh nghiệp tư nhân, FDI, người lao động, người tiêu dùng, hợp tác xã/cộng đồng.
2. Khi chọn một case, app hiển thị: ai hưởng lợi, ai chịu chi phí, vai trò điều tiết của Nhà nước, liên hệ giáo trình.
3. Nếu có số liệu vĩ mô như GDP/tỷ trọng khu vực, bắt buộc có nguồn/date. Nếu không có nguồn, dùng mô tả định tính.

### US7 - Chương 6: Planner công nghiệp hóa, hiện đại hóa, hội nhập

Là người học Chương 6, tôi muốn nhập ngành/nghề quan tâm để app liên hệ với công nghiệp hóa, hiện đại hóa, công nghệ và hội nhập quốc tế.

**Acceptance**

1. Người dùng nhập hoặc chọn ngành/nghề quan tâm.
2. App trả về: liên hệ với công nghiệp hóa, kỹ năng/công nghệ cần học, cơ hội hội nhập, rủi ro phụ thuộc bên ngoài.
3. Nếu AI hỗ trợ viết gợi ý, UI phải ghi là gợi ý học tập, không phải dự báo chắc chắn.

### US8 - Quiz lẻ chọn chương và số câu

Là người ôn thi, tôi muốn chọn chương và số câu để luyện tập theo nhu cầu.

**Acceptance**

1. Người dùng chọn 1 chương, nhiều chương hoặc tất cả chương.
2. Người dùng chọn số câu: 5, 10, 20, 40 hoặc nhập số custom trong giới hạn.
3. App lọc câu theo chương đã chọn và random không trùng trong một lượt.
4. Nếu số câu yêu cầu lớn hơn số câu có sẵn, app tự giảm về số có sẵn và báo rõ.
5. Mỗi chương mục tiêu có khoảng 40 câu hỏi khi dữ liệu hoàn thiện.
6. Sau khi trả lời, app hiển thị đúng/sai, đáp án đúng, giải thích và khung hỏi Thầy Nam AI inline.

### US9 - Thầy Nam AI inline theo ngữ cảnh

Là người học, tôi muốn hỏi Thầy Nam AI ngay bên dưới câu quiz hoặc kết quả phân tích, không bị chuyển trang.

**Acceptance**

1. Khung hỏi AI xuất hiện ngay dưới kết quả quiz, kết quả Chương 3 hoặc công cụ chương.
2. Prompt gửi cho AI có đủ: chương, câu hỏi/kết quả hiện tại, câu trả lời người dùng, đáp án đúng nếu có, giải thích, trích đoạn giáo trình liên quan.
3. AI không nhận toàn bộ giáo trình một cách bừa bãi; chỉ nhận đoạn liên quan.
4. AI dùng `VITE_GEMINI_API_KEY` trước, nếu lỗi phù hợp thì thử `VITE_GEMINI_API_KEY1`, rồi `VITE_GEMINI_API_KEY2`.
5. Không bao giờ hiển thị hoặc log API key.
6. Nếu cả ba key lỗi, giữ nguyên kết quả local và báo lỗi thân thiện.

## Functional Requirements

- **FR-001**: App phải cung cấp 6 công cụ chính tương ứng 6 chương.
- **FR-002**: Mỗi công cụ phải có mục tiêu học tập, input, output, dữ liệu dùng và trạng thái lỗi rõ ràng.
- **FR-003**: App phải đọc dữ liệu giáo trình từ các file static trong `public/`.
- **FR-004**: App phải hỗ trợ quiz lẻ chọn chương và số câu.
- **FR-005**: Dữ liệu quiz phải có `chapterId`, `prompt`, 4 lựa chọn, đáp án đúng, giải thích và `contextExcerpt`.
- **FR-006**: Mỗi chương phải có mục tiêu khoảng 40 câu hỏi khi bộ câu hỏi hoàn thiện.
- **FR-007**: Thầy Nam AI phải chạy inline trong ngữ cảnh hiện tại, không ép chuyển sang trang chat riêng.
- **FR-008**: AI helper phải hỗ trợ key chính `VITE_GEMINI_API_KEY`, hai key dự phòng `VITE_GEMINI_API_KEY1`, `VITE_GEMINI_API_KEY2` và cooldown khi nhận 429.
- **FR-009**: AI không được tạo hoặc xác nhận số liệu kinh tế thật nếu không có nguồn.
- **FR-010**: Chương 3 phải cho người dùng tự nhập tên công việc, lương, giờ/ngày, ngày/tháng, chi phí sống và trợ cấp.
- **FR-011**: Chương 3 không được hard-code mức sống theo tỉnh/thành.
- **FR-012**: Tỉnh/thành trong Chương 3 chỉ được dùng để suy ra vùng lương hoặc metadata có nguồn.
- **FR-013**: Nếu import dataset mức sống, mỗi bản ghi phải có nguồn, năm và ghi chú.
- **FR-014**: Nếu không có dataset mức sống, app phải bắt người dùng nhập chi phí sống.
- **FR-015**: UI phải ưu tiên kết luận dễ hiểu trước, công thức và phân tích học thuật phía sau.
- **FR-016**: Các scenario mô phỏng phải được gắn nhãn "ví dụ học tập".
- **FR-017**: Các số liệu thật phải có nguồn/date hoặc không được hiển thị như sự thật.
- **FR-018**: Build phải chạy được trên Vercel static frontend; AI không được phụ thuộc backend riêng ngoài serverless nếu có.

## Data Requirements

### Dữ liệu được phép dùng

- Nội dung bóc tách từ giáo trình.
- Câu hỏi trắc nghiệm tạo từ giáo trình.
- Số liệu người dùng tự nhập.
- Lương tối thiểu vùng nếu có nguồn/date.
- Scenario mô phỏng có nhãn "ví dụ học tập".
- Dataset chính thức import vào `public/` có metadata nguồn.

### Dữ liệu không được phép dùng

- Mức sống theo tỉnh/thành tự bịa.
- Số liệu "mới nhất" không có nguồn/date.
- Số do AI sinh ra rồi hiển thị như dữ liệu thật.
- Prompt hoặc response chứa API key.

## Main Entities

- **CurriculumChapter**: chương học, tiêu đề, tóm tắt, sections, câu hỏi liên quan.
- **ChapterTool**: công cụ tương tác của từng chương.
- **QuizQuestion**: câu hỏi trắc nghiệm có giải thích và ngữ cảnh giáo trình.
- **QuizSession**: lượt làm bài theo chương và số câu.
- **SalaryInput**: dữ liệu người dùng nhập cho Chương 3.
- **SalaryAnalysisResult**: kết quả tính lương/giá trị thặng dư deterministic.
- **DataSourceMeta**: metadata nguồn cho mọi dữ liệu thật.
- **AiContextRequest**: request AI đã giới hạn ngữ cảnh.

## Success Criteria

- **SC-001**: Người dùng hiểu kết luận chính của mỗi công cụ trong 10 giây đầu mà không cần đọc công thức.
- **SC-002**: Chương 3 không đưa ra kết luận mức sống nếu thiếu chi phí sống.
- **SC-003**: Hà Nội/TP.HCM + chi phí sống 3.000.000đ/tháng phải có cảnh báo bất thường.
- **SC-004**: Quiz cho phép chọn chương và số câu, random không trùng trong một lượt.
- **SC-005**: Mỗi câu quiz sau khi trả lời có giải thích và có khung hỏi Thầy Nam AI inline.
- **SC-006**: Nếu key Gemini chính lỗi nhưng key dự phòng đúng, AI vẫn trả lời.
- **SC-007**: Nếu cả ba key Gemini lỗi, UI vẫn giữ kết quả local và không crash.
- **SC-008**: Không có dữ liệu kinh tế thật nào xuất hiện trên UI mà thiếu nguồn/date hoặc nhãn user-entered/mock.
- **SC-009**: Giao diện desktop và mobile không tràn chữ, không chồng card, không có control thừa không tác dụng.

## Out Of Scope For This Plan

- Không xây backend database.
- Không làm đăng nhập, tài khoản, thanh toán.
- Không tự crawl dữ liệu kinh tế mới nhất.
- Không dùng AI để thay thế phép tính deterministic.
- Không hard-code dataset mức sống nếu chưa có nguồn gốc rõ ràng.
