# A2 – User Stories: Câu Chuyện Kết Quả

> **Hệ thống**: Teacher Competency Growth OS | **Framework**: DAC Outcome-Based | 2026-08-27
>
> **Quy tắc ID**: `US-[ROLE]-[DOMAIN]-[INDEX]`
> - **ROLE**: TCH (Teacher/primary user), MNT (Mentor/coach)
> - **DOMAIN**: D2 (Onboarding/Conversion), D3 (Achievement/core loop)
> - **Cấu trúc story**: `Là [vai trò], tôi muốn [hành động], để [OUTCOME đo lường được].`
> - **Mỗi story phải có**: Functional Job + Emotional Job + Proof of Work

---

## DOMAIN II – ONBOARDING (Conversion)
> *Mục tiêu: Đưa người dùng từ "chưa biết mình ở đâu" vào hệ thống có cam kết.*

| ID | Story | Functional Job | Emotional Job | Proof of Work |
|----|-------|---------------|---------------|---------------|
| **US-TCH-D2-01** | Là giáo viên lần đầu dùng hệ thống, tôi muốn **đọc giải thích 4 Stages (Novice→Expert) và 5 nhóm TC** trước khi bắt đầu, để tôi tự đánh giá trung thực thay vì chọn đại. | FJ-01: Hiểu framework | EJ-01: Nhẹ nhõm, có hướng dẫn | Màn hình intro đã xem + nút "Bắt đầu" được kích hoạt |
| **US-TCH-D2-02** | Là giáo viên, tôi muốn **tạo hồ sơ cơ bản** (tên, môn dạy, số năm kinh nghiệm), để hệ thống cá nhân hóa dashboard và nhắc nhở phù hợp. | FJ-01: Khởi tạo profile | EJ-02: Tự tin – đây là công cụ của tôi | Profile được lưu vào localStorage |

---

## DOMAIN III – ASSESSMENT (Đánh giá năng lực)
> *Mục tiêu: Tạo ra snapshot năng lực chính xác, trung thực, có thể so sánh.*

| ID | Story | Functional Job | Emotional Job | Proof of Work |
|----|-------|---------------|---------------|---------------|
| **US-TCH-D3-01** | Là giáo viên, tôi muốn **xem mô tả 4 Stages cạnh nhau cho từng indicator** của TC.1–TC.5, để tôi chọn đúng Stage phản ánh thực tế mình đang làm. | FJ-01, FJ-02 | EJ-02: Tự tin khi chọn | Stage được lưu cho từng indicator (JSON localStorage) |
| **US-TCH-D3-02** | Là giáo viên, tôi muốn **lưu tiến độ tự động** khi chọn Stage, để tôi có thể đóng tab và tiếp tục hôm sau mà không mất dữ liệu. | FJ-01 | EJ-01: Nhẹ nhõm, không áp lực | `assessment_progress` key trong localStorage có timestamp |
| **US-TCH-D3-03** | Là giáo viên, tôi muốn **lưu snapshot đánh giá có tên và ngày**, để tôi có nhiều mốc thời gian để so sánh sau này. | FJ-06 | EJ-04: Được nhìn nhận – tiến bộ có dấu mốc | Snapshot object lưu với `{id, date, label, scores[]}` |

---

## DOMAIN III – SMART GOALS (Lập kế hoạch)
> *Mục tiêu: Biến kết quả đánh giá thành hành động có deadline và milestone cụ thể.*

