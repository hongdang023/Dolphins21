# B1 – Data Model: Cloudflare D1 Schema

> **Hệ thống**: Teacher Competency Growth OS
> **Database**: Cloudflare D1 (SQLite) | **Access**: qua Cloudflare Workers | 2026-08-27
>
> **Tham chiếu**: A3_Sitemap (17 màn hình) | A2_UserStories (Proof of Work column)
> **Hierarchy**: Domain → Competency → Indicator → Rubric (4 tầng thực tế từ Building 21 Excel)

---

## 1. ENTITY OVERVIEW

```
D1 Tables:
├── framework_domains         → TC1–TC5 (static, quản lý qua admin)
├── framework_competencies    → TC1.1, TC5.7... (34 competencies)
├── framework_indicators      → Mỗi "I am/I can..." row (static từ Excel)
├── profiles                  → Thông tin giáo viên
├── indicator_ratings         → Đánh giá Stage của từng Indicator
├── snapshots                 → Bản chụp toàn bộ assessment
├── snapshot_items            → Chi tiết từng rating trong snapshot
├── goals                     → SMART Goals per Indicator
├── milestones                → Breakdown từ Goal theo tuần/tháng
└── evidence_notes            → Bằng chứng thực tế per Indicator
    weekly_logs               → Check-in hàng tuần
    pinned_competencies       → Danh sách Competency đang focus
```

---

## 2. SCHEMA SQL

### 2.1 Framework Tables (Static – managed via Admin)

```sql
-- Domains: TC1–TC5
CREATE TABLE framework_domains (
  id          TEXT PRIMARY KEY,     -- "TC1", "TC2"...
  name        TEXT NOT NULL,        -- "Building Relationships"
  description TEXT,                 -- Guiding question
  sort_order  INTEGER NOT NULL
);

-- Competencies: TC1.1, TC5.7...
CREATE TABLE framework_competencies (
  id              TEXT PRIMARY KEY,  -- "TC1.1", "TC5.7"
  domain_id       TEXT NOT NULL REFERENCES framework_domains(id),
  name            TEXT NOT NULL,     -- "Implement trauma-informed practices"
  guiding_question TEXT,
  sort_order      INTEGER NOT NULL
);

-- Indicators: mỗi "I am/I can..." row
CREATE TABLE framework_indicators (
  id              TEXT PRIMARY KEY,  -- "TC5.7-IND-3"
  competency_id   TEXT NOT NULL REFERENCES framework_competencies(id),
  indicator_index INTEGER NOT NULL,  -- Thứ tự row trong Excel
  rubric_stage1   TEXT NOT NULL,     -- Mô tả Stage 1
  rubric_stage2   TEXT NOT NULL,
  rubric_stage3   TEXT NOT NULL,
  rubric_stage4   TEXT NOT NULL
);
```

### 2.2 Profile

```sql
CREATE TABLE profiles (
  id              TEXT PRIMARY KEY DEFAULT 'main',  -- Single user, hardcoded
  name            TEXT NOT NULL,
  subject         TEXT,
  years_experience INTEGER,
  school          TEXT,
  settings_json   TEXT DEFAULT '{}',  -- dark_mode, language, etc.
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now'))
);
```

### 2.3 Indicator Ratings – Đơn vị tracking nhỏ nhất

```sql
CREATE TABLE indicator_ratings (
  id            TEXT PRIMARY KEY,          -- UUID
  indicator_id  TEXT NOT NULL REFERENCES framework_indicators(id),
  competency_id TEXT NOT NULL,             -- Denormalized for fast query
  domain_id     TEXT NOT NULL,             -- Denormalized for fast query
  stage         INTEGER CHECK(stage IN (1,2,3,4)),  -- NULL = chưa đánh giá
  updated_at    TEXT DEFAULT (datetime('now')),

  UNIQUE(indicator_id)                     -- 1 rating per indicator
);

-- Index để query nhanh theo domain/competency
CREATE INDEX idx_ratings_competency ON indicator_ratings(competency_id);
CREATE INDEX idx_ratings_domain ON indicator_ratings(domain_id);
```

### 2.4 Snapshots – Bản chụp theo thời gian

```sql
CREATE TABLE snapshots (
  id          TEXT PRIMARY KEY,    -- UUID
  label       TEXT NOT NULL,       -- "Đầu năm học 2026-2027"
  created_at  TEXT DEFAULT (datetime('now'))
);

CREATE TABLE snapshot_items (
  snapshot_id   TEXT NOT NULL REFERENCES snapshots(id) ON DELETE CASCADE,
  indicator_id  TEXT NOT NULL,
  stage         INTEGER,
  PRIMARY KEY (snapshot_id, indicator_id)
);
```

