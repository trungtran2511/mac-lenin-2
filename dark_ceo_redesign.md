# Bản Nội Dung Mới — Giám Đốc Hắc Ám

## Vấn đề hiện tại

| Vấn đề | Nguyên nhân |
|---|---|
| Phá sản sau 3 lượt | Karma quá nặng (–35 đến –40 điểm), chỉ 3 khủng hoảng lặp vòng |
| Không biết cách thắng | Không có hướng dẫn rõ, zone nguy hiểm không hiển thị |
| Chán khi chơi lại | 3 crisis cố định, không random |

---

## Thiết kế mới

### Nguyên tắc cân bằng

- **Bắt đầu**: tất cả chỉ số = 50
- **Zone nguy hiểm**: < 15 hoặc > 85 (báo động đỏ)
- **Game Over**: bất kỳ chỉ số nào chạm 0 hoặc 100
- **Thắng**: sống sót qua 12 lượt với tất cả chỉ số trong khoảng 15–85
- **Karma**: giảm xuống tối đa –20 (thay vì –40), tăng tối đa +15
- **Lựa chọn "an toàn"** luôn có sẵn nhưng không tối ưu (hy sinh một thứ để giữ thứ khác)

---

### Pool khủng hoảng (18 crisis, random mỗi ván)

Mỗi ván chơi: hệ thống **shuffle ngẫu nhiên** 18 crisis → lấy 12 cái.

#### Nhóm A — Cổ đông & Tài chính (5 crisis)

**A1 — Áp lực tăng trưởng quý**
> Hội đồng Cổ đông: "Cổ đông yêu cầu tăng lợi nhuận 15%. Đề xuất giải pháp?"
- 🅰 Cắt nhân sự 15% + tăng ca → Profit +18, Morale –20 | Karma: đình công → Profit –15, Comp –10
- 🅱 Tự động hoá một phần dây chuyền → Profit +10, Comp +15, Morale –10 | Karma: lỗi kỹ thuật → Profit –12
- 🅲 Từ chối, giữ nhân sự — đầu tư năng suất dài hạn → Profit –10, Social +15, Morale +20

**A2 — Nhà đầu tư nước ngoài**
> Cổ đông: "Có quỹ FDI muốn rót 50 tỷ nhưng yêu cầu chuyển nhà máy ra nước ngoài thuê nhân công rẻ hơn."
- 🅰 Chấp nhận — chuyển nhà máy → Profit +25, Comp +20, Social –25, Morale –30
- 🅱 Đàm phán giữ lại 50% nhà máy trong nước → Profit +10, Comp +10, Social –5, Morale –5
- 🅲 Từ chối FDI, tìm vốn trong nước → Profit –15, Social +20, Morale +10

**A3 — Kiểm toán nội bộ**
> Tài chính: "Kiểm toán phát hiện 3 phòng ban chi vượt ngân sách 40%."
- 🅰 Cắt ngay toàn bộ ngân sách dư → Profit +15, Morale –25 | Karma: nhân viên giỏi nghỉ hàng loạt → Comp –15
- 🅱 Điều tra, xử lý người vi phạm, giữ ngân sách hoạt động → Profit –5, Social +10, Morale +5
- 🅲 Bỏ qua — để phòng ban tự cân đối → Comp –10, Social –10

**A4 — Khủng hoảng thanh khoản**
> Tài chính: "Dòng tiền âm! Phải huy động vốn khẩn trong 48h."
- 🅰 Vay ngân hàng lãi suất cao → Profit –20, Comp +10
- 🅱 Bán bớt tài sản cố định (máy móc) → Profit +15, Comp –20, Morale –5
- 🅲 Kêu gọi nhân viên "chia sẻ khó khăn" — giảm lương tạm thời → Profit +5, Morale –20, Social –5 | Karma: mất lòng tin → Morale –10

**A5 — Tư vấn chiến lược**
> Cổ đông: "McKinsey đề xuất restructure toàn bộ công ty theo mô hình Agile."
- 🅰 Triển khai toàn bộ ngay → Profit –15, Comp +25, Morale –15 | Karma: hỗn loạn nội bộ → Morale –10
- 🅱 Thí điểm 1 phòng ban → Profit –5, Comp +10, Morale –5
- 🅲 Mời tư vấn nhưng quyết định giữ mô hình cũ → Profit –5, Social +5, Morale +5

---

#### Nhóm B — Nhân sự & Lao động (5 crisis)

