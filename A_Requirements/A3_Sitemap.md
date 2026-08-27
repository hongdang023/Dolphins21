# A3 – Sitemap: Kiến Trúc Màn Hình & Navigation Audit

> **Hệ thống**: Teacher Competency Growth OS | **Rule**: ≤3 clicks đến nơi tạo ra giá trị | Cập nhật: 2026-08-27
>
> **Nguyên tắc**: Mỗi màn hình phục vụ đúng 1 mục tiêu Outcome. Tối giản tối đa thanh điều hướng, đưa các hành động phụ trợ về đúng ngữ cảnh sử dụng (Contextual Actions).

---

## 1. NAVIGATION AUDIT & TINH GỌN (Consolidation & Contextual Actions)

### 1.1 Vấn đề cấu trúc cũ:
1. **Phân mảnh luồng tư duy**: `Focus` (chọn trọng tâm), `Mục tiêu` (Goals & Milestones), và `Evidence` (lưu vết bằng chứng) bị chia thành 3 tab riêng biệt.
2. **Nav Bar bị quá tải bởi các hành động phụ trợ**: 
   - `Export` (Xuất PDF / Chia sẻ link) bản chất là tác vụ đầu ra theo ngữ cảnh báo cáo, không cần chiếm 1 vị trí cố định trên Nav chính.
   - `Check-in` (Phản tư tuần) là một hành động (action trigger) định kỳ, phù hợp đặt thành Widget/Prompt ngay trong `Dashboard` và `Growth Plan`.

### 1.2 Giải pháp tinh gọn: Cấu trúc 3 Trụ Cột Tinh Gọn (The Lean 3-Pillar Nav)
- **Header Navigation Bar chuẩn 100% Tiếng Anh với đúng 3 mục chính**:
  1. `Dashboard` (Trung tâm dữ liệu & Tổng quan tiến độ)
  2. `Assessment` (Không gian tự đánh giá năng lực 4 Stages)
  3. `Growth Plan` (Kế hoạch phát triển: Pinned Focus + SMART Goals + Evidence Vault)
- **Tích hợp theo ngữ cảnh (Contextual Placement)**:
  - **Export & Share**: Tích hợp trực tiếp thành Action Menu / Nút bấm trên `Dashboard` (VD: "Export Portfolio PDF", "Share with Mentor") và trên từng Snapshot chi tiết.
  - **Weekly Check-in**: Tích hợp thành Widget tương tác nhanh (<5 phút) ngay trên `Dashboard` và `Growth Plan` (với modal/drawer tiện dụng, tự động cập nhật streak).

---

## 2. TREE DIAGRAM – Cấu trúc màn hình & Luồng ngữ cảnh

```
[ROOT] /
│
├── [D2] /onboarding                     ← Onboarding & Setup ban đầu
│    ├── /onboarding/intro               ← Giới thiệu framework Building 21 + 4 Stages
│    └── /onboarding/profile             ← Hồ sơ giáo viên & môn giảng dạy
│
├── [D3] /dashboard                      ← [NAV ITEM 1] Dashboard: Báo cáo trực quan & Trung tâm dữ liệu
│    ├── /dashboard                      ← Radar Chart 5 trục, Streak widget, Quick Check-in CTA, Actionable Insights
│    ├── /dashboard/compare              ← So sánh Before/After giữa 2 Snapshots (Overlay & Diff)
│    └── [Contextual Action: Export]     ← Modal / Drawer xuất PDF Dossier & tạo link chia sẻ mentor
│
├── [D3] /assess                         ← [NAV ITEM 2] Assessment: Đánh giá năng lực chuẩn hóa
│    ├── /assess                         ← Tổng quan 5 Domains & tiến độ đánh giá
│    ├── /assess/[domainId]              ← Danh sách Competencies theo Domain (TC.1 → TC.5)
│    ├── /assess/[domainId]/[compId]     ← Đánh giá Indicator & Rubric 4 Stages
│    └── /assess/snapshot                ← Lưu mốc đánh giá (Snapshot có tên & ngày)
│
└── [D3] /growth                         ← [NAV ITEM 3] Growth Plan: Không gian hành động hợp nhất
     ├── /growth                         ← Tổng quan Focus items, SMART Goals đang chạy & Evidence feed
     ├── /growth/[compId]                ← Chi tiết 1 Competency: Indicators, Target Stage, Milestones & Evidence Vault
     └── [Contextual Action: Check-in]   ← Weekly Quick Check-in Drawer (<5 phút, cập nhật goal & note)
```

