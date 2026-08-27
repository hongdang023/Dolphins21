# B0 – System Wiki: Hệ Sinh Thái Kỹ Thuật

> **Hệ thống**: Teacher Competency Growth OS
> **Stack**: Cloudflare Pages + Workers + D1 | GitHub CI | 2026-08-27

---

## 1. TRIẾT LÝ KỸ THUẬT

> **"Cloudflare-native: Deploy once, run at the edge globally."**

3 nguyên tắc kỹ thuật:
1. **Edge-first**: API + DB đều chạy tại Cloudflare edge – latency thấp, không cần server riêng
2. **Separation of Concerns**: Website (UX) ↔ API (logic/data) ↔ Admin (management) tách biệt hoàn toàn
3. **GitHub as source of truth**: Mọi thay đổi code đi qua GitHub → Cloudflare auto-deploy

---

## 2. TECHSTACK

| Layer | Công nghệ | Vai trò |
|-------|-----------|--------|
| **Frontend** | HTML + Vanilla CSS + JS | Giao diện người dùng chính |
| **Admin Panel** | HTML + Vanilla CSS + JS | Quản lý framework data + xem dashboard |
| **API Gateway** | Cloudflare Workers (JS) | Xử lý business logic, CRUD endpoints |
| **Database** | Cloudflare D1 (SQLite) | Lưu trữ toàn bộ data (users, assessments, goals, evidence) |
| **Hosting** | Cloudflare Pages | Serve static files cho cả main + admin site |
| **Auth** | Cloudflare Access (Zero Trust) | Bảo vệ admin.domain.com – không cần code auth |
| **CI/CD** | GitHub → Cloudflare Pages auto-deploy | Push main → live trong 30s |
| **Charts** | Chart.js (CDN) | Radar chart, Line chart |
| **PDF Export** | html2pdf.js (CDN) | Client-side PDF generation |

---

## 3. KIẾN TRÚC 3-DOMAIN TỔNG QUAN

```
┌──────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE EDGE NETWORK                   │
│                                                              │
│  main.domain.com          admin.domain.com                   │
│  [Cloudflare Pages]       [Cloudflare Pages]                 │
│  Teacher app              Admin panel                        │
│         │                       │                           │
│         └──────────┬────────────┘                           │
│                    ▼                                         │
│           api.domain.com                                     │
│           [Cloudflare Workers]                               │
│           - REST API endpoints                               │
│           - Business logic                                   │
│           - Auth validation                                  │
│                    │                                         │
│                    ▼                                         │
│           [Cloudflare D1]                                    │
│           SQLite database at edge                            │
│           - profiles, indicators, snapshots                  │
│           - goals, evidence, weeklyLogs                      │
│           - framework data (Building 21)                     │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. DATA FLOW

```
[Teacher - main.domain.com]
  → Chọn Stage cho Indicator
  → POST api.domain.com/indicators
  → Workers validate + write D1
  → Response 200 → UI update

[Admin - admin.domain.com]  ← Protected by Cloudflare Access
  → Sửa rubric text của TC.5.7-IND-3
  → PATCH api.domain.com/admin/framework/indicators/:id
  → Workers validate admin token + write D1
  → Framework data updated globally

[Export PDF - client-side]
  → GET api.domain.com/export/snapshot/:id
  → Nhận JSON data
  → html2pdf.js render → download
```

---

## 5. 3 DOMAIN MAPPING

| Domain | URL | Người dùng | Cloudflare product |
|--------|-----|-----------|-------------------|
| **Main App** | `main.domain.com` | Teacher (bạn) | Cloudflare Pages |
| **API Gateway** | `api.domain.com` | Cả Main + Admin gọi | Cloudflare Workers |
| **Admin Panel** | `admin.domain.com` | Bạn (admin duy nhất) | Cloudflare Pages + Access |

---

## 6. DEPLOY WORKFLOW

```
Developer (bạn)
    │ git push origin main
    ▼
GitHub Repository
    ├── /main-app/    → trigger Cloudflare Pages deploy → main.domain.com
    ├── /admin/       → trigger Cloudflare Pages deploy → admin.domain.com
    └── /api/         → trigger Cloudflare Workers deploy → api.domain.com
```

---

## 7. BẢNG TRA CỨU THUẬT NGỮ

| Thuật ngữ | Giải thích |
|-----------|-----------|
| **Cloudflare Workers** | Serverless runtime tại edge – chạy JS, xử lý API requests |
| **Cloudflare D1** | SQLite database native của Cloudflare, bind vào Workers |
| **Cloudflare Pages** | Hosting static sites, auto-deploy từ GitHub |
| **Cloudflare Access** | Zero Trust auth – bảo vệ URL mà không cần viết code login |
| **Cloudflare Zero Trust** | Chỉ cho phép truy cập sau khi verify identity (email OTP, Google SSO) |
| **D1 Binding** | Cách Workers kết nối D1: `env.DB.prepare(sql).run()` |
| **Indicator** | Câu "I am/I can..." trong Building 21 – đơn vị tracking nhỏ nhất |
| **Snapshot** | Bản chụp toàn bộ đánh giá tại 1 thời điểm |

---
*→ Chi tiết: B1_DataModel.md | B2_APIDesign.md | B3_WebArchitecture.md | B4_UIDesign.md | B5_QC.md*
