# Dolphins21 – Teacher Competency Growth OS

Hệ điều hành phát triển năng lực giáo viên dựa trên khung **Building 21 Teacher Competencies** (5 Domains, 39 Competencies, 117 Indicators).

## 🚀 Cấu Trúc Thư Mục

```
/website
├── /main-app/          # Ứng dụng Teacher (HTML/CSS/JS thuần, phong cách Conan1)
│   ├── index.html      # Trang chủ giới thiệu
│   ├── onboarding.html # Khởi tạo Profile & tìm hiểu 4 Stages
│   ├── dashboard.html  # Radar chart 5 trục, thống kê tiến độ, weekly streak
│   ├── assess.html     # Tự đánh giá 117 Indicators theo Rubric 4 Stages
│   ├── focus.html      # Quản lý 2-3 năng lực ưu tiên (sort lowest score)
│   ├── focus-detail.html # Chi tiết Indicators, Goals, Evidence per Competency
│   ├── goals.html      # Quản lý SMART Goals & Milestones checkbox
│   ├── evidence.html   # Evidence Vault (Kho minh chứng thực tế)
│   ├── checkin.html    # Quick Weekly Habit Check-in (< 5 phút)
│   ├── export.html     # Sao lưu & Khôi phục dữ liệu qua JSON
│   ├── css/            # Tokens (Arial, Burnt Orange #cc4e2d, Warm Cream #fff7ed)
│   └── js/             # Dữ liệu 117 indicators + Local/API Store
├── /admin/             # Admin Panel (Quản trị framework data Building 21)
│   ├── index.html      # Tổng quan Admin
│   └── framework.html  # Quản trị danh mục 5 Domains, 39 Competencies, 117 Indicators
└── /api/               # Cloudflare Workers REST API + D1 SQLite database
    ├── wrangler.toml   # Cấu hình Cloudflare Workers & D1 Binding
    └── src/db/         # SQL Schema (10 tables) & SQL Seed data
```

## 🛠️ Triển Khai Lên Cloudflare Pages & Workers

### 1. Main App
- Deploy thư mục `/website/main-app` lên Cloudflare Pages.
- Build command: để trống (Static HTML).

### 2. Admin App
- Deploy thư mục `/website/admin` lên Cloudflare Pages.
- Cấu hình Cloudflare Access (Zero Trust) để bảo vệ trang quản trị.

### 3. API Gateway & D1 Database
```bash
cd website/api
# Tạo database D1
wrangler d1 create dolphins21-db

# Chạy schema & nạp 117 Indicators
wrangler d1 execute dolphins21-db --file=src/db/schema.sql
wrangler d1 execute dolphins21-db --file=src/db/seed_framework.sql

# Deploy API Worker
wrangler deploy
```