**B1 — Tai nạn lao động**
> Công đoàn: "Công nhân phân xưởng bị tai nạn do thiếu thiết bị bảo hộ."
- 🅰 Đền bù đầy đủ + nâng cấp toàn bộ bảo hộ → Profit –20, Social +25, Morale +20
- 🅱 Đền bù tối thiểu, mua thiết bị bảo hộ cơ bản → Profit –8, Social +5, Morale +5
- 🅲 Thương lượng kín với gia đình nạn nhân, che giấu báo chí → Profit +5, Social –25, Morale –15 | Karma: báo chí điều tra → Social –20, Comp –15

**B2 — Đình công tiền lương**
> Công đoàn: "Công nhân đòi tăng lương 10% theo lạm phát. Đã 2 năm không tăng."
- 🅰 Tăng lương 10% ngay → Profit –15, Morale +30, Social +10
- 🅱 Tăng lương 5% + thêm phúc lợi hiện vật → Profit –8, Morale +15, Social +5
- 🅲 Từ chối, hứa xem xét cuối năm → Profit +5, Morale –25, Social –10 | Karma: đình công 3 ngày → Profit –20, Comp –10

**B3 — Tuyển dụng CEO phó**
> Nhân sự: "Cần tuyển Phó CEO — ứng viên nội bộ lâu năm vs ứng viên ngoài nổi tiếng nhưng lương gấp 3."
- 🅰 Chọn ứng viên nội bộ → Profit –5, Morale +20, Comp –5
- 🅱 Chọn ứng viên ngoài → Profit –20, Comp +20, Morale –10 | Karma: xung đột văn hoá → Morale –10
- 🅲 Giữ vị trí trống, CEO tự kiêm nhiệm → Profit +5, Comp –10, Morale –5

**B4 — Chính sách làm việc từ xa**
> Nhân sự: "Nhân viên văn phòng đòi work-from-home 3 ngày/tuần sau COVID."
- 🅰 Chấp thuận hoàn toàn → Profit –5, Morale +25, Comp –5
- 🅱 Hybrid 2 ngày/tuần → Morale +12, Comp +5
- 🅲 Từ chối, yêu cầu toàn thời gian văn phòng → Morale –20, Comp +5 | Karma: 20% nhân sự trẻ nghỉ việc → Comp –15

**B5 — Phúc lợi sức khoẻ**
> Nhân sự: "Bảo hiểm sức khoẻ hết hạn. Gia hạn gói cũ hay nâng cấp gói mới đắt gấp đôi?"
- 🅰 Nâng cấp gói cao cấp → Profit –18, Morale +25, Social +15
- 🅱 Gia hạn gói cũ → Profit –8, Morale +5
- 🅲 Chuyển sang tự đóng góp (nhân viên trả 50%) → Profit +8, Morale –20, Social –10

---

#### Nhóm C — Môi trường & Xã hội (4 crisis)

**C1 — Xả thải cạnh tranh**
> PR: "Đối thủ xả thải lậu, giá rẻ hơn 30%. Áp lực thị trường cực lớn."
- 🅰 Tố cáo đối thủ, đẩy mạnh thương hiệu xanh → Profit –10, Comp –5, Social +20
- 🅱 Âm thầm xả thải theo để cạnh tranh → Profit +15, Comp +15, Social –30, Morale –10 | Karma: bị phát hiện → Social –25, Comp –20
- 🅲 Hạ giá bằng cắt chi phí R&D → Profit +5, Comp +10, Social –5

**C2 — Kiểm tra môi trường**
> PR: "Đoàn thanh tra môi trường thông báo kiểm tra cơ sở sản xuất tuần tới."
- 🅰 Dừng dây chuyền vi phạm, khắc phục đầy đủ → Profit –20, Social +25, Morale +10
- 🅱 Thuê chuyên gia "làm đẹp hồ sơ" → Profit –10, Social –10 | Karma: thanh tra phát hiện gian lận → Social –30
- 🅲 Tự đánh giá và báo cáo vi phạm nhỏ trước → Profit –10, Social +15, Morale +5

**C3 — Phong trào ESG**
> PR: "Khách hàng lớn yêu cầu công ty đạt chứng nhận ESG trong 6 tháng."
- 🅰 Đầu tư đầy đủ để đạt chuẩn ESG → Profit –25, Social +30, Comp +15, Morale +10
- 🅱 Đạt chuẩn tối thiểu chỉ trên giấy tờ → Profit –10, Social +5, Comp +5 | Karma: bị tố greenwashing → Social –20, Comp –15
- 🅲 Đàm phán xin thêm 2 năm lộ trình → Profit –5, Social –5, Comp –5

