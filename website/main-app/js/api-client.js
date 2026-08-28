/**
 * Dolphins21 API Client with local fallback store
 * Clean initial state (Zero dummy data)
 */
const API_BASE = 'https://dolphins21-api.dangtuyethong2324.workers.dev/v1';


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

  saveRating(indicatorId, stage, competencyId, domainId, note = null) {
    const ratings = this.getRatings();
    const existing = ratings[indicatorId] || {};
    ratings[indicatorId] = {
      indicator_id: indicatorId,
      stage: stage !== null ? parseInt(stage) : (existing.stage || 0),
      competency_id: competencyId || existing.competency_id,
      domain_id: domainId || existing.domain_id,
      note: note !== null ? note : (existing.note || ''),
      updated_at: new Date().toISOString()
    };
    this.set(this.KEYS.RATINGS, ratings);
    return ratings[indicatorId];
  },

  saveRatingNote(indicatorId, note, competencyId, domainId) {
    return this.saveRating(indicatorId, null, competencyId, domainId, note);
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

  // Evidence Notes (Empty initial state + Auto-synced Assessment Notes)
  getEvidence() {
    const manualList = this.get(this.KEYS.EVIDENCE, []);
    const ratings = this.getRatings();
    const assessmentNotes = [];

    Object.values(ratings).forEach(r => {
      if (r && r.note && r.note.trim().length > 0) {
        const compId = r.competency_id || (r.indicator_id ? r.indicator_id.split('-IND')[0] : '');
        assessmentNotes.push({
          id: 'note_' + r.indicator_id,
          indicator_id: r.indicator_id,
          competency_id: compId,
          domain_id: r.domain_id,
          content: r.note,
          created_at: r.updated_at || new Date().toISOString(),
          date: r.updated_at ? r.updated_at.split('T')[0] : new Date().toISOString().split('T')[0],
          source: 'assessment_note',
          stage: r.stage || 0
        });
      }
    });

    const combined = [...manualList, ...assessmentNotes];
    combined.sort((a, b) => new Date(b.created_at || b.date || 0) - new Date(a.created_at || a.date || 0));
    return combined;
  },

  saveEvidence(evidence) {
    const list = this.get(this.KEYS.EVIDENCE, []);
    evidence.id = evidence.id || 'ev_' + Date.now();
    evidence.created_at = evidence.created_at || new Date().toISOString();
    evidence.source = evidence.source || 'manual_evidence';
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
  },

  // Sample Data Loader (A5 Guideline)
  isSampleDataLoaded() {
    return this.get('dolphins21_is_sample_data', false);
  },

  loadSampleData() {
    // 1. Sample Profile
    this.saveProfile({
      name: 'Thầy Nguyễn Hoàng Nam',
      subject: 'Toán học & STEM',
      years_experience: 6,
      school: 'Trường THCS-THPT Đổi Mới'
    });

    // 2. Sample Ratings
    const sampleRatings = {
      'TC1.1-IND-1': { indicator_id: 'TC1.1-IND-1', stage: 3, competency_id: 'TC1.1', domain_id: 'TC.1', updated_at: new Date().toISOString() },
      'TC1.1-IND-2': { indicator_id: 'TC1.1-IND-2', stage: 3, competency_id: 'TC1.1', domain_id: 'TC.1', updated_at: new Date().toISOString() },
      'TC1.2-IND-1': { indicator_id: 'TC1.2-IND-1', stage: 2, competency_id: 'TC1.2', domain_id: 'TC.1', updated_at: new Date().toISOString() },
      'TC2.1-IND-1': { indicator_id: 'TC2.1-IND-1', stage: 4, competency_id: 'TC2.1', domain_id: 'TC.2', updated_at: new Date().toISOString() },
      'TC3.1-IND-1': { indicator_id: 'TC3.1-IND-1', stage: 3, competency_id: 'TC3.1', domain_id: 'TC.3', updated_at: new Date().toISOString() },
      'TC4.1-IND-1': { indicator_id: 'TC4.1-IND-1', stage: 2, competency_id: 'TC4.1', domain_id: 'TC.4', updated_at: new Date().toISOString() },
      'TC5.1-IND-1': { indicator_id: 'TC5.1-IND-1', stage: 3, competency_id: 'TC5.1', domain_id: 'TC.5', updated_at: new Date().toISOString() }
    };
    this.set(this.KEYS.RATINGS, sampleRatings);

    // 3. Sample Goals
    const sampleGoals = [{
      id: 'goal_sample_1',
      indicator_id: 'TC1.2-IND-1',
      competency_id: 'TC1.2',
      current_stage: 2,
      target_stage: 3,
      deadline: '2026-10-15',
      status: 'active',
      milestones: [
        { id: 'ms_s1', label: 'Áp dụng bảng khảo sát mức độ tiếp thu vào 3 tiết học tuần này', due_date: '2026-09-15', completed: 1, evidence_note: 'Đã khảo sát 72 học sinh khối 9' },
        { id: 'ms_s2', label: 'Tùy biến bài giảng theo 2 nhóm trình độ sau khảo sát', due_date: '2026-10-01', completed: 0, evidence_note: '' }
      ]
    }];
    this.set(this.KEYS.GOALS, sampleGoals);

    // 4. Sample Evidence
    const sampleEvidence = [{
      id: 'ev_sample_1',
      competency_id: 'TC1.2',
      indicator_id: 'TC1.2-IND-1',
      date: new Date().toISOString().split('T')[0],
      content: 'Hình ảnh và dữ liệu thống kê từ phiếu phản hồi nhanh Google Forms cuối tiết Hình học không gian lớp 9A2. 85% học sinh nắm vững định lý sau hoạt động ghép nhóm.',
      tags: ['TC1.2', 'Thực hành lớp học']
    }];
    this.set(this.KEYS.EVIDENCE, sampleEvidence);

    // 5. Sample Focus
    this.set(this.KEYS.FOCUS, ['TC1.2', 'TC4.1']);

    this.set('dolphins21_is_sample_data', true);
  },

  clearSampleData() {
    this.set(this.KEYS.PROFILE, { name: '', subject: '', years_experience: '', school: '' });
    this.set(this.KEYS.RATINGS, {});
    this.set(this.KEYS.SNAPSHOTS, []);
    this.set(this.KEYS.GOALS, []);
    this.set(this.KEYS.EVIDENCE, []);
    this.set(this.KEYS.WEEKLY_LOGS, []);
    this.set(this.KEYS.FOCUS, []);
    this.set('dolphins21_is_sample_data', false);
  }
};
