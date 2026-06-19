# Đặc tả tính năng: Kinh Tế Chính Trị Easy (KTCT-Easy)

**Nhánh tính năng**: `010-ktct-easy`

**Ngày tạo**: 2026-06-16

**Trạng thái**: Bản thảo (Draft)

**Yêu cầu đầu vào**: Xây dựng cấu trúc mã nguồn và code hoàn chỉnh cho một ứng dụng Web Single Page Application (SPA) học tập thực chiến mang tên "Kinh Tế Chính Trị Easy (KTCT-Easy)"...

## Kịch bản Người dùng & Kiểm thử *(bắt buộc)*

### Kịch bản 1 - Bảng điều khiển tổng quan (Độ ưu tiên: P1)
Là một sinh viên hoặc người học, tôi muốn xem bảng điều khiển tổng quan với các số liệu kinh tế số của Việt Nam và dễ dàng điều hướng sang 5 trang tính năng chuyên sâu.

**Lý do ưu tiên**: Đây là trung tâm của ứng dụng SPA, cung cấp số liệu khái quát và dẫn dắt người dùng tới các tính năng.

**Kiểm thử độc lập**: Người dùng có thể nhìn thấy hệ số Gini, lương trung bình ngành công nghệ và nhấp vào các thẻ điều hướng để chuyển trang tức thì thông qua React State.

**Kịch bản chấp nhận**:
1. **Cho** người dùng truy cập trang chủ, **Khi** họ quan sát Stats Cards, **Thì** hệ thống hiển thị chính xác 3 số liệu tổng quan kinh tế Việt Nam.
2. **Cho** người dùng nhấp vào nút "Truy cập ngay" trên thẻ Job Offer Analyzer, **Khi** state thay đổi, **Thì** giao diện chuyển đổi mượt mà sang tính năng Phân tích tiền lương.

---
### Kịch bản 2 - Sự thật về tiền lương & Phân tích thặng dư thông minh (Độ ưu tiên: P2)
Là một người lao động, tôi muốn tự nhập tên công việc tự chọn (ví dụ: "chạy grab", "code dạo"), tiền lương, số giờ làm/ngày, chi phí sống để hệ thống dùng AI nhận diện nhóm ngành chuẩn (ví dụ: "chạy grab" -> "xe ôm công nghệ"), so sánh với thực trạng nền kinh tế Việt Nam hiện tại (mức lương cơ sở, chi phí sống trung bình đô thị), tính toán phân chia thời gian lao động tất yếu và thặng dư, đồng thời in ra bài phân tích giá trị thặng dư bằng ngôn ngữ Gen Z hài hước, dễ hiểu.

