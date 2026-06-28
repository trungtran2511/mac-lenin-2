# Đặc Tả Tính Năng: Điều chỉnh cỡ chữ dự án KTCT-Easy

**Nhánh tính năng**: `011-adjust-font-sizes`  
**Ngày cập nhật**: 2026-06-28  
**Trạng thái**: Bản thảo thiết kế  

## Mục Tiêu

Ứng dụng học Kinh tế chính trị Mác - Lênin cần có trải nghiệm đọc tốt nhất cho sinh viên ôn thi. Hiện tại, font chữ ở một số trang (đặc biệt là phần đọc lý thuyết chương, đề bài trắc nghiệm, các lựa chọn đáp án, và các phần phân tích kết quả) đang bị quá nhỏ (`text-xs` - 12px, hoặc `text-sm` - 14px với font-light), gây mỏi mắt khi học tập lâu. 

Mục tiêu của task này là nâng cỡ chữ của toàn bộ dự án lên mức dễ đọc hơn (thường là `text-sm` thành `text-base` hoặc `text-lg`, `text-xs` thành `text-sm` hoặc `text-base` ở các vùng nội dung chính) trên cả màn hình desktop và mobile, mà không làm hỏng giao diện hay tràn bố cục.

## Người Dùng Chính

- Sinh viên ôn thi Kinh tế chính trị Mác - Lênin cần đọc các văn bản giáo trình dài.
- Người học làm các bài trắc nghiệm và đọc luận giải chi tiết.
- Người dùng tương tác với các công cụ nhập liệu/tính toán và đọc gợi ý của Thầy Nam AI.

## User Stories & Acceptance Criteria

### User Story 1 - Tăng cỡ chữ phần đọc lý thuyết chính (Curriculum Reading) (Priority: P1)

Là người học, tôi muốn nội dung lý luận giáo trình và hướng dẫn học tập hiển thị với cỡ chữ đủ lớn để tôi có thể đọc lâu mà không mỏi mắt.

**Why this priority**: Đây là tính năng cốt lõi của ứng dụng tự học, người dùng phải đọc nhiều văn bản dài từ giáo trình.

**Independent Test**: Có thể kiểm tra trực tiếp ở tab "Tự Học" -> "Mục lục chương" và "Nội dung chi tiết mục".

**Acceptance Scenarios**:

1. **Given** Người học mở mục lục chi tiết của một chương trong tab Tự Học, **When** Xem giới thiệu chương và tiêu đề các mục, **Then** Phần giới thiệu hiển thị cỡ chữ tối thiểu `text-base` (16px), tiêu đề các mục hiển thị rõ ràng.
2. **Given** Người học bấm vào "Đọc chi tiết" một mục, **When** Khung chi tiết hiện ra, **Then** Phần văn bản tóm tắt hiển thị cỡ chữ tối thiểu `text-base` (16px) thay vì `text-sm`, và các đoạn văn chi tiết từ giáo trình hiển thị cỡ chữ `text-base` (16px) hoặc `text-lg` (18px) với khoảng cách dòng thoáng đãng (`leading-relaxed` hoặc `leading-8`).

---

### User Story 2 - Cải thiện độ hiển thị của bộ câu hỏi trắc nghiệm (Quiz) (Priority: P1)

Là người luyện thi trắc nghiệm, tôi muốn đề bài, các phương án lựa chọn và phần giải thích đáp án hiển thị to rõ để dễ dàng thao tác và đối chiếu kết quả.

**Why this priority**: Phần trắc nghiệm có tần suất tương tác rất cao, cỡ chữ nhỏ gây ức chế cho người dùng khi chọn các phương án dài.

**Independent Test**: Có thể kiểm tra trực tiếp bằng cách làm một lượt trắc nghiệm ở tab Tự Học.

**Acceptance Scenarios**:

1. **Given** Màn hình hiển thị câu hỏi trắc nghiệm, **When** Đọc đề bài, **Then** Đề bài hiển thị cỡ chữ tối thiểu `text-lg` (18px) thay vì `text-base`.
2. **Given** Màn hình hiển thị 4 phương án lựa chọn, **When** Chọn đáp án, **Then** Mỗi phương án hiển thị cỡ chữ tối thiểu `text-base` (16px) thay vì `text-sm`, với khoảng cách dòng và padding đủ lớn để dễ bấm trên mobile.
3. **Given** Trả lời xong và xem giải thích đáp án, **When** Đọc phần giải thích và ngữ cảnh giáo trình, **Then** Cỡ chữ giải thích hiển thị tối thiểu `text-base` (16px) thay vì `text-sm`, phần ngữ cảnh giáo trình hiển thị tối thiểu `text-sm` (14px) hoặc `text-base` thay vì `text-xs`.

---

### User Story 3 - Đồng bộ cỡ chữ các nhãn và giải thích ở các công cụ chương (Chapter Tools) (Priority: P2)