### 2.5 Goals – SMART Goals

```sql
CREATE TABLE goals (
  id              TEXT PRIMARY KEY,
  indicator_id    TEXT NOT NULL REFERENCES framework_indicators(id),
  competency_id   TEXT NOT NULL,
  current_stage   INTEGER NOT NULL,
  target_stage    INTEGER NOT NULL,
  deadline        TEXT NOT NULL,        -- ISO date "2027-01-31"
  status          TEXT DEFAULT 'active' CHECK(status IN ('active','completed','paused')),
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT DEFAULT (datetime('now'))
);

CREATE TABLE milestones (
  id            TEXT PRIMARY KEY,
  goal_id       TEXT NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  label         TEXT NOT NULL,
  due_date      TEXT NOT NULL,
  completed     INTEGER DEFAULT 0,      -- SQLite boolean: 0/1
  completed_at  TEXT,
  evidence_note TEXT,
  sort_order    INTEGER NOT NULL
);
```

### 2.6 Evidence Notes

```sql
CREATE TABLE evidence_notes (
  id            TEXT PRIMARY KEY,
  indicator_id  TEXT NOT NULL REFERENCES framework_indicators(id),
  competency_id TEXT NOT NULL,
  date          TEXT NOT NULL,          -- "2026-09-01"
  content       TEXT NOT NULL,
  tags_json     TEXT DEFAULT '[]',      -- JSON array of tags
  linked_goal_id TEXT REFERENCES goals(id),
  created_at    TEXT DEFAULT (datetime('now')),
  updated_at    TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_evidence_indicator ON evidence_notes(indicator_id);
```

### 2.7 Weekly Logs

```sql
CREATE TABLE weekly_logs (
  id              TEXT PRIMARY KEY,    -- "wk_202635" (YYYY + WW)
  week_start_date TEXT NOT NULL,
  note            TEXT,
  created_at      TEXT DEFAULT (datetime('now'))
);

CREATE TABLE weekly_log_indicators (
  log_id        TEXT NOT NULL REFERENCES weekly_logs(id),
  indicator_id  TEXT NOT NULL,
  PRIMARY KEY (log_id, indicator_id)
);
```

### 2.8 Pinned Competencies

```sql
CREATE TABLE pinned_competencies (
  competency_id TEXT PRIMARY KEY REFERENCES framework_competencies(id),
  pinned_at     TEXT DEFAULT (datetime('now'))
);
-- Max 5 items enforced in Workers logic
```

---

## 3. COMPUTED VALUES (Tính trong Workers, không lưu DB)

```javascript
// avgStage của 1 Competency
SELECT AVG(stage) FROM indicator_ratings
WHERE competency_id = ? AND stage IS NOT NULL

// Weekly streak
SELECT COUNT(*) FROM weekly_logs
WHERE week_start_date >= date('now', '-X weeks')
-- Logic: đếm consecutive weeks liên tiếp gần nhất

// Lowest competencies (for Focus view)
SELECT c.id, c.name, AVG(r.stage) as avg_stage
FROM framework_competencies c
JOIN indicator_ratings r ON r.competency_id = c.id
WHERE r.stage IS NOT NULL
GROUP BY c.id
ORDER BY avg_stage ASC
```

---

## 4. MIGRATION WORKFLOW

```
/api/db/
├── schema.sql          ← Schema đầy đủ (chạy khi setup lần đầu)
├── seed_framework.sql  ← Import Building 21 data từ Excel
└── migrations/
    └── 001_init.sql    ← Mỗi thay đổi schema = 1 migration file mới
```

**Deploy schema lên D1:**
```bash
wrangler d1 execute mentor-os --file=db/schema.sql
wrangler d1 execute mentor-os --file=db/seed_framework.sql
```

---

## 5. AUDIT QUESTIONS

1. `indicator_ratings` có `UNIQUE(indicator_id)` để tránh duplicate ratings chưa?
2. `snapshot_items` có `ON DELETE CASCADE` để xóa snapshot không để lại orphan records chưa?
3. Framework tables (`framework_*`) chỉ được WRITE qua admin endpoints, không phải user endpoints?
4. Computed values (avgStage, streak) có đang bị persist vào DB không? (Không được – tính runtime)
5. `seed_framework.sql` đã extract đủ 100% indicators từ Building 21 Excel chưa?

---
*→ Tham chiếu: B2_APIDesign.md (endpoints) | B3_WebArchitecture.md (Workers D1 binding)*
