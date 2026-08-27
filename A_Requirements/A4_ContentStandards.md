# A4 – Content Standards: Tiêu Chuẩn Nội Dung

> **Hệ thống**: Teacher Competency Growth OS | 2026-08-27
>
> **Triết lý**: Nội dung là **"nhiên liệu"** đẩy người dùng qua vòng lặp Assess → Plan → Act → Reflect.
> Mọi mẩu nội dung phải trả lời được: _"Tôi cần làm gì tiếp theo để tiến bộ?"_

---

## 1. PHÂN LOẠI NỘI DUNG (4 loại)

| Loại                     | Nguồn              | Ai viết                                  | Mục tiêu                             |
| ------------------------ | ------------------ | ---------------------------------------- | ------------------------------------ |
| **Framework Content**    | Building 21 Excel  | Gốc tiếng Anh                            | Cung cấp rubric chuẩn để tự đánh giá |
| **System Content**       | Developer viết     | UI labels, tooltips, CTA buttons         | Điều hướng hành động                 |
| **AI-Generated Content** | Tự động từ data    | Next Action gợi ý, milestone suggestions | Giảm friction sau mỗi bước           |
| **User Content**         | Người dùng tự nhập | Evidence notes, goal names, profile      | Lưu vết bằng chứng cá nhân           |

---

## 2. TIÊU CHUẨN TỪNG LOẠI

### 2.1 Framework Content – Rubric (Stage 1–4)

Nội dung gốc từ Building 21, **không được dịch hoặc chỉnh sửa**. Chỉ được:

| Được phép                            | Không được phép                  |
| ------------------------------------ | -------------------------------- |
| ✅ Highlight từ khóa quan trọng      | ❌ Paraphrase hoặc rút gọn       |
| ✅ Chia đoạn dài thành bullet        | ❌ Thêm ý không có trong bản gốc |
| ✅ Thêm tooltip giải thích thuật ngữ | ❌ Dịch sang tiếng Việt          |
| ✅ Hiển thị citation nguồn gốc       | ❌ Thay đổi Stage boundary       |

> **Citation bắt buộc**: _Building 21 Teacher Competencies – Sandra Moumoutjis (CC BY-NC-SA 4.0)_

---

### 2.2 System Content – Labels, CTA, Tooltips

Tiêu chuẩn viết UI copy:

**Nguyên tắc: Action-First** – CTA phải là động từ + kết quả cụ thể, không phải danh từ mơ hồ.

```
❌ Sai:  "Xem kết quả"   →  Không rõ kết quả gì
❌ Sai:  "Tiếp theo"     →  Không rõ bước tiếp theo là gì
✅ Đúng: "Lưu đánh giá và xem Radar Chart"
✅ Đúng: "Đặt mục tiêu cho TC.1.1"
✅ Đúng: "Ghi bằng chứng tuần này"
```

**Ngôn ngữ**: Tiếng Việt cho toàn bộ UI. Giữ nguyên code (TC.1, TC.5.7, Stage 3...) không dịch.

**Tone**: Thân thiện, không phán xét. Tránh: "Bạn còn kém", "Chưa đạt". Dùng: "Đang phát triển", "Có thể cải thiện".

---

### 2.3 AI-Generated Content – Next Action & Suggestions

Mọi gợi ý tự động phải theo template cố định:

**Template "Next Action"** (hiển thị sau mỗi màn hình kết quả):

```
[Động từ hành động] + [Skill cụ thể] + [Kết quả kỳ vọng]

Ví dụ:
→ "Đặt mục tiêu Stage 3 cho TC.5.7 – bạn hiện đang ở Stage 1"
→ "Ghi 1 ví dụ thực tế từ lớp học cho TC.1.1 tuần này"
→ "So sánh kết quả hôm nay với snapshot tháng trước"
```

**Template "Milestone Suggestion"** (khi đặt SMART Goal):

```
Tuần [N]: [Hành động quan sát được] liên quan đến [Indicator cụ thể]

Ví dụ (Goal: TC.1.1 từ Stage 1 → Stage 3, deadline 3 tháng):
→ Tuần 1-2: Đọc mô tả Stage 2, xác định 1 hành vi cụ thể cần thay đổi
→ Tuần 3-4: Thực hành 1 lần, ghi lại bằng chứng
→ Tháng 2:  Áp dụng đều đặn, ghi evidence 2 lần/tuần
→ Tháng 3:  Self-assess lại, so sánh với Stage 3 rubric
```

---

### 2.4 User Content – Evidence Notes

Hướng dẫn hiển thị trong textarea để người dùng viết đúng:

**Prompt gợi ý** (placeholder text):

```
Mô tả điều bạn đã làm trong lớp học liên quan đến indicator này...
Ví dụ: "Ngày 15/8: Tôi đã để học sinh tự chọn bài tập theo 3 mức độ khó.
         Quan sát: 80% HS chọn mức phù hợp, 2 HS cần hỗ trợ thêm."
```

**Validation**: Evidence note có giá trị cao hơn khi có:

- ✅ Ngày cụ thể
- ✅ Hành động quan sát được (không phải cảm nhận chủ quan)
- ✅ Kết quả/phản ứng của học sinh

---

## 3. CONTENT HIERARCHY – Thứ tự hiển thị trong Assessment View

Khi người dùng đánh giá 1 Indicator, nội dung hiển thị theo thứ tự:

```
1. Competency Name       → TC.5.7 – "Use systems to organize..."  [lớn, đậm]
2. Indicator Statement   → "I collect, organize, and analyze..."  [medium]
3. Rubric Panel          → Stage 1 | Stage 2 | Stage 3 | Stage 4  [so sánh ngang]
4. Current Selection     → Highlight Stage đang chọn              [màu nổi bật]
5. Evidence Note         → Textarea ghi chứ thực                  [optional]
6. Next Action           → Gợi ý tự động sau khi chọn Stage       [luôn hiển thị]
```

> **Quy tắc**: Rubric text đầy đủ phải luôn có thể expand/xem được. Không được rút gọn nội dung Building 21 gốc.

---

## 4. MICRO-COPY STANDARDS – Các cụm từ chuẩn hóa

| Tình huống           | Cụm từ dùng                            | Cụm từ tránh            |
| -------------------- | -------------------------------------- | ----------------------- |
| Chọn Stage           | "Tôi đang ở Stage..."                  | "Điểm số của tôi là..." |
| Lưu thành công       | "Đã lưu ✓"                             | "Success!"              |
| Chưa đánh giá        | "Chưa đánh giá"                        | "N/A" hoặc "Null"       |
| Hoàn thành milestone | "Milestone đạt ✓" + field ghi evidence | Chỉ checkbox không      |
| Streak               | "X tuần liên tiếp ✨"                  | "Streak: X"             |
| Điểm thấp nhất       | "Đang phát triển nhất"                 | "Điểm yếu" / "Kém nhất" |
| Chia sẻ              | "Chia sẻ với mentor"                   | "Public" / "Xuất bản"   |

---

## 5. AUDIT QUESTIONS

1. Rubric text có giữ nguyên 100% so với Building 21 gốc không?
2. Mọi CTA có bắt đầu bằng **động từ hành động** không?
3. Có cụm từ nào mang tính **phán xét** (kém, yếu, thất bại) không? → Thay thế ngay.
4. Evidence placeholder có đủ **gợi ý cụ thể** để user viết đúng không?
5. Next Action có chứa **tên Competency/Indicator cụ thể** không, hay chỉ chung chung?

---

_→ Tham chiếu: A0_Philosophy (Tôn chỉ 1: Action over Insight) | A2_UserStories (US-TCH-D3-23: Rubric view)_
