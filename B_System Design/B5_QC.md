# B4 – QC Standards: Kiểm Soát Chất Lượng

> **Hệ thống**: Teacher Competency Growth OS | **Scope**: Manual QC + Browser testing | 2026-08-27
>
> **Triết lý**: Bug kỹ thuật = rào cản tâm lý. 1 lỗi nhỏ đủ để phá vỡ weekly habit loop.

---

## 1. QC METRIC CHO DỰ ÁN NÀY

| Metric | Target | Đo bằng cách nào |
|--------|--------|-----------------|
| **Outcome Completion Rate** | 100% flow assessment → snapshot | Manual test mỗi lần deploy |
| **Data Integrity** | 0 data loss sau refresh/close tab | Kiểm tra localStorage trước/sau |
| **Core Loop** | Assess → Goal → Evidence → Check-in không bị đứt | Walkthrough manual |
| **Load Speed** | < 2s first load | Chrome DevTools Network tab |
| **Mobile Usable** | Rubric panel readable trên 375px | Test thực tế trên iPhone |

---

## 2. CORE LOOP TEST – Walkthrough bắt buộc trước mỗi deploy

Đây là "Happy Path" phải pass 100%:

```
□ 1. Mở /onboarding/intro → đọc được 4 Stages description
□ 2. /onboarding/profile → nhập info → lưu được vào localStorage
□ 3. /assess → chọn TC.1 → thấy danh sách TC.1.1, TC.1.2...
□ 4. /assess/TC1/TC1.1 → thấy Indicators → mở Rubric 4 Stage
□ 5. Chọn Stage 2 cho Indicator → lưu tự động → refresh → vẫn còn
□ 6. Lưu Snapshot → có tên + ngày → xuất hiện trong /dashboard/compare
□ 7. /dashboard → Radar chart render đúng 5 axes
□ 8. /focus → danh sách sorted by lowest score đúng
□ 9. /focus/TC1.1 → thấy Indicators + Goals + Evidence của TC1.1
□ 10. Tạo SMART Goal → chọn Stage đích + deadline → milestones tự tạo
□ 11. Ghi Evidence note → có ngày + text → xuất hiện trong /evidence
□ 12. /checkin → hoàn thành trong <5 phút thực tế
□ 13. /export → PDF download được, có radar chart
□ 14. Export JSON → Import lại → data khôi phục đúng 100%
```

---

## 3. EDGE CASE CHECKLIST

### 3.1 Data Edge Cases
```
□ Chưa đánh giá bất kỳ Indicator nào → Dashboard hiện empty state (không crash)
□ Chỉ đánh giá 1 domain → Radar chart vẫn render (4 axes = null/0)
□ Xóa 1 Indicator rating → avgStage tính lại đúng
□ localStorage đầy (>5MB) → có thông báo rõ ràng, không crash
□ Import JSON sai format → có error message, không overwrite data hiện tại
```

### 3.2 UI Edge Cases
```
□ Rubric text rất dài (TC.5.7) → không overflow, có scroll
□ Tên người dùng rất dài → truncate đúng, không break layout
□ 0 evidence notes → Evidence Vault hiện empty state với CTA
□ 0 goals → Goals page hiện empty state với CTA
□ Streak = 0 → không hiển thị "0 tuần" mà hiển thị CTA bắt đầu
```

### 3.3 Browser Edge Cases
```
□ Chrome Desktop   → Pass
□ Safari Desktop   → Pass (check CSS variables support)
□ Chrome Mobile    → Pass (375px viewport)
□ Safari iOS       → Pass + warning nếu Private Mode (localStorage limited)
□ Firefox          → Pass
□ Dark Mode OS     → Auto-detect và apply đúng
```

---

## 4. PERFORMANCE CHECKLIST

```
□ Tổng JS bundle < 200KB (gzip)
□ building21.json < 100KB
□ Chart.js lazy load (chỉ load khi vào /dashboard)
□ html2pdf.js lazy load (chỉ load khi vào /export)
□ Không có blocking scripts trong <head>
□ Images: chỉ dùng SVG icons (không có raster images)
```

---

## 5. ACCESSIBILITY CHECKLIST (A11y)

```
□ Tất cả buttons có aria-label rõ ràng
□ Stage selector có keyboard navigation (Tab + Enter)
□ Radar chart có text alternative (bảng data)
□ Color contrast ratio ≥ 4.5:1 (WCAG AA)
□ Focus ring hiển thị rõ khi dùng Tab
□ Form inputs có label đúng chuẩn
```

---

## 6. DEPLOY CHECKLIST

Trước mỗi lần `git push main`:

```
□ Core Loop Walkthrough (Mục 2) đã pass
□ Không có console.error trong DevTools
□ localStorage data còn nguyên sau hard refresh
□ Mobile viewport (375px) không bị vỡ layout
□ building21.json có đủ data (kiểm tra random 3 competencies)
□ Dark mode toggle hoạt động
□ Export PDF tạo được file
```

---

## 7. LEAKAGE POINTS – Điểm dễ bỏ cuộc

Từ FJ/EJ trong A1_JTBD, đây là các điểm user dễ bỏ nếu có bug:

| Điểm | Risk | Phòng ngừa |
|------|------|-----------|
| Sau khi chọn Stage → không thấy lưu | Mất trust ngay | Hiện "Đã lưu ✓" trong 2 giây |
| Dashboard radar chart không render | "Tool này hỏng" | Fallback table nếu Chart.js fail |
| Milestones không tự tạo sau khi set goal | Frustrating | Unit test function generateMilestones() |
| PDF export lỗi | Không chia sẻ được với mentor | Fallback: export JSON + hướng dẫn |
| Data mất sau khi clear browser cache | Thảm họa | Nhắc export JSON định kỳ ở dashboard |

---
*→ Tham chiếu: A0_Philosophy (4 audit questions) | A2_UserStories (Proof of Work column)*
