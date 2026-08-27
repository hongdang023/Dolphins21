# A1 – JTBD: Jobs-to-be-Done Analysis

> **Hệ thống**: Teacher Competency Growth OS | **Phương pháp**: JTBD Discovery (10 câu hỏi) | 2026-08-27

---

## PERSONA

> 👤 **"The Systematic Self-Developer"** — Giáo viên/mentor nghiêm túc với việc tự phát triển chuyên môn **có hệ thống**, muốn **chứng minh tiến bộ bằng dữ liệu thực** thay vì chờ nhận xét từ bên ngoài.

---

## FUNCTIONAL JOBS (FJ) – Việc cần làm thực tế

| ID | Job | Priority |
|----|-----|----------|
| **FJ-01** | Biết chính xác mình đang ở Stage nào trên từng skill TC.1–TC.5 | 🔴 P0 |
| **FJ-02** | Tìm ra điểm yếu cụ thể và so sánh với kỳ vọng Building 21 | 🔴 P0 |
| **FJ-03** | Đặt mục tiêu SMART: chọn Stage đích + deadline cụ thể | 🔴 P0 |
| **FJ-04** | Breakdown mục tiêu thành milestones: ngày → tuần → tháng → quý | 🔴 P0 |
| **FJ-05** | Lưu vết evidence (ghi chú, ví dụ thực tế) cho từng skill theo thời gian | 🔴 P0 |
| **FJ-06** | So sánh kết quả đánh giá trước/sau để thấy tiến bộ rõ ràng | 🟠 P1 |
| **FJ-07** | Xem radar chart, timeline, priority list tổng quan | 🟠 P1 |
| **FJ-08** | Quick check-in hàng tuần (<5 phút) mà không cần làm lại toàn bộ | 🟠 P1 |
| **FJ-09** | Lọc và sắp xếp skills theo điểm thấp nhất / tự chọn để biết cần focus vào đâu | 🔴 P0 |
| **FJ-10** | Đánh giá và theo dõi tiến độ ở cấp **Indicator** (không chỉ Competency) | 🔴 P0 |

> 💡 **Key Insight**: Người dùng không cần "quiz" – cần một **Growth OS**: `Assess → SMART Goal → Milestone → Evidence → Compare`

---

## EMOTIONAL JOBS (EJ) – Việc cần làm cảm xúc

| ID | Job | Trạng thái |
|----|-----|-----------|
| **EJ-01** | Cảm thấy **nhẹ nhõm** khi có công cụ cấu trúc để tự hiểu bản thân | Before state |
| **EJ-02** | Cảm thấy **tự tin** – biết rõ điểm mạnh, tự hào về chúng | After state |
| **EJ-03** | Cảm thấy **được định hướng** – luôn biết bước tiếp theo cần làm gì | After state |
| **EJ-04** | Cảm thấy **được nhìn nhận** – tiến bộ được ghi nhận rõ ràng, không mơ hồ | After state |
| **EJ-05** | Cảm thấy **có động lực** – nhìn kết quả trực quan → muốn cố gắng hơn | After state |

> ⚠️ **Pain Point lớn nhất** (EJ-06): *"Làm xong rồi không biết phải làm gì với kết quả đó"*
> → **Quy tắc thiết kế**: Mọi màn hình kết quả BẮT BUỘC có "Next Action" rõ ràng.

---

## SOCIAL JOBS (SJ) – Việc cần làm xã hội

| ID | Job | Priority |
|----|-----|----------|
| **SJ-01** | Định vị bản thân là: *"Giáo viên nghiêm túc với phát triển chuyên môn có hệ thống"* | 🟠 P1 |
| **SJ-02** | Tự chứng minh tiến bộ với mentor/coach khi cần coaching session | 🟡 P2 |
| **SJ-03** | Giữ dữ liệu private – không chia sẻ mặc định với admin hay đồng nghiệp | 🔴 P0 |

---

## JOB STORY (Chuẩn JTBD)

> **Khi** tôi đang cố gắng phát triển chuyên môn có hệ thống,
> **Tôi muốn** tự đánh giá theo Building 21, đặt mục tiêu SMART, lưu bằng chứng theo tuần/tháng/quý,
> **Để** chứng minh bằng dữ liệu thực rằng tôi đang trở thành giáo viên tốt hơn – không cần chờ ai đánh giá.

---

## FEATURE PRIORITY TỪ JTBD

| Priority | Feature | JTBD |
|----------|---------|------|
| 🔴 P0 | Self-Assessment TC.1–TC.5 (4 Stages) | FJ-01, FJ-02 |
| 🔴 P0 | SMART Goal + Milestone Breakdown | FJ-03, FJ-04 |
| 🔴 P0 | Evidence Vault per Skill | FJ-05 |
| 🔴 P0 | Actionable Next Steps mọi màn hình | EJ-06 (Pain) |
| 🔴 P0 | Private / Local-first storage | SJ-03 |
| 🟠 P1 | Progress Comparison before/after | FJ-06 |
| 🟠 P1 | Dashboard: Radar Chart + Timeline | FJ-07 |
| 🟠 P1 | Weekly Quick Check-in | FJ-08 |
| 🟡 P2 | Export PDF / Shareable link | SJ-02 |
| 🟡 P2 | Dark Mode, Mobile Responsive | UX |

---

## RAW DATA – Phỏng Vấn

| Q | Câu hỏi | Trả lời gốc |
|---|---------|------------|
| Q1 | Điều muốn làm nhất khi tự đánh giá? | Mục tiêu SMART + milestones ngày/tuần/tháng/quý + evidence lưu vết |
| Q2 | Tần suất sử dụng? | **Mỗi tuần** |
| Q3 | Phần kết quả muốn thấy nhất? | **Tất cả** (radar, priority list, timeline, roadmap) |
| Q4 | Cảm xúc khi nghĩ đến tự đánh giá? | Nhẹ nhõm – "Cuối cùng có công cụ giúp hiểu rõ bản thân" |
| Q5 | Muốn cảm thấy gì sau khi đánh giá? | **Tất cả** (tự tin, định hướng, được nhìn nhận, có động lực) |
| Q6 | Sợ nhất điều gì? | "Làm xong rồi không biết phải làm gì với kết quả đó" |
| Q7 | Ai sẽ xem kết quả? | Chủ yếu tôi, thỉnh thoảng mentor |
| Q8 | Muốn người xem phản ứng thế nào? | Chưa nghĩ đến – đây chỉ để tự dùng |
| Q9 | Muốn website định vị bạn thế nào? | "Giáo viên nghiêm túc với phát triển chuyên môn có hệ thống" |
| Q10 | 6 tháng sau nói gì với đồng nghiệp? | "Tôi chứng minh được tiến bộ bằng dữ liệu thực" |

---
*→ Tiếp theo: A2_UserStories.md – Chi tiết hóa features từ FJ/EJ/SJ*