Là người dùng các công cụ tương tác ở các chương, tôi muốn các nhãn nhập liệu, các ô nhập, và các đoạn giải thích kết quả dễ nhìn trên cả mobile và desktop.

**Why this priority**: Giúp tăng tính trực quan và giảm sai sót khi người dùng nhập dữ liệu vào các công cụ mô phỏng.

**Independent Test**: Kiểm tra ở các tab công cụ như "Tính Lương" (Chương 3) và các Lab Chương 1, 2, 4, 5, 6.

**Acceptance Scenarios**:

1. **Given** Khung nhập liệu công việc ở công cụ Tính Lương (Chương 3), **When** Nhập tên công việc, lương, chi phí sống, **Then** Các nhãn mô tả hiển thị cỡ chữ tối thiểu `text-sm` (14px) hoặc `text-base` (16px) thay vì `text-xs`, các ô nhập liệu hiển thị text cỡ `text-sm` hoặc `text-base`.
2. **Given** Khung kết quả phân tích giá trị thặng dư (công thức v, t, t', m') hoặc cảnh báo từ app, **When** Xem kết quả, **Then** Các dòng phân tích và định nghĩa công thức hiển thị cỡ chữ tối thiểu `text-sm` (14px) hoặc `text-base` (16px) thay vì `text-xs`.
3. **Given** Thầy Nam AI hiển thị phản hồi inline ở chân trang, **When** Đọc văn bản phản hồi, **Then** Cỡ chữ phản hồi hiển thị tối thiểu `text-sm` (14px) hoặc `text-base` (16px) thay vì `text-xs`, khung nhập câu hỏi hiển thị text cỡ `text-sm`.

### Edge Cases

- **Mobile Viewport Overflow**: Khi cỡ chữ tăng lên, một số button hoặc grid cell có thể bị tràn hoặc chồng chéo lên nhau. Cần đảm bảo các phần layout sử dụng `flex-wrap` hoặc `grid-cols-1 md:grid-cols-2` để co giãn mượt mà.
- **Chú thích bản quyền/nguồn số liệu**: Các dòng chữ siêu nhỏ chỉ nguồn dữ liệu (ví dụ: `DataSourceMeta` hay "*Nội dung biên soạn từ giáo trình chính thức") có thể giữ ở mức `text-xs` (12px) để không làm mất cân đối UI, nhưng không được nhỏ hơn 11px.

## Requirements

### Functional Requirements

- **FR-001**: Toàn bộ văn bản lý thuyết chương (intro và chi tiết) tại `CurriculumReadingPanel` và `SectionDetailPanel` phải có cỡ chữ tối thiểu `text-base` (16px) hoặc `text-lg` (18px) đối với nội dung dài.
- **FR-002**: Đề bài trắc nghiệm tại `FlexibleQuizBuilder` phải có cỡ chữ tối thiểu `text-lg` (18px).
- **FR-003**: Các phương án lựa chọn trắc nghiệm phải có cỡ chữ tối thiểu `text-base` (16px).
- **FR-004**: Giải thích đáp án và Ngữ cảnh giáo trình trong phần kết quả trắc nghiệm phải có cỡ chữ tối thiểu là `text-base` (16px) và `text-sm` (14px) tương ứng.
- **FR-005**: Nhãn trường thông tin (labels) của form nhập liệu tại `SalaryCalculatorPanel` và `Chapter3SalarySurplusTool` phải có cỡ chữ tối thiểu `text-sm` (14px).
- **FR-006**: Định nghĩa công thức thặng dư (v, t, t', m') ở phần kết quả Tính Lương phải có cỡ chữ tối thiểu `text-sm` (14px).
- **FR-007**: Phản hồi của Thầy Nam AI ở component `InlineThayNamAI` phải có cỡ chữ tối thiểu `text-sm` (14px) trên mobile và `text-base` (16px) trên desktop.
- **FR-008**: Tất cả các thay đổi về cỡ chữ phải được kiểm tra responsive trên mobile (viewport width 360px - 480px) để không gây tràn layout.

## Success Criteria

### Measurable Outcomes

- **SC-001**: 100% các trang/panel hiển thị nội dung học thuật chính (Curriculum, Quiz, AI feedback) có cỡ chữ chính từ 14px trở lên (ưu tiên 16px cho văn bản dài).
- **SC-002**: Không có văn bản nội dung chính nào sử dụng cỡ chữ dưới 13px (trừ chú thích nguồn nhỏ và meta tag).
- **SC-003**: 100% giao diện sau khi tăng cỡ chữ vượt qua bước kiểm tra không tràn viền, không chồng chéo phần tử trên cả màn hình Desktop và Mobile (kiểm tra responsive bằng Chrome DevTools).

## Assumptions

- Các lớp CSS tiện ích của Tailwind (như `text-sm`, `text-base`, `text-lg`, `text-xl`) hoạt động đúng theo cấu hình mặc định của dự án.
- Không thay đổi thiết kế tổng thể hay màu sắc của ứng dụng, chỉ tập trung vào tỷ lệ cỡ chữ (typography scale).

