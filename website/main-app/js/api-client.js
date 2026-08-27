/**
 * Dolphins21 API Client with local fallback store
 * Clean initial state (Zero dummy data)
 */
const API_BASE = 'https://dolphins21-api.pages.dev/v1';

window.DolphinsStore = {
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

  // Profile (Empty initial state)
  getProfile() {
    return this.get(this.KEYS.PROFILE, {
      name: '',
      subject: '',
      years_experience: '',
      school: ''
    });
  },

  saveProfile(profile) {
    this.set(this.KEYS.PROFILE, profile);
    return profile;
  },

  // Ratings (Empty initial state)
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

  // Snapshots (Empty initial state)
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

  // Focus / Pinned Competencies (Empty initial state)
  getFocus() {
    return this.get(this.KEYS.FOCUS, []);
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

  // SMART Goals (Empty initial state)
  getGoals() {
    return this.get(this.KEYS.GOALS, []);
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

  // Evidence Notes (Empty initial state)
  getEvidence() {
    return this.get(this.KEYS.EVIDENCE, []);
  },

  saveEvidence(evidence) {
    const list = this.getEvidence();
    evidence.id = evidence.id || 'ev_' + Date.now();
    evidence.created_at = new Date().toISOString();
    list.unshift(evidence);
    this.set(this.KEYS.EVIDENCE, list);
    return evidence;
  },

  // Weekly Habit (Empty initial state)
  getWeeklyLogs() {
    return this.get(this.KEYS.WEEKLY_LOGS, []);
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
