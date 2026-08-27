# B3 – Web Architecture: 3-Domain Structure

> **Hệ thống**: Teacher Competency Growth OS
> **Domains**: main.domain.com | api.domain.com | admin.domain.com | 2026-08-27

---

## 1. CẤU TRÚC THƯ MỤC GITHUB REPO

```
/mentor-competency-os (GitHub repo)
│
├── /main-app/                         ← main.domain.com (Teacher UI)
│   ├── index.html                     → Redirect to /assess hoặc /dashboard
│   ├── onboarding.html
│   ├── assess.html
│   ├── assess-detail.html
│   ├── dashboard.html
│   ├── dashboard-compare.html
│   ├── focus.html
│   ├── focus-detail.html
│   ├── goals.html
│   ├── goal-detail.html
│   ├── evidence.html
│   ├── evidence-detail.html
│   ├── checkin.html
│   ├── export.html
│   ├── css/
│   │   ├── tokens.css                 → CSS Variables (design tokens)
│   │   ├── components.css             → Reusable components
│   │   └── pages/[page].css
│   └── js/
│       ├── api-client.js              → Wrapper gọi api.domain.com
│       ├── charts.js                  → Chart.js helpers
│       ├── export.js                  → PDF + JSON export
│       └── pages/[page].js
│
├── /admin/                            ← admin.domain.com (Admin UI)
│   ├── index.html                     → Dashboard overview
│   ├── framework.html                 → Quản lý Building 21 data
│   ├── framework-detail.html          → Sửa Indicator/Rubric
│   ├── css/
│   │   └── admin.css
│   └── js/
│       ├── admin-client.js            → Gọi /v1/admin/* endpoints
│       └── pages/[page].js
│
├── /api/                              ← api.domain.com (Workers)
│   ├── src/
│   │   ├── index.js                   → Router (itty-router hoặc Hono)
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── cors.js
│   │   ├── routes/
│   │   │   ├── profile.js
│   │   │   ├── framework.js
│   │   │   ├── indicators.js
│   │   │   ├── snapshots.js
│   │   │   ├── goals.js
│   │   │   ├── evidence.js
│   │   │   ├── weeklyLogs.js
│   │   │   ├── export.js
│   │   │   └── admin.js
│   │   └── db/
│   │       ├── schema.sql
│   │       ├── seed_framework.sql
│   │       └── queries.js
│   └── wrangler.toml
│
└── _cloudflare/
    ├── main-pages.toml                → Cloudflare Pages config cho main-app
    └── admin-pages.toml               → Cloudflare Pages config cho admin
```

---

## 2. CLOUDFLARE SETUP CHI TIẾT

### 2.1 D1 Database
```toml
# wrangler.toml
name = "mentor-competency-api"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "mentor-competency-os"
database_id = "<your-d1-id>"

[vars]
API_KEY = ""           # Dùng Secrets thay thế
ADMIN_KEY = ""         # Dùng Secrets thay thế
```

```bash
# Tạo D1 database
wrangler d1 create mentor-competency-os

# Set secrets (không hardcode trong code)
wrangler secret put API_KEY
wrangler secret put ADMIN_KEY

# Deploy schema
wrangler d1 execute mentor-competency-os --file=db/schema.sql
wrangler d1 execute mentor-competency-os --file=db/seed_framework.sql
```

### 2.2 Cloudflare Pages – Main App
```
Project name:  mentor-main
GitHub repo:   mentor-competency-os
Branch:        main
Build command: (để trống – static HTML)
Output dir:    main-app
Domain:        main.domain.com
```

### 2.3 Cloudflare Pages – Admin
```
Project name:  mentor-admin
GitHub repo:   mentor-competency-os
Branch:        main
Build command: (để trống)
Output dir:    admin
Domain:        admin.domain.com
```

**Bảo vệ admin bằng Cloudflare Access:**
```
Zero Trust → Access → Applications → Add
Type: Self-hosted
Domain: admin.domain.com
Policy: Email OTP (chỉ email của bạn)
```

### 2.4 Custom Domain Setup (Cloudflare DNS)
```
Type  Name    Target
A     main    [Cloudflare Pages IP]        → main.domain.com
A     admin   [Cloudflare Pages IP]        → admin.domain.com
CNAME api     mentor-competency-api.workers.dev → api.domain.com
```

---

## 3. API CLIENT PATTERN (Frontend gọi API)

```javascript
// js/api-client.js
const API_BASE = 'https://api.domain.com/v1'
const API_KEY = '...'  // Lưu trong environment variable hoặc config

const apiClient = {
  async get(path) {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'X-API-Key': API_KEY }
    })
    const json = await res.json()
    if (json.error) throw new Error(json.error.message)
    return json.data
  },

  async post(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'X-API-Key': API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const json = await res.json()
    if (json.error) throw new Error(json.error.message)
    return json.data
  },

  async patch(path, body) { /* tương tự */ },
  async delete(path) { /* tương tự */ }
}
```

---

## 4. CORS CONFIGURATION (Workers)

```javascript
// middleware/cors.js
const ALLOWED_ORIGINS = [
  'https://main.domain.com',
  'https://admin.domain.com',
  'http://localhost:3000'   // Local development
]

export function corsMiddleware(request) {
  const origin = request.headers.get('Origin')
  if (ALLOWED_ORIGINS.includes(origin)) {
    return { 'Access-Control-Allow-Origin': origin }
  }
  return {}
}
```

---

## 5. DEPLOY WORKFLOW

```
git push origin main
       ↓
GitHub webhook → trigger 3 deployments parallel:

[Cloudflare Pages - Main]       [Cloudflare Pages - Admin]      [Cloudflare Workers - API]
 Copies /main-app/ files         Copies /admin/ files             Builds /api/src/
       ↓                               ↓                                ↓
 main.domain.com live            admin.domain.com live           api.domain.com live
       (~30 giây)                    (~30 giây)                      (~20 giây)
```

---

## 6. PERFORMANCE TARGETS

| Metric | Target | Cơ chế |
|--------|--------|--------|
| API response | < 50ms | D1 edge + Workers edge colocation |
| Page first load | < 2s | Static HTML, CDN libraries |
| Chart render | < 500ms | Lazy load Chart.js |
| PDF export | < 3s | html2pdf.js client-side |

---

## 7. AUDIT QUESTIONS

1. **CORS** có chặn đúng – chỉ cho phép main và admin domains không?
2. **API_KEY và ADMIN_KEY** có đang dùng Cloudflare Secrets (không hardcode) không?
3. **admin.domain.com** có được bảo vệ bằng Cloudflare Access chưa?
4. D1 binding trong `wrangler.toml` có đúng database_id chưa?
5. `seed_framework.sql` đã được chạy và data Building 21 đã có trong D1 chưa?

---
*→ Tham chiếu: B1_DataModel.md (D1 schema) | B2_APIDesign.md (endpoints) | B0_SystemWiki.md (overview)*