---

## 3. HEADER NAVIGATION BAR SPECS (Lean 3-Item English Nav)

| Nav Item | Route | Mục đích chính | Huy hiệu / Trạng thái |
|----------|-------|----------------|-----------------------|
| **Logo (Dolphins21)** | `/dashboard` | Về trang chủ | — |
| **Dashboard** | `/dashboard` | Radar Chart, phân tích tiến độ, so sánh snapshot, xuất PDF | Streak badge (VD: `🔥 4w`) |
| **Assessment** | `/assess` | Tự đánh giá 34 Competencies theo 4 Stages Building 21 | Active snapshot date |
| **Growth Plan** | `/growth` | Hub hành động: Focus Competencies + SMART Goals + Evidence | Số goals active (VD: `3 Active`) |

---

## 4. PAGE & CONTEXTUAL ACTION INVENTORY

| Tuyến đường / Thành phần | Domain | Mục tiêu Outcome | Stories tương ứng | Vị trí / Primary Action |
|--------------------------|--------|------------------|-------------------|-------------------------|
| `/onboarding/intro` | D2 | Hiểu chuẩn 4 Stages & 5 Domains trước khi tự đánh giá | US-TCH-D2-01 | Màn onboarding → Setup Profile |
| `/onboarding/profile` | D2 | Khởi tạo hồ sơ, kích hoạt trải nghiệm cá nhân hóa | US-TCH-D2-02 | Form setup → Vào Assessment đầu tiên |
| `/dashboard` | D3 | Toàn cảnh năng lực (Radar chart), streak, prompt check-in & export | US-TCH-D3-10, D3-14, D3-04 | **Nav Item 1** → Xem Growth Plan / Check-in |
| `/dashboard/compare` | D3 | So sánh 2 snapshots để thấy rõ sự tăng/giảm Stage | US-TCH-D3-11, D3-12 | Sub-view từ Dashboard → Ghi nhận tiến bộ |
| *[Export Modal / Feature]* | D3 | Tạo PDF Portfolio hoặc Link chia sẻ Mentor bảo mật | US-TCH-D3-15, US-MNT-D3-01 | **Nút bấm trên Dashboard** → Tải PDF / Copy Link |
| `/assess` | D3 | Chọn Domain để đánh giá, theo dõi tiến độ hoàn thành | US-TCH-D3-01 | **Nav Item 2** → Chọn Domain tiếp tục |
| `/assess/[domainId]` | D3 | Xem danh sách Competencies trong Domain + trạng thái | US-TCH-D3-01 | Sub-view → Chọn Competency |
| `/assess/[domainId]/[compId]` | D3 | Đọc Rubric 4 Stage và chọn Stage cho từng Indicator | US-TCH-D3-01, D3-19, D3-23 | Sub-view → Lưu Stage & Sang Indicator tiếp |
| `/assess/snapshot` | D3 | Đóng gói Snapshot có gắn nhãn thời gian | US-TCH-D3-03 | Cuối assessment → Xem Dashboard kết quả |
| `/growth` | D3 | Quản lý tập trung các ưu tiên phát triển, SMART Goals & Evidence | US-TCH-D3-16, D3-17, D3-05, D3-07 | **Nav Item 3** → Thêm Goal / Chi tiết Focus |
| `/growth/[compId]` | D3 | Không gian 360° cho 1 skill: Mục tiêu Stage, Milestones & Evidence | US-TCH-D3-18, D3-21, D3-06, D3-09, D3-22 | Sub-view → Đánh dấu Milestone / Thêm Evidence |
| *[Weekly Check-in Drawer]* | D3 | Phản tư tuần nhanh (<5 phút) để cập nhật tiến độ & giữ streak | US-TCH-D3-13, D3-14 | **Widget trên Dashboard & Growth** → Hoàn tất check-in |