**C4 — Năng lượng tái tạo**
> PR: "Cơ hội lắp pin mặt trời cho nhà máy — chi phí đầu tư lớn nhưng tiết kiệm dài hạn."
- 🅰 Đầu tư ngay toàn bộ → Profit –30, Social +20, Comp +10 | Karma sau 3 lượt: Profit +15 (tiết kiệm điện)
- 🅱 Thí điểm 30% nhà máy → Profit –12, Social +8, Comp +5
- 🅲 Từ chối — chi phí vốn quá lớn → Social –5

---

#### Nhóm D — Thị trường & Chiến lược (4 crisis)

**D1 — Ra mắt sản phẩm mới**
> R&D: "Sản phẩm mới đã sẵn sàng nhưng cần thêm 6 tháng test an toàn. Đối thủ sắp ra mắt sản phẩm tương tự."
- 🅰 Ra mắt ngay, chấp nhận rủi ro → Comp +25, Profit +15, Social –10 | Karma: lỗi sản phẩm → Comp –25, Social –20
- 🅱 Ra mắt phiên bản beta có cảnh báo → Comp +12, Profit +8, Social –5
- 🅲 Test đủ 6 tháng, ra mắt sau → Comp –10, Social +10, Morale +5

**D2 — Mở rộng thị trường**
> Chiến lược: "Cơ hội mở rộng sang thị trường Đông Nam Á — cần đầu tư lớn, rủi ro cao."
- 🅰 Mở rộng toàn lực → Profit –25, Comp +30, Morale –10 | Karma: thất bại thị trường → Profit –20, Comp –15
- 🅱 Hợp tác với đối tác địa phương → Profit –10, Comp +15, Social +10
- 🅲 Giữ thị trường nội địa, củng cố vị thế → Comp –5, Profit +5, Morale +10

**D3 — Khủng hoảng truyền thông**
> PR: "Một bài viết viral trên mạng xã hội tố cáo sản phẩm kém chất lượng — 50% là tin giả."
- 🅰 Phản hồi minh bạch, cung cấp bằng chứng → Comp –5, Social +15, Morale +5
- 🅱 Thuê luật sư kiện người tung tin → Comp –15, Social –10 | Karma: dư luận phản cảm → Comp –15
- 🅲 Im lặng chờ qua → Comp –20, Social –10

**D4 — Đối tác chiến lược**
> Chiến lược: "Tập đoàn lớn đề nghị mua lại 30% cổ phần để trở thành đối tác chiến lược."
- 🅰 Chấp nhận → Profit +20, Comp +20, Morale –5 (mất quyền tự chủ)
- 🅱 Đàm phán chỉ bán 15% → Profit +10, Comp +10
- 🅲 Từ chối, giữ độc lập → Comp –10, Social +10, Morale +15

---

## Thay đổi code cần thực hiện

### 1. `darkCeoData.ts`
- Thêm 18 crisis (thay vì 3)
- Giảm impact tối đa: mỗi lựa chọn không được làm bất kỳ chỉ số thay đổi quá ±25 ngay lập tức
- Karma tối đa ±20

### 2. `DarkCeoGame.tsx`
- **Tăng `maxTurns` lên 12**
- **Random pool**: khi `startGame()`, shuffle mảng 18 crisis → lưu vào state `crisisQueue[]`, mỗi lượt lấy `crisisQueue[turn-1]`
- **Hiển thị tip thắng**: thêm tooltip khi hover vào progress bar chỉ số
- **Nới zone nguy hiểm**: game over chỉ khi ≤ 5 (thay vì 0) để có buffer

### 3. `CeoStatsBar.tsx`
- Thêm text hint "Giữ trong 15–85% để an toàn" nhỏ phía dưới mỗi thanh

---

## Kết quả kỳ vọng

| Metric | Trước | Sau |
|---|---|---|
| Số crisis unique | 3 | 18 |
| Crisis mỗi ván | 3 lặp vòng | 12 random từ 18 |
| Thời gian ván chơi | 3–5 phút | 8–12 phút |
| Khả năng thắng người mới | ~5% | ~40% |
| Replay value | Thấp (biết hết) | Cao (không bao giờ giống ván cũ) |
