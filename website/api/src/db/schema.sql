-- Database Schema for Dolphins21 (Cloudflare D1)

CREATE TABLE IF NOT EXISTS framework_domains (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS framework_competencies (
  id TEXT PRIMARY KEY,
  domain_id TEXT NOT NULL REFERENCES framework_domains(id),
  name TEXT NOT NULL,
  guiding_question TEXT,
  sort_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS framework_indicators (
  id TEXT PRIMARY KEY,
  competency_id TEXT NOT NULL REFERENCES framework_competencies(id),
  indicator_index INTEGER NOT NULL,
  rubric_stage1 TEXT NOT NULL,
  rubric_stage2 TEXT NOT NULL,
  rubric_stage3 TEXT NOT NULL,
  rubric_stage4 TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY DEFAULT 'main',
  name TEXT NOT NULL,
  subject TEXT,
  years_experience INTEGER,
  school TEXT,
  settings_json TEXT DEFAULT '{}',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS indicator_ratings (
  id TEXT PRIMARY KEY,
  indicator_id TEXT NOT NULL REFERENCES framework_indicators(id),
  competency_id TEXT NOT NULL,
  domain_id TEXT NOT NULL,
  stage INTEGER CHECK(stage IN (1,2,3,4)),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(indicator_id)
);

CREATE INDEX IF NOT EXISTS idx_ratings_competency ON indicator_ratings(competency_id);
CREATE INDEX IF NOT EXISTS idx_ratings_domain ON indicator_ratings(domain_id);

CREATE TABLE IF NOT EXISTS snapshots (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS snapshot_items (
  snapshot_id TEXT NOT NULL REFERENCES snapshots(id) ON DELETE CASCADE,
  indicator_id TEXT NOT NULL,
  stage INTEGER,
  PRIMARY KEY (snapshot_id, indicator_id)
);

CREATE TABLE IF NOT EXISTS goals (
  id TEXT PRIMARY KEY,
  indicator_id TEXT NOT NULL REFERENCES framework_indicators(id),
  competency_id TEXT NOT NULL,
  current_stage INTEGER NOT NULL,
  target_stage INTEGER NOT NULL,
  deadline TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK(status IN ('active','completed','paused')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS milestones (
  id TEXT PRIMARY KEY,
  goal_id TEXT NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  due_date TEXT NOT NULL,
  completed INTEGER DEFAULT 0,
  completed_at TEXT,
  evidence_note TEXT,
  sort_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS evidence_notes (
  id TEXT PRIMARY KEY,
  indicator_id TEXT NOT NULL REFERENCES framework_indicators(id),
  competency_id TEXT NOT NULL,
  date TEXT NOT NULL,
  content TEXT NOT NULL,
  tags_json TEXT DEFAULT '[]',
  linked_goal_id TEXT REFERENCES goals(id),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_evidence_indicator ON evidence_notes(indicator_id);

CREATE TABLE IF NOT EXISTS weekly_logs (
  id TEXT PRIMARY KEY,
  week_start_date TEXT NOT NULL,
  note TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS weekly_log_indicators (
  log_id TEXT NOT NULL REFERENCES weekly_logs(id),
  indicator_id TEXT NOT NULL,
  PRIMARY KEY (log_id, indicator_id)
);

CREATE TABLE IF NOT EXISTS pinned_competencies (
  competency_id TEXT PRIMARY KEY REFERENCES framework_competencies(id),
  pinned_at TEXT DEFAULT (datetime('now'))
);
