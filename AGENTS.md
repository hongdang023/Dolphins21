# AGENTS.md – Mentor Guideline Project Rules

> **Dự án**: Teacher Competency Growth OS
> **Framework đánh giá**: Building 21 Teacher Competencies
> **Stack**: Cloudflare Pages + Workers + D1 | GitHub CI | Font: Arial | Màu: Burnt Orange #cc4e2d

---

## ⚠️ BẮT BUỘC ĐỌC TRƯỚC KHI BUILD

Trước khi viết bất kỳ dòng code nào, AI phải đọc các file sau theo thứ tự:

### PHASE A – Hiểu yêu cầu (đọc 1 lần khi bắt đầu)
1. `A_Requirements/A0_Philosophy.md` → Triết lý Outcome-Based, 5 tôn chỉ, 4 audit questions
2. `A_Requirements/A1_JTBD.md` → Jobs FJ-01→10, EJ-01→06, SJ-01→03
3. `A_Requirements/A2_UserStories.md` → 23 user stories + Proof of Work per story
4. `A_Requirements/A3_Sitemap.md` → 17 màn hình, route structure, Rule of 3 clicks
5. `A_Requirements/A4_ContentStandards.md` → Rubric rules, CTA templates, micro-copy
6. `A_Requirements/A5_UserGuidelines.md` → Onboarding Flow, Micro-guidance, Passive guides

### PHASE B – Hiểu hệ thống (đọc khi bắt đầu build)
6. `B_System Design/B0_SystemWiki.md` → Stack overview, deploy flow, glossary
7. `B_System Design/B1_DataModel.md` → D1 SQL schema (10 tables), computed queries
8. `B_System Design/B2_APIDesign.md` → 30+ endpoints, auth, CORS, error format
9. `B_System Design/B3_WebArchitecture.md` → Folder structure, Cloudflare setup, CORS config
10. `B_System Design/B4_UIDesign.md` → Design tokens từ conan1.com, components, colors
11. `B_System Design/B5_QC.md` → 14-step core loop test, deploy checklist

---

## READING MAP – Đọc gì khi build trang nào

| Khi build... | Đọc bắt buộc |
|-------------|-------------|
| **Bất kỳ trang nào** | B4_UIDesign + A4_ContentStandards |
| **Assessment pages** (`/assess/*`) | A2 stories D3-01→03, D3-19→23 + B1 indicators schema |
| **Dashboard** (`/dashboard/*`) | A2 stories D3-10→12 + B1 snapshots schema + B4 radar chart |
| **Focus view** (`/focus/*`) | A2 stories D3-16→18 + B2 GET /v1/focus endpoints |
| **Goals** (`/goals/*`) | A2 stories D3-04→06, D3-09 + B1 goals/milestones schema |
| **Evidence Vault** (`/evidence/*`) | A2 stories D3-07→09 + B1 evidence_notes schema |
| **Check-in** (`/checkin`) | A2 stories D3-13→14 + B1 weekly_logs schema |
| **Export** (`/export`) | A2 story D3-15 + B2 GET /v1/export/* |
| **Onboarding** (`/onboarding/*`) | A2 stories D2-01→02 + B1 profiles schema |
| **API Workers** | B2_APIDesign (full) + B1_DataModel (full) |
| **Admin panel** | B2 admin endpoints + B3 Cloudflare Access setup |

---

## DESIGN RULES – Không được vi phạm

### Typography & Font
- Font: **Arial** duy nhất. Không dùng Google Fonts, Inter, hay font khác.
- Body: `font-size: 16px; font-family: Arial; -webkit-font-smoothing: antialiased`

### Colors – Chỉ dùng CSS Variables
```css
/* ĐÚNG */
color: var(--primary);
background: var(--accent);

/* SAI – hardcode hex */
color: #cc4e2d;
```

Core tokens (từ conan1.com/styles):
- `--primary: #cc4e2d`       (Burnt Orange – CTA, highlights)
- `--accent: #fff7ed`         (Warm Cream – background panels)
- `--accent-foreground: #a83d22`
- `--border: #e7e5e4`         (Card borders)
- `--background: #ffffff`
- `--foreground: #111111`
- `--muted: #f2f2f2`
- `--muted-foreground: #666666`
- `--ring: #cc4e2d`           (Focus ring)