**Lý do ưu tiên**: Giúp người dùng dễ dàng đối chiếu trực tiếp công việc thực tế của mình với lý thuyết Giá trị thặng dư ($m$) và Tỷ suất thặng dư ($m'$).

**Kiểm thử độc lập**: Người dùng nhập "chạy grab", lương "4.500.000", chi phí sống "4.000.000", làm "6 tiếng/ngày". Nhấn phân tích, hệ thống hiển thị nhóm ngành đã nhận diện là "Xe ôm công nghệ", đưa ra phân tích dựa trên thị trường Việt Nam hiện tại, vẽ biểu đồ phân chia giờ làm tất yếu và thặng dư, và in ra bài nhận xét Gen Z dí dỏm kèm quy đổi hiện vật vui nhộn.

**Kịch bản chấp nhận**:
1. **Cho** người dùng nhập công việc tùy chỉnh, **Khi** hệ thống gọi AI phân tích, **Thì** hệ thống nhận diện đúng nhóm ngành chuẩn và đưa ra so sánh với thực tế mức sống Việt Nam.
2. **Cho** kết quả phân tích thặng dư được hiển thị, **Khi** đọc nhận xét, **Thì** nội dung sử dụng slang Gen Z trẻ trung, dễ hiểu để giải thích sự bóc lột thặng dư.

---

### Kịch bản 3 - Trợ lý AI: Giải mã nỗi đau đi làm (Độ ưu tiên: P3)
Là một thực tập sinh hoặc nhân viên bị bóc lột, tôi muốn gửi những tâm sự ức chế tại chỗ làm (ép KPI, quỵt lương, OT không trả tiền) để Trợ lý AI của Các Mác phân tích và "bóc phốt" sếp bằng ngôn ngữ hài hước, bắt trend sinh viên.

**Lý do ưu tiên**: Tăng cường tính tương tác thực tế nhờ AI (Gemini API).

**Kiểm thử độc lập**: Nhập văn bản chia sẻ nỗi đau đi làm và gửi lên, hệ thống sẽ trả về phản hồi phân tích đúng lý thuyết kinh tế chính trị bằng slang của Gen Z.

**Kịch bản chấp nhận**:
1. **Cho** ứng dụng đã nạp API Key của Gemini, **Khi** người dùng nhập "bị ép OT cuối tuần không lương" và gửi, **Thì** AI trả về phản hồi bóc trần phương pháp sản xuất giá trị thặng dư tuyệt đối của sếp bằng giọng điệu hài hước.

---

### Kịch bản 4 - Giải mã biến động thị trường (Độ ưu tiên: P4)
Là một người học, tôi muốn chọn các sự kiện kinh tế thực tế tại Việt Nam để xem biểu đồ minh họa sự chênh lệch giữa giá trị thực tế và giá cả thị trường dựa trên Quy luật giá trị.

**Lý do ưu tiên**: Giúp hiểu rõ cơ chế vận hành của cung cầu và giá trị hàng hóa.

**Kiểm thử độc lập**: Chọn một sự kiện (ví dụ: Giá chung cư Hà Nội) sẽ vẽ biểu đồ Recharts Line Chart hiển thị hai đường "Giá trị gốc" và "Giá cả thực tế" dao động xung quanh.

**Kịch bản chấp nhận**:
1. **Cho** danh sách sự kiện thị trường, **Khi** chọn "Giá chung cư Hà Nội tăng phi mã", **Thì** biểu đồ Line Chart vẽ thành công hai đường chênh lệch rõ rệt thể hiện cung cầu mất cân bằng.

---

### Kịch bản 5 - Thử thách làm sếp (Độ ưu tiên: P5)
Là một sếp doanh nghiệp, tôi muốn trả lời các tình huống đạo đức kinh doanh để quan sát sự giằng co giữa lợi nhuận ($m$), sức cạnh tranh và trách nhiệm xã hội.

**Lý do ưu tiên**: Minh họa sâu sắc áp lực của quy luật cạnh tranh tư bản chủ nghĩa và sự cần thiết của sự điều tiết vĩ mô.

**Kiểm thử độc lập**: Người dùng chọn phương án cho một tình huống, hệ thống cập nhật tức thì 3 thanh trạng thái Profit, Competitiveness và Social Responsibility.

**Kịch bản chấp nhận**:
1. **Cho** câu hỏi về xả rác thải, **Khi** chọn "xả trộm để tiết kiệm chi phí", **Thì** thanh Lợi nhuận và Sức cạnh tranh tăng mạnh, nhưng Trách nhiệm xã hội tụt về mức tối thiểu kèm lời cảnh báo từ Nhà nước.

---

### Kịch bản 6 - Bản đồ thành phần kinh tế Việt Nam (Độ ưu tiên: P6)
Là một học sinh ôn thi môn Kinh tế chính trị, tôi muốn xem biểu đồ tròn thể hiện tỷ trọng và vai trò của các khối kinh tế (Nhà nước, Tư nhân, FDI) tại Việt Nam.

**Lý do ưu tiên**: Trực quan hóa mô hình kinh tế thị trường định hướng XHCN một cách sinh động, chuẩn hiến pháp.

**Kiểm thử độc lập**: Nhấp chọn khối kinh tế trên biểu đồ tròn Recharts Pie Chart sẽ cập nhật chi tiết phân tích vai trò cốt lõi.

**Kịch bản chấp nhận**:
1. **Cho** trang cấu trúc kinh tế, **Khi** nhấp vào khối "Kinh tế Nhà nước", **Thì** văn bản giải thích vai trò "chủ đạo" được hiển thị rõ ràng.

### Kịch bản 7 - Mascot Chibi Tương Tác & Lời Thoại (Độ ưu tiên: P1)
Là một người học, tôi muốn di chuột vào Mascot Chibi để Mascot to ra và hiển thị bong bóng thoại chứa các lời bình dí dỏm, gợi nhắc học tập theo giáo trình.

**Kiểm thử độc lập**: Di chuột vào Mascot Chibi sẽ kích hoạt phóng to nhẹ, đồng thời một bong bóng thoại (Speech Bubble) dạng glassmorphism hiện lên góc trên hiển thị ngẫu nhiên các câu nói như "Hôm nay học Triết nè! 📚". Khi di chuột ra ngoài, bong bóng thoại ẩn đi.

---

### Kịch bản 8 - Tự Học & Trắc Nghiệm Chuẩn Giáo Trình (Độ ưu tiên: P1)
Là một sinh viên đang ôn thi, tôi muốn chuyển sang tab "Tự Học" để làm bài trắc nghiệm chuẩn theo từng chương giáo trình, nhận đáp án đúng/sai tức thì kèm theo phần giải thích chuẩn học thuật và có thể bấm nút hỏi thêm Thầy Nam AI.

**Kiểm thử độc lập**: Click vào tab "Tự Học & Trắc Nghiệm", chọn làm trắc nghiệm Chương 2, chọn 1 đáp án. Giao diện đổi màu đáp án (Xanh/Đỏ), hiển thị lý thuyết giải thích chi tiết. Bấm "Hỏi Thầy Nam AI câu này" sẽ tự động chuyển sang tab Chat AI và chèn câu hỏi.

---

### Kịch bản 9 - Tải Giáo Trình Học Tập (Độ ưu tiên: P2)
Là một người dùng, tôi muốn bấm nút để tải trực tiếp file PDF Giáo trình Kinh tế chính trị Mác - Lênin về máy.

**Kiểm thử độc lập**: Click vào nút "Tải Giáo Trình" trên giao diện, trình duyệt sẽ tự động kích hoạt tải file `GIÁO TRÌNH FULL.pdf`.

---

### Các trường hợp đặc biệt (Edge Cases)
- **Thiếu hoặc sai Gemini API Key**: Ứng dụng phải hiển thị hướng dẫn người dùng thiết lập `VITE_GEMINI_API_KEY` trong file `.env` một cách thân thiện thay vì bị crash.
- **Biểu đồ hiển thị trên màn hình nhỏ**: Các biểu đồ Recharts phải tự co giãn theo chiều rộng container (responsive) để tránh vỡ giao diện trên điện thoại.
- **Tải tệp lớn**: Nút tải giáo trình phải được cấu hình chính xác đường dẫn tĩnh để tránh lỗi 404 khi tải tệp PDF 32.6MB.

## Yêu cầu chức năng *(bắt buộc)*

### Các yêu cầu chi tiết
- **FR-001**: Hệ thống PHẢI tải và đọc dữ liệu tĩnh từ `economy_data.json` khi khởi chạy.
- **FR-002**: Hệ thống PHẢI chạy hoàn toàn ở Client-side dưới dạng Single Page Application (SPA) với thanh điều hướng dạng Top Navigation Pill lơ lửng được quản lý bằng React State để cuộn mượt mà giữa các phân đoạn học tập.
- **FR-003**: Hệ thống PHẢI cung cấp công cụ so sánh thời gian lao động tất yếu và thặng dư dựa trên dữ liệu công việc tùy chỉnh do người dùng nhập (tên công việc, lương, số giờ làm, chi phí sống) được AI tự động phân loại thông minh và so sánh với bối cảnh kinh tế Việt Nam.
- **FR-004**: Hệ thống PHẢI hỗ trợ quy đổi tích lũy thặng dư theo số tháng ra trà sữa, vé xem phim, tai nghe kèm chú thích hài hước.
- **FR-005**: Hệ thống PHẢI gọi trực tiếp API Gemini bằng API Key lấy từ môi trường để phân tích nỗi đau đi làm dưới góc nhìn Marxist.
- **FR-006**: Hệ thống PHẢI vẽ biểu đồ Line Chart (Recharts) hiển thị đường Giá trị gốc và Giá cả thực tế cho các sự kiện thị trường.
- **FR-007**: Hệ thống PHẢI hiển thị trắc nghiệm mini-quiz cập nhật động 3 thanh chỉ số của Sếp (Lợi nhuận, Sức cạnh tranh, Trách nhiệm xã hội).
- **FR-008**: Hệ thống PHẢI hiển thị biểu đồ Pie Chart (Recharts) thể hiện các thành phần kinh tế Việt Nam.
- **FR-009**: Hệ thống PHẢI phóng to Mascot Chibi gấp 1.5 lần kích thước cũ (lên `w-40 h-52 md:w-48 md:h-60`) và hiển thị lời thoại bong bóng ngẫu nhiên khi di chuột vào.
- **FR-010**: Hệ thống PHẢI tải tóm tắt kiến thức giáo trình và bộ câu hỏi trắc nghiệm từ `curriculum_knowledge.json`.
- **FR-011**: Hệ thống PHẢI tích hợp dữ liệu giáo trình tóm tắt vào Prompt cho Thầy Nam AI ở chế độ Academic để trả lời chính xác, tránh lệch chuẩn.
- **FR-012**: Hệ thống PHẢI cung cấp giao diện tự học trắc nghiệm hỗ trợ chấm điểm, giải thích chi tiết và chuyển tiếp câu hỏi sang Thầy Nam AI.
- **FR-013**: Hệ thống PHẢI hỗ trợ tải trực tiếp tệp `GIÁO TRÌNH FULL.pdf` từ thư mục public.

### Thực thể dữ liệu chính
- **JobOffer (Công việc)**: Lương, chi phí sống tối thiểu, số giờ làm, tỷ lệ phân chia thời gian.
- **MarketEvent (Biến động thị trường)**: Tên sự kiện, biểu đồ dữ liệu chu kỳ.
- **EthicalDilemma (Tình huống đạo đức)**: Câu hỏi, các phương án lựa chọn và tác động chỉ số tương ứng.
- **EconomicSector (Khối kinh tế)**: Tỷ lệ GDP, vai trò theo Hiến pháp.
- **CurriculumChapter (Chương giáo trình)**: Tên chương, tóm tắt lý thuyết trọng tâm.
- **QuizQuestion (Câu hỏi trắc nghiệm)**: Chương, câu hỏi, 4 lựa chọn, đáp án đúng, giải thích chi tiết.

## Tiêu chí thành công *(bắt buộc)*

### Chỉ số Đo lường
- **SC-001**: Thời gian chuyển đổi trang qua state dưới 100ms.
- **SC-002**: Các tính toán toán học và cập nhật thanh trạng thái diễn ra tức thì sau khi người dùng tương tác.
- **SC-003**: Biểu đồ tự co giãn mượt mà khi thay đổi kích thước cửa sổ trình duyệt.
- **SC-004**: Bong bóng thoại hiển thị tức thì khi hover vào mascot.
- **SC-005**: Chatbot Thầy Nam AI phản hồi lý thuyết dựa trên tóm tắt giáo trình chính xác, không trả lời lệch hoặc bịa đặt kiến thức.


## Giả định
- Ứng dụng chạy offline hoàn toàn ngoại trừ chức năng Trợ lý AI cần kết nối Internet để gọi API Gemini.
- Toàn bộ giao diện và dữ liệu đầu vào sử dụng tiếng Việt.