| ID | Story | Functional Job | Emotional Job | Proof of Work |
|----|-------|---------------|---------------|---------------|
| **US-TCH-D3-04** | Là giáo viên vừa xong assessment, tôi muốn **thấy "Next Action" gợi ý ngay** sau mỗi màn hình kết quả, để tôi không rơi vào trạng thái "xem xong không biết làm gì". | FJ-03, EJ-06 (pain) | EJ-03: Được định hướng | Action item xuất hiện tự động dựa trên Stage thấp nhất |
| **US-TCH-D3-05** | Là giáo viên, tôi muốn **đặt mục tiêu SMART cho từng skill**: chọn Stage đích + deadline (ngày/tuần/tháng/quý), để tôi có cam kết rõ ràng thay vì mục tiêu mơ hồ. | FJ-03, FJ-04 | EJ-03: Định hướng, EJ-05: Động lực | Goal object: `{skillId, currentStage, targetStage, deadline, milestones[]}` |
| **US-TCH-D3-06** | Là giáo viên, tôi muốn **xem milestones được breakdown tự động** theo tuần/tháng từ deadline đã chọn, để tôi biết mỗi tuần cần đạt được gì. | FJ-04 | EJ-03: Định hướng rõ ràng | Milestone list hiển thị với checkbox và due date |

---

## DOMAIN III – EVIDENCE VAULT (Lưu vết)
> *Mục tiêu: Biến bằng chứng thực tế thành dữ liệu chứng minh tiến bộ.*

| ID | Story | Functional Job | Emotional Job | Proof of Work |
|----|-------|---------------|---------------|---------------|
| **US-TCH-D3-07** | Là giáo viên, tôi muốn **ghi note tự do cho từng skill** (ví dụ thực tế, bằng chứng từ lớp học, link tài liệu), để tôi tích lũy bằng chứng tiến bộ theo thời gian. | FJ-05 | EJ-04: Được nhìn nhận – có bằng chứng thật | Note object: `{skillId, date, text, tags[]}` lưu localStorage |
| **US-TCH-D3-08** | Là giáo viên, tôi muốn **thấy icon "có ghi chú" trên skill đã có evidence**, để tôi biết skill nào đã được tài liệu hóa và skill nào còn thiếu. | FJ-05 | EJ-02: Tự tin – dữ liệu đầy đủ | Visual indicator (dot/icon) trên skill card khi `notes.length > 0` |
| **US-TCH-D3-09** | Là giáo viên, tôi muốn **đánh dấu milestone đã hoàn thành** và ghi lại bằng chứng kèm theo, để mỗi milestone không chỉ là checkbox mà là evidence thật. | FJ-04, FJ-05 | EJ-02: Tự tin, EJ-04: Được nhìn nhận | Milestone: `{completed: true, completedAt, evidenceNote}` |

---

## DOMAIN III – DASHBOARD & PROGRESS (Theo dõi tiến độ)
> *Mục tiêu: Trực quan hóa hành trình để duy trì động lực và chứng minh tiến bộ.*

| ID | Story | Functional Job | Emotional Job | Proof of Work |
|----|-------|---------------|---------------|---------------|
| **US-TCH-D3-10** | Là giáo viên, tôi muốn **xem radar chart 5 trục (TC.1–TC.5)** sau khi đánh giá, để tôi thấy ngay profile năng lực tổng quan của mình. | FJ-07 | EJ-02: Tự tin, EJ-05: Động lực | Radar chart render với điểm Stage trung bình mỗi nhóm |
| **US-TCH-D3-11** | Là giáo viên, tôi muốn **so sánh 2 snapshot đánh giá** (before vs. after) trên cùng radar chart, để tôi thấy rõ mình đã tiến bộ ở đâu và còn kẹt ở đâu. | FJ-06 | EJ-04: Được nhìn nhận – tiến bộ có bằng chứng | Radar chart overlay 2 màu, bảng diff: tăng/giảm/không đổi |
| **US-TCH-D3-12** | Là giáo viên, tôi muốn **xem timeline điểm Stage trung bình** qua các lần đánh giá, để tôi thấy xu hướng phát triển dài hạn. | FJ-06, FJ-07 | EJ-04, EJ-05 | Line chart với X=thời gian, Y=avg Stage, mỗi point là 1 snapshot |

---

## DOMAIN III – WEEKLY HABIT (Duy trì thói quen)
> *Mục tiêu: Giảm friction để người dùng check-in mỗi tuần, không chỉ dùng khi có review.*

