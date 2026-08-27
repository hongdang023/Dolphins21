# A3 – Sitemap: Kiến Trúc Màn Hình

> **Hệ thống**: Teacher Competency Growth OS | **Rule**: ≤3 clicks đến nơi tạo ra giá trị | 2026-08-27
>
> **Nguyên tắc**: Mỗi màn hình phục vụ đúng 1 mục tiêu Outcome. Không có trang "chỉ để xem".

---

## TREE DIAGRAM – Cấu trúc màn hình

```
[ROOT] /
│
├── [D2] /onboarding                     ← US-TCH-D2-01, D2-02
│    ├── /onboarding/intro               ← Giới thiệu framework + 4 Stages
│    └── /onboarding/profile             ← Tạo hồ sơ giáo viên
│
├── [D3] /assess                         ← Core loop: Đánh giá năng lực
│    ├── /assess                         ← Chọn Domain để bắt đầu
│    ├── /assess/[domainId]              ← TC.1 / TC.2 / ... / TC.5
│    │    └── /assess/[domainId]/[compId] ← TC.1.1, TC.5.7... (indicators + rubrics)
│    └── /assess/snapshot               ← Lưu snapshot có tên + ngày
│
├── [D3] /dashboard                      ← Tổng quan kết quả
│    ├── /dashboard                      ← Radar chart + streak + pinned focus
│    ├── /dashboard/domains              ← Breakdown theo 5 Domains
│    └── /dashboard/compare             ← So sánh 2 snapshots
│
├── [D3] /focus                          ← Chọn & quản lý competency đang focus
│    ├── /focus                          ← Danh sách: lowest score + pinned
│    └── /focus/[compId]                ← Chi tiết: indicators, goals, evidence
│
├── [D3] /goals                          ← SMART Goals + Milestones
│    ├── /goals                          ← Danh sách tất cả goals đang active
│    └── /goals/[goalId]                ← Chi tiết: timeline, milestones, evidence
│
├── [D3] /evidence                       ← Evidence Vault
│    ├── /evidence                       ← Toàn bộ notes theo thời gian
│    └── /evidence/[indicatorId]        ← Notes của 1 indicator cụ thể
│
├── [D3] /checkin                        ← Weekly quick check-in (<5 phút)
│
└── [D3] /export                         ← US-TCH-D3-15: Xuất PDF / Share link
```

---

## PAGE INVENTORY – Bảng quản trị màn hình

| Trang | Domain | Outcome | Stories | Primary Action |
|-------|--------|---------|---------|----------------|
| `/onboarding/intro` | D2 | Hiểu framework, sẵn sàng tự đánh giá trung thực | D2-01 | → Bắt đầu Assessment |
| `/onboarding/profile` | D2 | Profile được lưu, hệ thống cá nhân hóa | D2-02 | → Vào Dashboard |
| `/assess` | D3 | Chọn điểm bắt đầu đánh giá | D3-01 | → Chọn Domain |
| `/assess/[domainId]` | D3 | Xem tất cả competencies trong 1 domain + trạng thái | D3-01 | → Chọn Competency |
| `/assess/[domainId]/[compId]` | D3 | Đánh giá từng Indicator, xem Rubric 4 Stage cạnh nhau | D3-01, D3-23 | → Lưu Stage / Next Indicator |
| `/assess/snapshot` | D3 | Snapshot được lưu với tên + ngày để so sánh sau | D3-03 | → Xem Dashboard |
| `/dashboard` | D3 | Thấy radar chart + focus items + streak + next action | D3-10, D3-14, D3-04 | → Vào Focus / Goals |
| `/dashboard/domains` | D3 | Breakdown điểm Stage theo từng Domain + Competency | D3-10, D3-16 | → Pin / Xem detail |
| `/dashboard/compare` | D3 | So sánh 2 snapshots, thấy tiến bộ bằng dữ liệu thực | D3-11, D3-12 | → Ghi evidence |
| `/focus` | D3 | Danh sách sorted by lowest score + pinned competencies | D3-16, D3-17 | → Pin / Vào detail |
| `/focus/[compId]` | D3 | Chi tiết Indicators + Goals + Evidence của 1 Competency | D3-18, D3-19, D3-21 | → Thêm Goal / Evidence |
| `/goals` | D3 | Tất cả SMART Goals đang active, theo deadline | D3-05 | → Xem detail Goal |
| `/goals/[goalId]` | D3 | Milestones breakdown + check off + gắn evidence | D3-05, D3-06, D3-09 | → Mark milestone done |
| `/evidence` | D3 | Tất cả notes/evidence sorted by date | D3-07, D3-08 | → Thêm note |
| `/evidence/[indicatorId]` | D3 | Notes của 1 indicator + history Stage qua các snapshots | D3-07, D3-22 | → Thêm note |
| `/checkin` | D3 | Quick update: chọn skills focus, ghi 1 evidence mới | D3-13, D3-14 | → Done (≤5 phút) |
| `/export` | D3 | Export PDF hoặc tạo shareable link | D3-15, MNT-D3-01 | → Download / Copy link |

---

## NAVIGATION FLOW – Luồng chính theo User Journey

```
Lần đầu dùng:
  /onboarding/intro → /onboarding/profile → /assess → /assess/TC.1/TC.1.1
  → /assess/snapshot → /dashboard → /focus → /goals/[goalId]

Hàng tuần (≤5 phút):
  /checkin → /evidence/[indicatorId] → /dashboard

Review tiến bộ:
  /dashboard/compare → /focus/[compId] → /goals/[goalId]

Chia sẻ với mentor:
  /dashboard → /export → [PDF hoặc link]
```

---

## RULE OF 3 CLICKS – Kiểm tra

| Tác vụ | Path | Clicks |
|--------|------|--------|
| Ghi evidence cho 1 indicator | Dashboard → Focus → /evidence/[id] | 2 |
| Check milestone hoàn thành | Dashboard → Goals → /goals/[id] | 2 |
| Bắt đầu đánh giá TC.5.7 | Assess → TC.5 → TC.5.7 | 2 |
| So sánh 2 lần đánh giá | Dashboard → Compare | 1 |
| Quick check-in | Dashboard → Check-in | 1 |
| Xem skill thấp điểm nhất | Dashboard → Focus | 1 |

> ✅ Tất cả tác vụ quan trọng đều đạt ≤3 clicks.

---

## AUDIT QUESTIONS

1. Mỗi màn hình có **1 Primary Action** rõ ràng chưa? (không phải menu chọn)
2. Từ bất kỳ màn hình nào, có về được `/dashboard` trong **1 click** không?
3. `/checkin` có đủ nhanh (<5 phút, <3 clicks) không? Nếu không → đơn giản hóa.
4. Có màn hình nào **"dead end"** (không có next action) không? → xóa hoặc thêm CTA.

---
*→ Tiếp theo: B1_DataModel.md – Cấu trúc localStorage cho 4 tầng: Domain/Competency/Indicator/Rubric*
