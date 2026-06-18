# Kế hoạch triển khai: Kinh Tế Chính Trị Easy (KTCT-Easy)

**Nhánh tính năng**: `010-ktct-easy` | **Ngày tạo**: 2026-06-16 | **Đặc tả**: [spec.md](file:///d:/DemoCodeTriet/my-mln-learning-2/specs/010-ktct-easy/spec.md)

## Tóm tắt kế hoạch
Xây dựng một ứng dụng Single Page Application (SPA) trên nền React có tên "Kinh Tế Chính Trị Easy" (KTCT-Easy) nhằm giảng dạy Kinh tế chính trị Mác - Lênin bằng ngôn ngữ bình dân cho người học tại Việt Nam. Ứng dụng bao gồm:
- Thanh điều hướng dạng Top Navigation Pill lơ lửng được quản lý bằng React State để cuộn mượt mà giữa các phân đoạn học tập.
- 5 tính năng chính: Phân tích lương & Máy tính đổi đồ, Trợ lý AI Các Mác, Biểu đồ biến động thị trường, Thử thách làm sếp, và Bản đồ kinh tế vĩ mô Việt Nam.
- Trực quan hóa dữ liệu bằng Recharts (biểu đồ đường, biểu đồ tròn) và bộ icon Lucide.
- Tích hợp gọi trực tiếp API Gemini từ frontend.

## Chi tiết Logic 5 Chức Năng

### 🧑💻 Chức năng 1: Phân tích tiền lương & Máy tính đổi đồ (Job Offer Analyzer)
- **Đọc dữ liệu**: Lấy danh sách từ `job_offers` trong `economy_data.json`.
- **Cảnh báo mức sống**: 
  - Nếu `salary < cost_of_living` (Lương tháng thấp hơn chi phí sống tối thiểu để tái tạo sức lao động), hiển thị một hộp thoại cảnh báo nổi bật màu đỏ: *"Cảnh báo: Lương của bạn không đủ tái tạo sức lao động! Bạn đang bán sức lao động dưới giá trị thực tế."*
- **Biểu diễn ngày làm việc 8 tiếng**:
  - Dựa trên hai chỉ số: `necessary_hours` (thời gian lao động tất yếu - làm cho bản thân) và `surplus_hours` (thời gian lao động thặng dư - làm cho sếp).
  - Tính tỷ lệ phần trăm:
    - $\% \text{Tất yếu} = (\text{necessary\_hours} / 8) \times 100$
    - $\% \text{Thặng dư} = (\text{surplus\_hours} / 8) \times 100$
  - Hiển thị trên thanh Progress Bar phân màu rõ rệt: Màu xanh lá cây biểu thị thời gian làm cho bản thân, màu đỏ biểu thị thời gian tạo ra giá trị thặng dư bị chiếm đoạt.
- **Tỷ suất giá trị thặng dư ($m'$)**:
  - Tính toán: $m' = (\text{surplus\_hours} / \text{necessary\_hours}) \times 100\%$.
- **Quy đổi thặng dư đời sống**:
  - Cho người dùng nhập số tháng làm việc $N$ (mặc định = 1).
  - Tính lượng giá trị thặng dư sếp đút túi: $m_{\text{tích luỹ}} = \text{salary} \times (\text{surplus\_hours} / \text{necessary\_hours}) \times N$.
  - Quy đổi ra hiện vật tương đương:
    - Trà sữa (50k VND/ly): $m_{\text{tích luỹ}} / 50,000$
    - Vé xem phim (100k VND/vé): $m_{\text{tích luỹ}} / 100,000$
    - Tai nghe Bluetooth (500k VND/cái): $m_{\text{tích luỹ}} / 500,000$
  - Kèm câu bình luận: *"Bạn đã cống hiến cho sếp [X] ly trà sữa mà không hề được trả một đồng nào!"*

### 🤖 Chức năng 2: Trợ lý AI Các Mác (Marxist AI Consultant)
- **Đọc API Key**: Từ `import.meta.env.VITE_GEMINI_API_KEY`.
- **Gửi request**: Gọi trực tiếp tới Gemini API (`gemini-1.5-flash` hoặc `gemini-2.5-flash`) bằng cách truyền system instruction sau:
  - *System Instruction*: *"Bạn là một nhà kinh tế chính trị học Marxist thông thái nhưng nói chuyện cực kỳ hài hước và bắt trend Gen Z Việt Nam. Người dùng sẽ kể cho bạn nỗi đau đi làm (ví dụ: bị quỵt lương, bắt tăng ca không lương, ép KPI vô lý). Hãy giải thích cho họ hiểu họ đang bị chiếm đoạt thặng dư thế nào (ví dụ: bóc lột thặng dư tuyệt đối qua tăng ca, bóc lột thặng dư tương đối qua ép năng suất) dựa trên lý thuyết của Các Mác. Dùng tiếng Việt trẻ trung, hài hước, ví von sinh động và kết thúc bằng một lời khuyên dí dỏm."*
- **Xử lý giao diện**:
  - Hiện trạng thái loading đẹp mắt khi đang chờ phản hồi.
  - Hỗ trợ lưu lịch sử hội thoại ngắn trong phiên (session memory) để người dùng có thể chat tiếp.

### 📈 Chức năng 3: Giải mã biến động thị trường (Market Decoder)
- **Đọc dữ liệu**: Lấy danh sách sự kiện từ `market_events` trong `economy_data.json`.
- **Logic vẽ biểu đồ (Recharts Line Chart)**:
  - Trục X hiển thị các mốc thời gian/tháng (`month`).
  - Trục Y hiển thị chỉ số giá trị (index từ 0 đến 200).
  - Vẽ hai đường chính:
    - **Đường Giá trị gốc (Original Value)** (Màu xanh Emerald): Thường đi ngang hoặc biến động rất ít, đại diện cho lượng lao động xã hội cần thiết để sản xuất ra hàng hóa đó.
    - **Đường Giá cả thực tế (Market Price)** (Màu vàng Amber hoặc đỏ Rose): Dao động trồi sụt mạnh xung quanh đường giá trị tùy thuộc vào trạng thái Cung > Cầu hay Cung < Cầu.
  - Khi Cung < Cầu: Đường Giá cả thực tế vọt cao hơn đường Giá trị gốc.
  - Khi Cung > Cầu: Đường Giá cả thực tế rơi thấp hơn đường Giá trị gốc.
- **Văn bản giải thích**: Hiển thị mô tả lý thuyết Quy luật Giá trị ứng với sự kiện đã chọn giúp người học hiểu bản chất biến động giá cả.

### ☕ Chức năng 4: Thử thách làm sếp (Ethical Boss Challenge)
- **Đọc câu hỏi**: Lấy từ danh sách `ethical_dilemmas` trong `economy_data.json`.
- **Quản lý chỉ số doanh nghiệp**:
  - Trạng thái khởi tạo: Lợi nhuận ($m$) = 50%, Sức cạnh tranh = 50%, Trách nhiệm xã hội = 50%.
  - Khi người dùng lựa chọn một phương án ứng xử:
    - Tính điểm thay đổi dựa trên `impact` của phương án đó (ví dụ: `profit += 20`, `competitiveness += 10`, `social_responsibility -= 30`).
    - Các chỉ số được giới hạn trong khoảng `[0, 100]%`.
  - Hiển thị phản hồi chi tiết: Giải thích tại sao trong nền kinh tế thị trường, sếp thường bị ép buộc phải tối đa hóa thặng dư do áp lực cạnh tranh khốc liệt (Quy luật tích lũy tư bản).

### 🇻🇳 Chức năng 5: Bản đồ thành phần kinh tế Việt Nam (Economic Sector Matrix)
- **Đọc dữ liệu**: Lấy từ `economic_sectors` trong `economy_data.json`.
- **Logic vẽ biểu đồ (Recharts Pie Chart)**:
  - Hiển thị tỷ trọng phần trăm GDP của các thành phần: Kinh tế Nhà nước, Kinh tế Tư nhân, Khối FDI,...
  - Sử dụng các màu sắc phân biệt trực quan.
- **Logic tương tác**:
  - Khi người dùng nhấp chọn một phân mảnh (Pie slice) hoặc nút tương ứng:
    - Hiển thị nội dung chi tiết về **Vai trò hiến định** của thành phần đó (Ví dụ: Kinh tế Nhà nước giữ vai trò chủ đạo; Kinh tế Tư nhân là một động lực quan trọng...).
    - Giải thích mô hình kinh tế thị trường định hướng XHCN độc đáo của Việt Nam.

---

## Nội dung cần người dùng duyệt

> [!IMPORTANT]
> - **Phiên bản Tailwind CSS**: Chúng tôi đề xuất cài đặt Tailwind CSS v4, sử dụng plugin `@tailwindcss/vite` trực tiếp trong cấu hình Vite 8 (không cần file config riêng).
> - **Mô hình Gemini**: AI sẽ gọi model `gemini-1.5-flash` hoặc `gemini-2.5-flash` dựa trên API Key của người dùng cấu hình trong file `.env`.

## Câu hỏi thảo luận

> [!NOTE]
> - **Lựa chọn Model Gemini**: Bạn muốn dùng `gemini-1.5-flash` như yêu cầu gốc hay nâng cấp lên `gemini-2.5-flash` để phản hồi tiếng Việt mượt mà và thông minh hơn?
> - **Công nghệ CSS**: Bạn có đồng ý cài đặt Tailwind CSS v4 mới nhất tương thích hoàn toàn với Vite 8 không?

## Đề xuất thay đổi tệp tin

### 💬 Chức năng 6: Mascot Chibi Tương Tác & Lời Thoại (Interactive Mascot)
- **Cải tiến Kích thước**: Phóng to Mascot thêm 1.5 lần, chuyển class kích thước sang `w-40 h-52 md:w-48 md:h-60` để Mascot hiển thị nổi bật và sinh động hơn.
- **Bong bóng thoại (Speech Bubble)**:
  - Sử dụng React state `isMascotHovered` và `hover` event listener trên container của Mascot.
  - Khi hover, hiển thị một bong bóng thoại (Speech Bubble) có viền kính mờ (glassmorphism), nền tối mờ, chữ trắng ở phía trên Mascot.
  - Nội dung bong bóng thoại sẽ lấy ngẫu nhiên từ danh sách các câu nói:
    - *"Hôm nay học Triết nè! 📚"*
    - *"Bạn đã ôn thi Chương 2 chưa đó? 🤔"*
    - *"Bị sếp bóc lột? Hỏi thầy Nam AI ngay! 🛠️"*
    - *"Tải Giáo trình Mác - Lênin về tự học nhé! 📥"*
    - *"Tích lũy đủ về lượng sẽ biến đổi về chất! 📈"*
    - *"Lao động thặng dư chính là... sếp thích điều này! 🤫"*
  - Bong bóng thoại sẽ ẩn đi mượt mà khi di chuột ra ngoài.

### 📖 Chức năng 7: Hệ thống Tự Học & Trắc Nghiệm (Self-Study Quiz)
- **Tải dữ liệu**: Đọc danh sách chương và câu hỏi trắc nghiệm tự học từ `curriculum_knowledge.json`.
- **Giao diện Trắc nghiệm**:
  - Giao diện có cấu trúc chia theo chương (Chương 1 đến 6) và chế độ làm ngẫu nhiên (Quiz tổng hợp).
  - Hiển thị từng câu hỏi một cách trực quan, bao gồm thanh tiến trình (Progress Bar).
  - Khi người dùng click chọn 1 đáp án:
    - Kiểm tra đáp án chính xác.
    - Đổi màu đáp án đã chọn: Xanh lá cây nếu đúng, Đỏ nếu sai, và highlight đáp án đúng (nếu chọn sai).
    - Hiển thị ngay hộp thoại giải thích chi tiết trích từ Giáo trình chuẩn để người học ghi nhớ kiến thức.
    - Tích hợp nút *"Hỏi Thầy Nam AI câu này"*: Tự động chuyển tab sang Chat AI, tự động điền câu hỏi để Thầy giải thích sâu hơn.
- **Chức năng Tải Giáo trình**:
  - Thiết kế card tải học liệu đẹp mắt ở trang chủ và tab tự học.
  - Cho phép click tải tệp `public/GIÁO TRÌNH FULL.pdf` (được chép từ thư mục gốc).

### 🤖 Đào tạo Thầy Nam AI bằng Giáo trình
- **Đọc dữ liệu học thuyết**: Lấy phần tóm tắt lý thuyết 6 chương giáo trình từ `curriculum_knowledge.json`.
- **Logic Prompting**:
  - Khi AI được đặt ở chế độ `academic` (Ôn tập & giải đề), hệ thống sẽ tiêm (inject) toàn bộ tóm tắt lý thuyết học thuật 6 chương vào Prompt gửi cho Gemini.
  - **Ràng buộc trả lời**: Buộc AI đối chiếu chặt chẽ câu hỏi của học viên với dữ liệu giáo trình để đưa ra câu trả lời chuẩn chỉ nhất. Chỉ khi câu hỏi hoàn toàn nằm ngoài phạm vi giáo trình được cung cấp, AI mới hiển thị dòng chữ cảnh báo rõ *"Nội dung này nằm ngoài phạm vi giáo trình chính thức"* rồi mới sử dụng kiến thức chung của Gemini để bổ sung lời giải thích ngắn gọn, tránh lấy dữ liệu lung tung.


---

## Nội dung cần người dùng duyệt

> [!IMPORTANT]
> - **Chibi Mascot**: Kích thước mới to gấp 1.5 lần, hiển thị bóng thoại khi di chuột vào.
> - **Nguồn học liệu**: Dữ liệu tóm tắt lý thuyết và câu hỏi trắc nghiệm được lưu ở file tĩnh `public/curriculum_knowledge.json`.
> - **Tải giáo trình**: Giáo trình PDF được lưu ở `public/GIÁO TRÌNH FULL.pdf`.

## Câu hỏi thảo luận

> [!NOTE]
> - **Cập nhật prompt AI**: Chúng tôi đã tối ưu hóa Prompt của Thầy Nam AI bằng cách đính kèm trực tiếp kiến thức giáo trình tóm tắt vào ngữ cảnh (context), giúp thầy trả lời chính xác 100% theo chương trình. Bạn có đồng ý với giải pháp tiêm ngữ cảnh trực tiếp này không?

## Đề xuất thay đổi tệp tin

### [NEW] [curriculum_knowledge.json](file:///d:/DemoCodeTriet/my-mln-learning-2/public/curriculum_knowledge.json)
Tạo tệp JSON chứa tóm tắt lý thuyết 6 chương giáo trình và 18 câu hỏi trắc nghiệm chuẩn.

### [NEW] [public/GIÁO TRÌNH FULL.pdf](file:///d:/DemoCodeTriet/my-mln-learning-2/public/GIÁO TRÌNH FULL.pdf)
Tệp tài liệu gốc được sao chép vào thư mục public để hỗ trợ tính năng tải về trực tiếp.

### [MODIFY] [src/App.tsx](file:///d:/DemoCodeTriet/my-mln-learning-2/src/App.tsx)
- Cải tiến kích thước Chibi Mascot và bổ sung sự kiện hover hiển thị bóng thoại ngẫu nhiên.
- Tạo tab giao diện "Tự Học & Trắc Nghiệm" và tích hợp bộ câu hỏi từ JSON.
- Tích hợp logic tiêm lý thuyết giáo trình vào prompt gọi Gemini API.
- Bổ sung nút tải giáo trình PDF.

---

## Kế hoạch kiểm thử & Xác minh

### Kiểm thử tự động
- Chạy `npm run build` để kiểm tra đóng gói sản phẩm và lỗi cú pháp.
- Chạy `npm run lint` để kiểm tra quy chuẩn mã nguồn.

### Kiểm thử thủ công
- Chạy ứng dụng trên môi trường dev local.
- Kiểm tra tính năng hover vào Mascot Chibi xem bong bóng thoại có hiện lên ngẫu nhiên và biến mất khi hover out không.
- Thực hiện làm bài trắc nghiệm ở tab Tự Học, kiểm tra việc hiển thị đúng/sai, giải thích và nút chuyển tiếp sang chatbot Thầy Nam.
- Kiểm tra phản hồi của Thầy Nam AI ở chế độ Ôn Tập xem có chính xác theo giáo trình không.
- Kiểm tra nút Tải Giáo trình xem tệp PDF tải về có nguyên vẹn và mở bình thường không.