| ID | Story | Functional Job | Emotional Job | Proof of Work |
|----|-------|---------------|---------------|---------------|
| **US-TCH-D3-13** | Là giáo viên, tôi muốn **quick check-in hàng tuần (<5 phút)**: chỉ cập nhật skills đang focus và ghi 1 evidence mới, để tôi duy trì thói quen mà không cần làm lại toàn bộ assessment. | FJ-08 | EJ-05: Động lực – thấy mình tiến đều | Weekly log entry: `{week, updatedSkills[], newEvidence}` |
| **US-TCH-D3-14** | Là giáo viên, tôi muốn **thấy streak "X tuần liên tiếp"** trên dashboard, để tôi có thêm động lực duy trì thói quen check-in. | FJ-08 | EJ-05: Động lực, EJ-02: Tự hào | `weeklyStreak` counter tính từ consecutive weekly logs |

---

## DOMAIN III – SHARE (Chia sẻ có chọn lọc)
> *Mục tiêu: Cho phép chia sẻ với mentor khi cần, không bao giờ là mặc định.*

| ID | Story | Functional Job | Emotional Job | Proof of Work |
|----|-------|---------------|---------------|---------------|
| **US-TCH-D3-15** | Là giáo viên, tôi muốn **export kết quả ra PDF** với radar chart và bảng skills, để tôi chia sẻ với mentor hoặc lưu vào hồ sơ chuyên môn khi cần. | SJ-02 | SJ-01: Định vị professional | PDF file được download với timestamp và tên người dùng |
| **US-MNT-D3-01** | Là mentor, tôi muốn **xem kết quả đánh giá của mentee** (khi họ chia sẻ), để tôi chuẩn bị coaching session với dữ liệu thực thay vì hỏi lại từ đầu. | SJ-02 | — | Link shareable read-only hoặc PDF từ US-TCH-D3-15 |

---

## AUDIT CHECKLIST

Trước khi build bất kỳ story nào, kiểm tra:
1. Story có dẫn đến **Outcome đo lường được** không? (không phải chỉ "xem" hay "biết")
2. **Proof of Work** có cụ thể về data structure không?
3. Story có vi phạm **4 câu hỏi audit** trong A0_Philosophy không?
4. Story có tương ứng với **FJ/EJ/SJ** trong A1_JTBD không?

---
*→ Tiếp theo: A3_Sitemap.md – Map các stories vào màn hình cụ thể*

---

## HIERARCHY MAP – Cấu trúc dữ liệu Building 21

> Mọi story đánh giá phải tham chiếu đúng tầng trong hierarchy này (4 tầng thực tế từ Excel):

```
Domain      →  TC.1 / TC.2 / TC.3 / TC.4 / TC.5  (5 domains = 5 sheets)
   └── Competency →  TC.1.1 / TC.1.2 / TC.5.7...  (34 competencies tổng)
            └── Indicator  →  Mỗi câu "I am / I can..." (nhiều rows/competency)
                     └── Rubric  →  Stage 1 / Stage 2 / Stage 3 / Stage 4
```

**Ví dụ cụ thể:**
```
Domain:     TC.5 – Facilitating Personalized Learning
Competency: TC.5.7 – Use systems to organize, manage, and analyze data
Indicator:  "I collect, organize, and analyze objective data from multiple sources..."
Rubric:     Stage 3 → [mô tả đầy đủ hành vi ở Stage 3]
```

> **Data point cơ bản nhất** = 1 Indicator + Stage được chọn → đây là đơn vị tracking nhỏ nhất.

---

## DOMAIN III – SKILL SELECTION & FOCUS (Chọn skill để cải thiện)
> *Mục tiêu: Không bị overwhelmed bởi 34 competencies – biết chọn đúng chỗ cần cải thiện.*

