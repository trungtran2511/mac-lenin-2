# Agent Instructions — my-mln-learning-2

## Typography Rules (MANDATORY)

Mọi component mới hoặc chỉnh sửa giao diện PHẢI tuân theo hệ thống typography thống nhất sau.
**Không được tự ý dùng font hoặc cỡ chữ ngoài bảng này.**

---

### Fonts

| Mục đích | Font | Cách dùng trong code |
|---|---|---|
| **Tiêu đề lớn** (h1, h2, tên trang, tên chức năng) | `'Instrument Serif', serif` | `style={{ fontFamily: "'Instrument Serif', serif" }}` |
| **Body / UI chung** | `'Inter', sans-serif` | mặc định (đã khai báo trong `body` của `index.css`) |

> ❌ **KHÔNG dùng** `font-black`, `font-extrabold` kết hợp với font mặc định cho tiêu đề trang — phải dùng Instrument Serif.

---

### Cỡ chữ chuẩn

| Tầng | Loại nội dung | Class Tailwind | Pixel tương đương |
|---|---|---|---|
| **H2 — Tên trang / chức năng** | Tiêu đề section lớn nhất | `text-3xl md:text-5xl` | ~30–48px |
| **H2 — Tên màn game / sub-feature** | Tiêu đề trong component | `text-3xl md:text-4xl` | ~30–36px |
| **H3 — Tên chất mới / kết quả epic** | Tiêu đề hero nổi bật | `text-4xl md:text-6xl` | ~36–60px |
| **Body chính — nội dung học thuật** | Văn bản giải thích, phân tích | `text-[21px]` | 21px |
| **Body chính — game / UI tương tác** | Chat, lựa chọn, mô tả | `text-[18px]` | 18px |
| **Body phụ — nhãn, tên chỉ số** | Labels, stat names | `text-[16px]` | 16px |
| **Caption / mô tả nhỏ** | Tooltip, note, phụ chú | `text-[15px]` | 15px |
| **Label / tag nhỏ** | Badge, mono label, metadata | `text-xs font-mono` | ~12px |

> 📌 **Tham chiếu chuẩn**: Xem [SectionDetailPanel.tsx](../src/components/SectionDetailPanel.tsx) — đây là component chuẩn vàng cho typography của dự án.
> Đặc biệt: body text dùng `text-[21px] leading-relaxed`, heading dùng Instrument Serif `text-3xl md:text-5xl`.

---

### Ví dụ chuẩn

```tsx
{/* ✅ ĐÚNG — Tiêu đề trang/chức năng */}
<h2
  className="text-3xl md:text-5xl text-white tracking-tight"
  style={{ fontFamily: "'Instrument Serif', serif" }}
>
  Tên Chức Năng
</h2>

{/* ✅ ĐÚNG — Tiêu đề trong component game */}
<h2
  className="text-3xl md:text-4xl text-white"
  style={{ fontFamily: "'Instrument Serif', serif" }}
>
  Tên Màn Game
</h2>

{/* ✅ ĐÚNG — Nội dung học thuật (giải thích, tóm tắt) */}
<p className="text-[21px] text-white/85 leading-relaxed font-normal">
  Nội dung giáo trình...
</p>

{/* ✅ ĐÚNG — Nội dung game / chat / lựa chọn */}
<p className="text-[18px] text-neutral-300 leading-relaxed font-light">
  Nội dung tương tác...
</p>

{/* ❌ SAI — KHÔNG dùng text-xs/text-sm cho nội dung đọc được */}
<p className="text-xs text-neutral-400">...</p>

{/* ❌ SAI — KHÔNG dùng font-black thay cho Instrument Serif ở tiêu đề */}
<h2 className="text-2xl font-black text-white">Tiêu đề</h2>
```

---

### Line height chuẩn

- Nội dung đọc dài: `leading-relaxed` (1.625)
- Tiêu đề ngắn: `leading-tight` (1.25)
- Body game UI: `leading-relaxed`

---

### Áp dụng cho từng chức năng

| Chức năng | Trạng thái typography |
|---|---|
| **Tự Học & Ôn Tập** (`SectionDetailPanel`) | ✅ Chuẩn vàng — KHÔNG sửa |
| **Thầy Nam AI** (`InlineQuizChat`) | ✅ Đã đồng bộ `text-lg` |
| **Biện Chứng Kỳ Đài** (`CardBattleArena`, `BattlefieldPanel`, `SynthesisResult`) | ✅ Đã đồng bộ |
| **Giám Đốc Hắc Ám** (`DarkCeoGame`, `SlackChatPanel`, `CeoStatsBar`) | ✅ Đã đồng bộ |
| **Kinh Tế Kỳ Thành** (`SimEconCity`) | ✅ Đã đồng bộ |
| **Hiểu Lương & Thặng Dư** (`SalaryCalculatorPanel`) | ✅ Đã đồng bộ |
| **Trắc Nghiệm Ôn Luyện** (`FlexibleQuizBuilder`) | ✅ `text-[20px]` câu hỏi/đáp án |

---

### Quy tắc tuyệt đối

1. **Tiêu đề chức năng luôn dùng Instrument Serif** — không exception
2. **Nội dung đọc được không nhỏ hơn 15px** — không dùng `text-xs` cho text người dùng đọc
3. **Không sửa bất kỳ thứ gì trong `self-study` / `SectionDetailPanel`** — đây là chuẩn tham chiếu
4. **Kiểm tra typecheck (`npx tsc --noEmit`) trước khi commit** bất kỳ thay đổi typography nào
