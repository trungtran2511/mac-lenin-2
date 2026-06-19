# Kế hoạch triển khai: Kinh Tế Chính Trị Easy (KTCT-Easy) - Bản nâng cấp Phân tích Lương AI

**Nhánh tính năng**: `011-redesign-features-spst` | **Ngày tạo**: 2026-06-19 | **Đặc tả**: [spec.md](file:///D:/DemoCodeTriet/my-mln-learning-2/specs/010-ktct-easy/spec.md)

## Tóm tắt kế hoạch
Nâng cấp bảng tính lương trong ứng dụng "Kinh Tế Chính Trị Easy" sang mô hình động thông minh:
- Cho phép người dùng tự do nhập tên công việc, tiền lương, số giờ làm/ngày, và chi phí sinh hoạt.
- Sử dụng trực tiếp API Gemini để nhận dạng nhóm ngành (ví dụ: "chạy grab" -> "Xe ôm công nghệ") và tham chiếu mức lương theo giờ thực tế của người dùng với **thực trạng nền kinh tế Việt Nam** (mức lương tối thiểu vùng, thu nhập trung bình ngành, lạm phát và chi phí sinh hoạt thực tế).
- AI phân tích cơ cấu giá trị thặng dư ($m$) và mức độ bóc lột thặng dư tuyệt đối/tương đối ($m'$), viết nhận xét bằng giọng văn Gen Z hài hước, dí dỏm, dễ hình dung và đưa ra lời khuyên thiết thực.
- Xây dựng bộ quy tắc dự phòng cục bộ (Local Fallback Rules) để phân loại và cảnh báo ngay lập tức nếu API gặp lỗi hoặc không có mạng.

---

## Technical Context

**Ngôn ngữ/Phiên bản**: React 19 + TypeScript 6.0
**Thư viện chính**: Framer Motion, Lucide React, Recharts (vẽ biểu đồ tròn/phân chia)
**AI Model**: `gemini-2.5-flash` gọi trực tiếp hoặc qua proxy serverless
**Môi trường**: `.env` chứa `VITE_GEMINI_API_KEY` và `VITE_GEMINI_API_URL`
**Ràng buộc**: Thời gian phản hồi tính toán tức thì, tải AI dưới 3 giây, hỗ trợ hiển thị tốt trên thiết bị di động (Responsive).

---

## Constitution Check

*GATE: Hoàn toàn phù hợp với hiến pháp của dự án.*
- Sử dụng AI làm tầng đưa ra quyết định lý luận và hướng dẫn (AI-native).
- Định nghĩa rõ ràng hợp đồng dữ liệu AI đầu vào/đầu ra và các giá trị fallback cục bộ an toàn khi ngoại tuyến.
- Không vi phạm các chính sách thanh toán hay tài khoản bảo mật vì ứng dụng chạy hoàn toàn client-side.

---

## Đề xuất thay đổi tệp tin

### 🧑💻 1. Bảng tính Lương mới: [SalaryCalculatorPanel.tsx](file:///d:/DemoCodeTriet/my-mln-learning-2/src/components/SalaryCalculatorPanel.tsx)
Cập nhật/xây dựng lại file component với các tính năng sau:

#### A. Trạng thái nhập liệu (Dynamic Inputs):
- `jobTitle`: Tên công việc tự chọn (ví dụ: "chạy grab", "bưng bê cafe", "code dạo").
- `salaryInput` / `monthlySalary`: Lương nhận được hàng tháng.
- `hoursInput` / `hoursPerDay`: Số giờ làm việc thực tế trong một ca/ngày.
- `costInput` / `costOfLiving`: Chi phí sinh hoạt tối thiểu mỗi tháng để sinh tồn.
- `daysInput` / `workingDays`: Số ngày làm việc mỗi tháng (mặc định 26 ngày).

#### B. Phân loại AI & Bối cảnh Kinh tế Việt Nam (AI Prompt Design):
- Truyền prompt gửi cho Gemini bao gồm: tên công việc, lương giờ thực tế, chi phí sống và yêu cầu AI đối chiếu với thực trạng Việt Nam:
  - Mức lương tối thiểu vùng theo giờ tại Việt Nam hiện tại (Khoảng 20.000đ - 22.500đ/giờ đối với Vùng I). Nếu lương giờ thực tế thấp hơn 15.000đ/giờ là mức vô lý, gần như bóc lột hoàn toàn.
  - So sánh chi phí sống tự nhập với mức sống thực tế đô thị lớn tại Việt Nam (thường dao động 3.500.000đ - 5.000.000đ/tháng cho sinh viên và người lao động trẻ).
  - Biên dịch tên công việc không chuẩn sang nhóm ngành lớn (ví dụ: "chạy grab" -> "Xe ôm công nghệ/Giao hàng", "code dạo" -> "Lập trình viên tự do", "bưng bê" -> "Lao động dịch vụ part-time").
- Yêu cầu AI trả về định dạng JSON thuần để xử lý:
  ```json
  {
    "job_category": "Nhóm ngành chuẩn",
    "suggested_hourly_range": [mức_thấp, mức_cao],
    "is_exploited_text": "Đánh giá mức độ bóc lột (Ví dụ: Bóc lột hoàn toàn, Bóc lột cao, Bình thường...)",
    "analysis_summary": "Giải thích thặng dư theo giọng Gen Z siêu lầy lội, hài hước, phân tích bản chất bóc lột thặng dư tuyệt đối/tương đối.",
    "advice": "Lời khuyên thực tế để nâng cao chất lượng sức lao động hoặc đòi quyền lợi."
  }
  ```

#### C. Bộ quy tắc dự phòng cục bộ (Local Fallback):
- Khi không có API key hoặc API lỗi, sử dụng thuật toán quét từ khóa (keywords) để phân loại nhanh và tự tính mức lương gợi ý:
  - Từ khóa "code", "dev", "it" -> Công nghệ / Kỹ thuật cao (Gợi ý: 50k - 150k/h).
  - Từ khóa "gia su", "day hoc" -> Giáo dục / Gia sư (Gợi ý: 30k - 60k/h).
  - Từ khóa "cafe", "phuc vu", "ban hang" -> Dịch vụ / Bán lẻ (Gợi ý: 18k - 25k/h).
  - Từ khóa "ship", "grab", "gojek" -> Giao hàng / Vận tải (Gợi ý: 20k - 30k/h).
- Nếu lương theo giờ thực tế nhỏ hơn 15.000đ/giờ hoặc lương tháng nhỏ hơn chi phí sống tối thiểu: Báo thẳng cảnh báo đỏ không vòng vo: **"Bạn đang bị bóc lột hoàn toàn! Mức lương này không đủ để tái tạo sức lao động tối thiểu."**

#### D. Trực quan hóa giá trị thặng dư biện chứng:
- Biểu diễn ngày làm việc bằng thanh phân chia 2 màu:
  - Giờ lao động tất yếu ($v$): Thời gian làm việc để tạo ra giá trị bù đắp tiền lương (hoặc chi phí sống).
  - Giờ lao động thặng dư ($m$): Thời gian làm không công còn lại tạo ra lợi nhuận cho chủ.
- Tính toán tỷ suất giá trị thặng dư: $m' = (m / v) \times 100\%$.
- Sử dụng Recharts Pie Chart thể hiện tỷ lệ phân chia tổng giá trị mới tạo ra ($v + m$) giữa Bạn và Chủ doanh nghiệp.
- Quy đổi thặng dư tích lũy theo số tháng ra trà sữa, vé phim, tai nghe để người học dễ hình dung lượng giá trị mình đã cống hiến không công.

---

## Kế hoạch kiểm thử & Xác minh

### Kiểm thử tự động
- Chạy lệnh kiểm tra kiểu TypeScript: `npx tsc -p tsconfig.app.json --noEmit`
- Chạy lệnh build kiểm tra đóng gói: `npm run build`

### Kiểm thử thủ công
1. **Kiểm tra đầu vào động**: Nhập thử các tên công việc tự do (ví dụ: "phục vụ quán lẩu", "làm mẫu ảnh", "dạy kèm tiếng anh") để kiểm tra phản hồi.
2. **Kiểm tra nhận diện AI**: Nhập "chạy grab" với lương 3.000.000đ/tháng, làm 8h/ngày, chi phí sống 3.500.000đ. Nhấn phân tích và kiểm tra xem AI có nhận dạng đúng "Xe ôm công nghệ/Vận tải" và so sánh với mức tối thiểu vùng của kinh tế Việt Nam không.
3. **Kiểm tra giọng văn Gen Z**: Đọc văn bản phản hồi xem có đúng phong cách trẻ trung, hài hước và dễ hiểu hay không.
4. **Kiểm tra Fallback**: Đổi API key sai hoặc tắt mạng, nhập thông số để kiểm tra xem hệ thống có nhảy sang bộ quy tắc dự phòng khớp từ khóa để tính toán và đưa cảnh báo bóc lột hoàn toàn hay không.