| ID | Story | Functional Job | Emotional Job | Proof of Work |
|----|-------|---------------|---------------|---------------|
| **US-TCH-D3-16** | Là giáo viên vừa xong assessment, tôi muốn **xem danh sách competencies được sắp xếp từ điểm thấp nhất lên cao nhất**, để tôi thấy ngay mình đang yếu nhất ở đâu mà không cần tự tính. | FJ-09 | EJ-03: Định hướng rõ ràng | Sorted list: `competencies sorted by avgStage ASC`, hiển thị gap vs Stage 4 |
| **US-TCH-D3-17** | Là giáo viên, tôi muốn **tự "pin" 2–3 competencies tôi muốn focus** trong chu kỳ này (dù không phải thấp nhất), để tôi phát triển theo ưu tiên cá nhân thay vì bị hệ thống áp đặt. | FJ-09 | EJ-02: Tự tin – tôi kiểm soát lộ trình | `pinnedCompetencies[]` lưu localStorage, hiển thị badge "Đang focus" |
| **US-TCH-D3-18** | Là giáo viên, tôi muốn **thấy Focus Dashboard** chỉ hiển thị các competencies đang pin, với indicators, goals và evidence của chúng, để tôi không bị distract bởi 34 competencies còn lại. | FJ-09 | EJ-03: Định hướng, EJ-05: Động lực | Filtered view chỉ render pinned items; toggle "Xem tất cả / Chỉ đang focus" |

---

## DOMAIN III – INDICATOR TRACKING (Theo dõi cấp Indicator)
> *Mục tiêu: Granularity đủ sâu để tiến bộ từng "I can..." statement có thể được chứng minh.*

| ID | Story | Functional Job | Emotional Job | Proof of Work |
|----|-------|---------------|---------------|---------------|
| **US-TCH-D3-19** | Là giáo viên, tôi muốn **xem và đánh giá từng Indicator riêng lẻ** trong một Competency (không phải đánh giá 1 điểm cho cả competency), để kết quả phản ánh đúng sự không đồng đều trong thực tế. | FJ-10 | EJ-02: Tự tin – chính xác hơn | `indicators[]: {id, competencyId, stage, updatedAt}` – mỗi indicator 1 entry riêng |
| **US-TCH-D3-20** | Là giáo viên, tôi muốn **thấy điểm Stage trung bình của một Competency được tính tự động** từ các Indicators con, để tôi không cần tự tính mà vẫn có picture tổng quan. | FJ-10, FJ-07 | EJ-04: Được nhìn nhận – hệ thống ghi nhận tự động | `competency.avgStage = mean(indicators[].stage)` – tính realtime |
| **US-TCH-D3-21** | Là giáo viên, tôi muốn **đặt SMART Goal và lưu Evidence ở cấp Indicator** (không phải chỉ competency), để kế hoạch phát triển đủ cụ thể để thực hiện được. | FJ-03, FJ-04, FJ-05, FJ-10 | EJ-03: Định hướng cực kỳ cụ thể | Goal: `{indicatorId, currentStage, targetStage, deadline}` + Evidence note per indicator |
| **US-TCH-D3-22** | Là giáo viên, tôi muốn **xem progress history của từng Indicator** qua các lần assessment, để tôi thấy rõ từng "I can..." statement tôi đã cải thiện hay thụt lùi theo thời gian. | FJ-06, FJ-10 | EJ-04: Được nhìn nhận – bằng chứng chi tiết | Indicator history: `[{snapshotId, date, stage}]` – vẽ được mini timeline |
| **US-TCH-D3-23** | Là giáo viên, tôi muốn **xem Rubric (mô tả Stage 1–4) của từng Indicator ngay trong màn hình đánh giá**, để tôi so sánh trực tiếp 4 stage cạnh nhau trước khi chọn. | FJ-01, FJ-10 | EJ-02: Tự tin – chọn dựa trên mô tả thực | Rubric panel expandable, hiển thị đủ 4 Stage text từ Building 21 Excel |

---
*Tổng: 23 User Stories | Domain D2: 2 | Domain D3: 21*
*→ Tiếp theo: A3_Sitemap.md – Map stories vào màn hình, layout hierarchy*
