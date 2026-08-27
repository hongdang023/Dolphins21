/**
 * Dolphins21 API Client with local fallback store
 * Allows offline-ready execution and Cloudflare D1 integration
 */
const API_BASE = 'https://dolphins21-api.pages.dev/v1';

window.DolphinsStore = {
  // Local storage cache keys
  KEYS: {
    PROFILE: 'dolphins21_profile',
    RATINGS: 'dolphins21_ratings',
    SNAPSHOTS: 'dolphins21_snapshots',
    GOALS: 'dolphins21_goals',
    EVIDENCE: 'dolphins21_evidence',
    WEEKLY_LOGS: 'dolphins21_weekly_logs',
    FOCUS: 'dolphins21_focus'
  },

  get(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  },

  // Profile
  getProfile() {
    return this.get(this.KEYS.PROFILE, {
      name: 'Giáo viên',
      subject: 'Toán học & STEM',
      years_experience: 3,
      school: 'THPT Dolphins'
    });
  },

  saveProfile(profile) {
    this.set(this.KEYS.PROFILE, profile);
    return profile;
  },

  // Ratings
  getRatings() {
    return this.get(this.KEYS.RATINGS, {});
  },

  saveRating(indicatorId, stage, competencyId, domainId) {
    const ratings = this.getRatings();
    ratings[indicatorId] = {
      indicator_id: indicatorId,
      stage: parseInt(stage),
      competency_id: competencyId,
      domain_id: domainId,
      updated_at: new Date().toISOString()
    };
    this.set(this.KEYS.RATINGS, ratings);
    return ratings[indicatorId];
  },

  // Snapshots
  getSnapshots() {
    return this.get(this.KEYS.SNAPSHOTS, []);
  },

  createSnapshot(label) {
    const snapshots = this.getSnapshots();
    const ratings = this.getRatings();
    const newSnap = {
      id: 'snap_' + Date.now(),
      label: label || `Đánh giá ngày ${new Date().toLocaleDateString('vi-VN')}`,
      created_at: new Date().toISOString(),
      items: Object.values(ratings)
    };
    snapshots.unshift(newSnap);
    this.set(this.KEYS.SNAPSHOTS, snapshots);
    return newSnap;
  },

  // Focus / Pinned Competencies
  getFocus() {
    return this.get(this.KEYS.FOCUS, ['TC1.1', 'TC5.7']);
  },

  toggleFocus(competencyId) {
    let focus = this.getFocus();
    if (focus.includes(competencyId)) {
      focus = focus.filter(id => id !== competencyId);
    } else {
      if (focus.length >= 5) focus.shift();
      focus.push(competencyId);
    }
    this.set(this.KEYS.FOCUS, focus);
    return focus;
  },

  // SMART Goals
  getGoals() {
    return this.get(this.KEYS.GOALS, [
      {
        id: 'goal_sample',
        indicator_id: 'TC1.1-IND-1',
        competency_id: 'TC1.1',
        current_stage: 2,
        target_stage: 4,
        deadline: '2026-12-31',
        status: 'active',
        milestones: [
          { id: 'ms_1', label: 'Tuần 1-2: Áp dụng restorative practice cho 3 tình huống', due_date: '2026-09-15', completed: 1, evidence_note: 'Đã họp lớp xử lý bất đồng nhóm' },
          { id: 'ms_2', label: 'Tháng 10: Xây dựng bộ quy tắc giao tiếp công bằng', due_date: '2026-10-31', completed: 0, evidence_note: '' }
        ]
      }
    ]);
  },

  saveGoal(goal) {
    const goals = this.getGoals();
    goal.id = goal.id || 'goal_' + Date.now();
    goal.created_at = goal.created_at || new Date().toISOString();
    const idx = goals.findIndex(g => g.id === goal.id);
    if (idx >= 0) goals[idx] = goal;
    else goals.unshift(goal);
    this.set(this.KEYS.GOALS, goals);
    return goal;
  },

  toggleMilestone(goalId, milestoneId, note = '') {
    const goals = this.getGoals();
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      const ms = goal.milestones.find(m => m.id === milestoneId);
      if (ms) {
        ms.completed = ms.completed ? 0 : 1;
        if (note) ms.evidence_note = note;
        if (ms.completed) ms.completed_at = new Date().toISOString();
      }
      this.set(this.KEYS.GOALS, goals);
    }
    return goals;
  },

  // Evidence Notes
  getEvidence() {
    return this.get(this.KEYS.EVIDENCE, [
      {
        id: 'ev_sample_1',
        indicator_id: 'TC1.1-IND-1',
        competency_id: 'TC1.1',
        date: '2026-08-25',
        content: 'Hôm nay tôi đã tổ chức vòng tròn chia sẻ (restorative circle) đầu giờ. 90% học sinh chủ động nói về áp lực bài vở tuần qua.',
        tags: ['trauma-informed', 'circle']
      }
    ]);
  },

  saveEvidence(evidence) {
    const list = this.getEvidence();
    evidence.id = evidence.id || 'ev_' + Date.now();
    evidence.created_at = new Date().toISOString();
    list.unshift(evidence);
    this.set(this.KEYS.EVIDENCE, list);
    return evidence;
  },

  // Weekly Habit
  getWeeklyLogs() {
    return this.get(this.KEYS.WEEKLY_LOGS, [
      { id: 'wk_1', week_start_date: '2026-08-17', note: 'Hoàn thành tự đánh giá sơ bộ' },
      { id: 'wk_2', week_start_date: '2026-08-24', note: 'Đặt mục tiêu cho TC.1 và TC.5' }
    ]);
  },

  saveWeeklyLog(note) {
    const logs = this.getWeeklyLogs();
    const newLog = {
      id: 'wk_' + Date.now(),
      week_start_date: new Date().toISOString().split('T')[0],
      note: note || 'Check-in hàng tuần hoàn thành'
    };
    logs.unshift(newLog);
    this.set(this.KEYS.WEEKLY_LOGS, logs);
    return newLog;
  },

  getStreak() {
    const logs = this.getWeeklyLogs();
    return logs.length;
  }
};