### Components
- **Card**: `border: 1px solid var(--border); border-radius: 8px; background: var(--card)`
- **Eyebrow**: `color: var(--primary); letter-spacing: 0.14em; text-transform: uppercase; font-weight: 800; font-size: 14px`
- **Focus**: `outline: 3px solid color-mix(in srgb, var(--ring) 45%, transparent); outline-offset: 3px`
- **Selection**: `::selection { color: #7c2d12; background: #fed7aa }`
- **Primary button**: `background: var(--primary); color: #fff; border-radius: 8px; padding: 10px 24px; font-weight: 600`

---

## CONTENT RULES – Không được vi phạm

1. **Rubric text** từ Building 21: KHÔNG paraphrase, KHÔNG rút gọn làm sai lệch tiêu chí
2. **Ngôn ngữ & 2 Mode**: Hỗ trợ 2 chế độ độc lập **VI Mode** (100% Tiếng Việt chuẩn) và **EN Mode** (100% Tiếng Anh chuẩn). Tuyệt đối **KHÔNG dùng chú thích đóng mở ngoặc dịch thuật lai tạp** như `(Radar Chart)`, `(Evidence)`, `(Goals)` trong UI
3. **CTA**: Phải bắt đầu bằng động từ hành động + kết quả cụ thể (Ví dụ: "Lưu đánh giá và xem Biểu Đồ Năng Lực" / "Save Assessment and View Radar Chart")
4. **Tone**: Không "Điểm yếu" / "Kém nhất" → dùng "Đang phát triển nhất" / "Primary growth area"
5. **Next Action**: LUÔN có sau kết quả – không để user "xem xong rồi đóng tab"

---

## API RULES

- Base URL: `https://api.domain.com/v1`
- Auth: `X-API-Key` header cho user, `X-Admin-Key` cho admin
- Response format: `{ data, error, meta }` – bắt buộc mọi endpoint
- CORS: Chỉ `main.domain.com` và `admin.domain.com`

---

## DATA RULES

- Đơn vị tracking nhỏ nhất: **Indicator + Stage** (không phải Competency)
- Hierarchy: `Domain → Competency → Indicator → Rubric` (4 tầng)
- Computed (avgStage, streak): KHÔNG lưu DB – tính runtime qua SQL
- Framework data (Building 21): CHỈ admin mới được write

---

## DEPLOY RULES

- Push `main` → auto-deploy: Cloudflare Pages (main + admin) + Workers (api)
- API_KEY, ADMIN_KEY: Cloudflare Secrets – KHÔNG hardcode trong code
- Schema changes: tạo migration file mới trong `/api/db/migrations/`

---

## AUDIT CHECKLIST – Tự check trước deploy

1. Màn hình có **Next Action** rõ ràng? (A0 tôn chỉ 1)
2. Data lưu qua **D1 API** đúng cách? (không localStorage)
3. Rubric text giữ nguyên **100% Building 21**? (A4)
4. CTA bắt đầu bằng **động từ**? (A4)
5. Font là **Arial**? (B4)
6. Colors dùng **CSS Variables**? (B4)
7. Pass **14-step Core Loop Test**? (B5)

---

## FILE HIERARCHY

```
Input/
└── Copy of Building 21 Teacher Competencies.xlsx  ← Nguồn gốc

A_Requirements/
├── A0_Philosophy.md        ← Outcome-Based, 4 audit questions
├── A1_JTBD.md              ← FJ/EJ/SJ jobs (10+6+3)
├── A2_UserStories.md       ← 23 stories + Proof of Work
├── A3_Sitemap.md           ← 17 screens, routes
├── A4_ContentStandards.md  ← Copy rules, rubric handling
└── A5_UserGuidelines.md    ← Onboarding flow, micro-guidance, empty states

B_System Design/
├── B0_SystemWiki.md        ← Cloudflare stack, glossary
├── B1_DataModel.md         ← D1 SQL schema (10 tables)
├── B2_APIDesign.md         ← 30+ REST endpoints
├── B3_WebArchitecture.md   ← Folder structure, Cloudflare setup
├── B4_UIDesign.md          ← conan1.com design tokens (Arial + Burnt Orange)
└── B5_QC.md                ← Core loop test, deploy checklist
```