---

## 5. NAVIGATION FLOW & USER JOURNEYS

```
1. Khởi tạo ban đầu (First-time Onboarding):
   /onboarding/intro → /onboarding/profile → /assess → /assess/[domainId]/[compId]
   → /assess/snapshot → /dashboard (thấy ngay Radar chart và gợi ý vùng cần phát triển)

2. Thói quen hàng tuần (Weekly Check-in Routine ≤5 phút):
   /dashboard hoặc /growth → Mở Quick Check-in Drawer → Cập nhật milestone & ghi 1 note → Hoàn thành (Streak +1)

3. Thực hiện kế hoạch phát triển (Growth Execution):
   /growth → /growth/[compId] → Check milestone hoàn thành + Đính kèm bằng chứng thực tế (Evidence)

4. Đánh giá lại định kỳ & Đối chiếu (Review & Compare):
   /assess (lưu snapshot mới) → /dashboard/compare (đối chiếu trực quan thay đổi Stage)

5. Xuất hồ sơ cho Mentor (Export & Share):
   /dashboard → Nút "Export Portfolio / Share" → Tải file PDF chuẩn hóa hoặc gửi link bảo mật cho Mentor
```

---

## 6. RULE OF ≤3 CLICKS – Kiểm tra & Đối chiếu

| Tác vụ của Giáo viên | Đường dẫn thao tác | Số Clicks | Đạt chuẩn |
|----------------------|-------------------|:---------:|:---------:|
| Khởi động Weekly Check-in | Click nút Check-in trên widget Dashboard / Growth Plan | 1 | ✅ |
| Xuất hồ sơ PDF gửi Mentor | Click nút `Export PDF` trên Dashboard Header | 1–2 | ✅ |
| Ghi Evidence cho Skill đang focus | Header `Growth Plan` (1) → Chọn Skill (2) → Nhập Note (3) | 2–3 | ✅ |
| Check hoàn thành 1 Milestone | Header `Growth Plan` (1) → Check checkbox trên card (2) | 2 | ✅ |
| So sánh 2 lần đánh giá gần nhất | Header `Dashboard` (1) → Click `Compare Snapshots` (2) | 2 | ✅ |
| Bắt đầu đánh giá 1 Competency mới | Header `Assessment` (1) → Chọn Domain (2) → Chọn Skill (3) | 3 | ✅ |

---

## 7. AUDIT CHECKLIST

- [x] **Header Nav Tinh Gọn**: Chỉ giữ đúng 3 mục cốt lõi (`Dashboard`, `Assessment`, `Growth Plan`) bằng 100% Tiếng Anh.
- [x] **Hành Động Đúng Ngữ Cảnh**: `Export` được đặt tại Dashboard (nơi có dữ liệu tổng quan cần xuất), `Check-in` đặt thành widget tương tác tại Dashboard/Growth Plan.
- [x] **Khử trùng lặp triệt để**: Gom toàn bộ Focus, Goals, Evidence về chung một mái nhà `Growth Plan`.
- [x] **Zero Dead-end**: Mọi trang đều có Call to Action dẫn dắt hành động tiếp theo.
- [x] **Chuẩn ≤3 Clicks**: Toàn bộ luồng thao tác đều hoàn thành trong vòng 1-3 click.

---
*→ Tham chiếu: [A0_Philosophy.md](file:///Users/danghong/Documents/Mentors%20Guideline/A_Requirements/A0_Philosophy.md) | [A2_UserStories.md](file:///Users/danghong/Documents/Mentors%20Guideline/A_Requirements/A2_UserStories.md) | [A4_ContentStandards.md](file:///Users/danghong/Documents/Mentors%20Guideline/A_Requirements/A4_ContentStandards.md)*
