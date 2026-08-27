# B2 – API Design: Cloudflare Workers Gateway

> **Hệ thống**: Teacher Competency Growth OS
> **Endpoint base**: `https://api.domain.com`
> **Runtime**: Cloudflare Workers (JS/TS) | **DB**: Cloudflare D1 (SQLite) | 2026-08-27

---

## 1. NGUYÊN TẮC API

| Nguyên tắc | Quy tắc |
|-----------|--------|
| **RESTful** | `GET` đọc, `POST` tạo, `PATCH` cập nhật, `DELETE` xóa |
| **Versioning** | Prefix `/v1/` cho tất cả endpoints |
| **Response format** | Luôn trả `{ data, error, meta }` |
| **Auth** | API Key trong header `X-API-Key` (simple, đủ cho personal tool) |
| **Error codes** | HTTP standard: 200, 201, 400, 401, 404, 500 |

---

## 2. ENDPOINT MAP – Theo nhóm chức năng

### 2.1 Profile
```
GET    /v1/profile              → Lấy thông tin giáo viên
POST   /v1/profile              → Tạo profile lần đầu
PATCH  /v1/profile              → Cập nhật profile
```

### 2.2 Framework Data (Building 21) – Read only với user
```
GET    /v1/framework/domains                    → 5 domains (TC1–TC5)
GET    /v1/framework/domains/:domainId          → 1 domain + competencies
GET    /v1/framework/competencies/:compId       → 1 competency + indicators + rubrics
GET    /v1/framework/indicators/:indicatorId    → 1 indicator + rubric 4 stages
```

### 2.3 Assessment – Indicators rating
```
GET    /v1/indicators                          → Tất cả ratings của user
GET    /v1/indicators/:indicatorId             → 1 rating cụ thể
POST   /v1/indicators                          → Lưu/cập nhật Stage rating
DELETE /v1/indicators/:indicatorId             → Xóa rating (reset về chưa đánh giá)
```

### 2.4 Snapshots
```
GET    /v1/snapshots                           → Danh sách snapshots
GET    /v1/snapshots/:snapshotId               → 1 snapshot đầy đủ
POST   /v1/snapshots                           → Tạo snapshot mới
DELETE /v1/snapshots/:snapshotId               → Xóa snapshot
```

### 2.5 Goals
```
GET    /v1/goals                               → Tất cả goals (filter: ?status=active)
GET    /v1/goals/:goalId                       → 1 goal + milestones
POST   /v1/goals                               → Tạo SMART goal mới
PATCH  /v1/goals/:goalId                       → Cập nhật goal (deadline, status)
DELETE /v1/goals/:goalId                       → Xóa goal
PATCH  /v1/goals/:goalId/milestones/:msId      → Check off milestone + ghi evidence
```

### 2.6 Evidence
```
GET    /v1/evidence                            → Tất cả evidence (filter: ?indicatorId=)
GET    /v1/evidence/:evidenceId                → 1 evidence note
POST   /v1/evidence                            → Tạo evidence note mới
PATCH  /v1/evidence/:evidenceId                → Sửa evidence note
DELETE /v1/evidence/:evidenceId                → Xóa evidence note
```

### 2.7 Weekly Logs
```
GET    /v1/weekly-logs                         → Tất cả logs (để tính streak)
POST   /v1/weekly-logs                         → Tạo weekly log entry
GET    /v1/weekly-logs/streak                  → Trả về { currentStreak, totalWeeks }
```

### 2.8 Export
```
GET    /v1/export/json                         → Toàn bộ data dạng JSON (backup)
GET    /v1/export/snapshot/:snapshotId         → 1 snapshot dạng JSON cho PDF
```

### 2.9 Admin Endpoints – chỉ `admin.domain.com` gọi
```
[Yêu cầu header: X-Admin-Key]

GET    /v1/admin/framework/indicators          → Tất cả indicators
PATCH  /v1/admin/framework/indicators/:id      → Sửa rubric text
POST   /v1/admin/framework/indicators          → Thêm indicator mới
DELETE /v1/admin/framework/indicators/:id      → Xóa indicator

GET    /v1/admin/stats                         → Usage statistics
```

---

## 3. RESPONSE FORMAT CHUẨN

```json
// Success
{
  "data": { ... },
  "error": null,
  "meta": { "timestamp": "2026-08-27T10:00:00Z" }
}

// Error
{
  "data": null,
  "error": { "code": "NOT_FOUND", "message": "Indicator not found" },
  "meta": { "timestamp": "2026-08-27T10:00:00Z" }
}
```

---

## 4. AUTHENTICATION

**Chiến lược**: API Key đơn giản, đủ cho personal tool 1 user.

```
Request header:
X-API-Key: <your-api-key>

Workers validate:
if (request.headers.get('X-API-Key') !== env.API_KEY) {
  return Response.json({ error: 'Unauthorized' }, { status: 401 })
}
```

**Admin endpoints** thêm 1 lớp:
```
X-Admin-Key: <your-admin-key>  (khác với API_KEY)
```

**Lưu trữ keys**: Cloudflare Workers Secrets (không hardcode trong code)

---

## 5. CLOUDFLARE WORKERS – CODE STRUCTURE

```
/api/
├── src/
│   ├── index.js          ← Router chính (Hono.js hoặc itty-router)
│   ├── middleware/
│   │   ├── auth.js       ← Validate X-API-Key
│   │   └── cors.js       ← CORS cho Pages domains
│   ├── routes/
│   │   ├── profile.js
│   │   ├── framework.js
│   │   ├── indicators.js
│   │   ├── snapshots.js
│   │   ├── goals.js
│   │   ├── evidence.js
│   │   ├── weeklyLogs.js
│   │   ├── export.js
│   │   └── admin.js
│   └── db/
│       ├── schema.sql     ← D1 schema definitions
│       └── queries.js     ← Reusable D1 query helpers
├── wrangler.toml          ← Workers config + D1 binding
└── package.json
```

---

## 6. ERROR HANDLING

| HTTP Code | Khi nào | Response |
|-----------|---------|---------|
| `200 OK` | GET thành công | `{ data: {...} }` |
| `201 Created` | POST tạo mới | `{ data: { id: "..." } }` |
| `400 Bad Request` | Thiếu field bắt buộc | `{ error: { code: "VALIDATION_ERROR" } }` |
| `401 Unauthorized` | Sai/thiếu API Key | `{ error: { code: "UNAUTHORIZED" } }` |
| `404 Not Found` | ID không tồn tại | `{ error: { code: "NOT_FOUND" } }` |
| `500 Server Error` | D1 query fail | `{ error: { code: "INTERNAL_ERROR" } }` |

---

## 7. AUDIT QUESTIONS

1. Mọi endpoint có trả về đúng **Response Format chuẩn** không?
2. Admin endpoints có được **bảo vệ riêng** bằng X-Admin-Key không?
3. **CORS** đã cấu hình đúng để chỉ cho phép `main.domain.com` và `admin.domain.com` không?
4. Có endpoint nào để client **poll** liên tục không? → Nếu có, cân nhắc cache hoặc pagination.

---
*→ Tham chiếu: B1_DataModel.md (D1 schema) | B3_WebArchitecture.md (cách Pages gọi API)*
