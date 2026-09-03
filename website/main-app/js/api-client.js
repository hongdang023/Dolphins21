/**
 * Dolphins21 API Client with local fallback store
 * Clean initial state (Zero dummy data)
 * Full Multi-User Isolation & Cloudflare Access Integration
 */
const API_BASE = 'https://dolphins21-api.dangtuyethong2324.workers.dev/v1';

window.DolphinsStore = {
  KEYS: {
    PROFILE: 'profile',
    RATINGS: 'ratings',
    SNAPSHOTS: 'snapshots',
    GOALS: 'goals',
    EVIDENCE: 'evidence',
    WEEKLY_LOGS: 'weekly_logs',
    FOCUS: 'focus'
  },

  getCurrentUser() {
    let email = localStorage.getItem('dolphins21_current_user_email');
    if (!email) {
      email = 'teacher_default';
      localStorage.setItem('dolphins21_current_user_email', email);
    }
    return email;
  },

  setCurrentUser(email) {
    if (email && email.trim()) {
      const cleanEmail = email.toLowerCase().trim();
      const prevEmail = this.getCurrentUser();
      if (prevEmail !== cleanEmail) {
        localStorage.setItem('dolphins21_current_user_email', cleanEmail);
        window.dispatchEvent(new CustomEvent('userChanged', { detail: { email: cleanEmail } }));
      }
    }
  },

  getUserKey(baseKey) {
    const user = this.getCurrentUser();
    return `dolphins21_${user}_${baseKey}`;
  },

  get(key, defaultValue = null) {
    try {
      const scopedKey = this.getUserKey(key);
      const data = localStorage.getItem(scopedKey);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      const scopedKey = this.getUserKey(key);
      localStorage.setItem(scopedKey, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  },

  // Profile (Empty initial state)
  getProfile() {
    const user = this.getCurrentUser();
    const defaultName = user !== 'teacher_default' ? user.split('@')[0] : '';
    return this.get(this.KEYS.PROFILE, {
      name: defaultName,
      subject: '',
      years_experience: '',
      school: ''
    });
  },

  saveProfile(profile) {
    this.set(this.KEYS.PROFILE, profile);
    // Background sync to API if available
    DolphinsAPI.saveProfileRemote(profile).catch(() => {});
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
    // Sync remote
    DolphinsAPI.saveRatingRemote(ratings[indicatorId]).catch(() => {});
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
    DolphinsAPI.saveSnapshotRemote(newSnap).catch(() => {});
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
      DolphinsAPI.removeFocusRemote(competencyId).catch(() => {});
    } else {
      if (focus.length >= 5) focus.shift();
      focus.push(competencyId);
      DolphinsAPI.saveFocusRemote(competencyId).catch(() => {});
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
    DolphinsAPI.saveGoalRemote(goal).catch(() => {});
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
        DolphinsAPI.updateMilestoneRemote(ms.id, ms.completed, ms.evidence_note).catch(() => {});
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
    DolphinsAPI.saveEvidenceRemote(evidence).catch(() => {});
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
    DolphinsAPI.saveWeeklyLogRemote(newLog).catch(() => {});
    return newLog;
  },

  getStreak() {
    const logs = this.getWeeklyLogs();
    return logs.length;
  },

  // Sample Data Loader
  isSampleDataLoaded() {
    return this.get('dolphins21_is_sample_data', false);
  },

  loadSampleData() {
    this.saveProfile({
      name: 'Thầy Nguyễn Hoàng Nam',
      subject: 'Toán học & STEM',
      years_experience: 6,
      school: 'Trường THCS-THPT Đổi Mới'
    });

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

    const sampleEvidence = [{
      id: 'ev_sample_1',
      competency_id: 'TC1.2',
      indicator_id: 'TC1.2-IND-1',
      date: new Date().toISOString().split('T')[0],
      content: 'Hình ảnh và dữ liệu thống kê từ phiếu phản hồi nhanh Google Forms cuối tiết Hình học không gian lớp 9A2.',
      tags: ['TC1.2', 'Thực hành lớp học']
    }];
    this.set(this.KEYS.EVIDENCE, sampleEvidence);

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

// Remote API Sync Handler
window.DolphinsAPI = {
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-User-Email': DolphinsStore.getCurrentUser()
    };
  },

  async initAuth() {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, { headers: this.getHeaders() });
      if (res.ok) {
        const result = await res.json();
        if (result.data && result.data.email && result.data.email !== 'anonymous_teacher' && result.data.email !== 'default_teacher') {
          DolphinsStore.setCurrentUser(result.data.email);
        }
      }
    } catch (e) {
      console.warn('Auth check skipped (offline/local mode)');
    }
    this.renderUserBadge();
  },

  renderUserBadge() {
    const profile = DolphinsStore.getProfile();
    const user = DolphinsStore.getCurrentUser();
    const isDefault = user === 'teacher_default' || user === 'anonymous_teacher';
    
    // Determine display name
    let displayName = profile && profile.name && profile.name.trim() ? profile.name.trim() : '';
    if (!displayName) {
      if (!isDefault) {
        displayName = user.split('@')[0];
        // Capitalize first letters if email prefix
        displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
      } else {
        displayName = 'Giáo viên';
      }
    }

    // Generate initial for avatar
    const initials = displayName
      .split(' ')
      .filter(Boolean)
      .map(w => w[0])
      .slice(-2)
      .join('')
      .toUpperCase() || '🐬';

    const nav = document.querySelector('.header-inner') || document.querySelector('.app-header');
    if (!nav) return;

    let badge = document.getElementById('userProfileBadge');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'userProfileBadge';
      badge.style.cssText = 'display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: var(--foreground); cursor: pointer;';
      nav.appendChild(badge);
    }

    badge.innerHTML = `
      <div id="btnProfileTrigger" style="display: flex; align-items: center; gap: 8px; padding: 4px 12px 4px 6px; background: var(--muted); border: 1px solid var(--border); border-radius: 24px; transition: all 0.2s ease;">
        <div style="width: 28px; height: 28px; border-radius: 50%; background: var(--primary); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; letter-spacing: 0.5px;">
          ${initials}
        </div>
        <span style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 700; font-size: 14px;">${displayName}</span>
      </div>
    `;

    document.getElementById('btnProfileTrigger').onclick = () => {
      this.openAccountModal();
    };
  },

  openAccountModal() {
    let modal = document.getElementById('dolphinsAccountModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'dolphinsAccountModal';
      modal.className = 'drawer-overlay';
      modal.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; backdrop-filter: blur(2px);';
      document.body.appendChild(modal);
    }

    const profile = DolphinsStore.getProfile();
    const user = DolphinsStore.getCurrentUser();
    const isDefault = user === 'teacher_default' || user === 'anonymous_teacher';

    const displayName = profile && profile.name ? profile.name : '';
    const subject = profile && profile.subject ? profile.subject : '';
    const years = profile && profile.years_experience ? profile.years_experience : '';
    const school = profile && profile.school ? profile.school : '';

    const initials = (displayName || user)
      .split(' ')
      .filter(Boolean)
      .map(w => w[0])
      .slice(-2)
      .join('')
      .toUpperCase() || '🐬';

    modal.innerHTML = `
      <div style="background: #ffffff; border-radius: 16px; padding: 28px; width: 90%; max-width: 460px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); border: 1px solid var(--border);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--primary); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 900; box-shadow: 0 4px 10px rgba(204,78,45,0.3);">
              ${initials}
            </div>
            <div>
              <h3 style="font-size: 18px; font-weight: 800; margin: 0; color: var(--foreground);">${displayName || 'Hồ sơ Giáo viên'}</h3>
              <div style="font-size: 12px; color: var(--muted-foreground); margin-top: 2px;">${isDefault ? 'Tài khoản cục bộ' : user}</div>
            </div>
          </div>
          <button id="closeAccountModalBtn" style="background: none; border: none; font-size: 20px; cursor: pointer; color: var(--muted-foreground); line-height: 1;">✕</button>
        </div>

        <form id="modalProfileForm" style="display: flex; flex-direction: column; gap: 12px;">
          <div>
            <label style="display: block; font-size: 12px; font-weight: 700; color: var(--foreground); margin-bottom: 4px;">Email tài khoản:</label>
            <input type="email" id="modalEmailInput" class="form-input" style="width: 100%; box-sizing: border-box; font-size: 14px; background: #f8fafc; color: var(--muted-foreground);" value="${isDefault ? '' : user}" readonly>
          </div>

          <div>
            <label style="display: block; font-size: 12px; font-weight: 700; color: var(--foreground); margin-bottom: 4px;">Họ và tên:</label>
            <input type="text" id="modalNameInput" class="form-input" style="width: 100%; box-sizing: border-box; font-size: 14px;" placeholder="Ví dụ: Cô Đặng Tuyết Hồng" value="${displayName}" required>
          </div>

          <div>
            <label style="display: block; font-size: 12px; font-weight: 700; color: var(--foreground); margin-bottom: 4px;">Môn giảng dạy:</label>
            <input type="text" id="modalSubjectInput" class="form-input" style="width: 100%; box-sizing: border-box; font-size: 14px;" placeholder="Ví dụ: Toán học, STEM, Ngữ văn" value="${subject}">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>
              <label style="display: block; font-size: 12px; font-weight: 700; color: var(--foreground); margin-bottom: 4px;">Số năm kinh nghiệm:</label>
              <input type="number" id="modalYearsInput" min="0" max="60" class="form-input" style="width: 100%; box-sizing: border-box; font-size: 14px;" placeholder="Ví dụ: 6" value="${years}">
            </div>
            <div>
              <label style="display: block; font-size: 12px; font-weight: 700; color: var(--foreground); margin-bottom: 4px;">Trường / Cơ sở:</label>
              <input type="text" id="modalSchoolInput" class="form-input" style="width: 100%; box-sizing: border-box; font-size: 14px;" placeholder="Ví dụ: THCS Đổi Mới" value="${school}">
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; pt: 12px; border-top: 1px solid var(--border); padding-top: 16px;">
            <button type="button" id="btnSwitchAccountModal" style="background: none; border: none; font-size: 12px; color: #dc2626; cursor: pointer; text-decoration: underline; font-weight: 600;">
              Đăng xuất / Đổi tài khoản ➜
            </button>
            <div style="display: flex; gap: 8px;">
              <button type="button" id="cancelAccountModalBtn" class="btn btn-secondary btn-sm">Đóng</button>
              <button type="submit" class="btn btn-primary btn-sm">Lưu hồ sơ ✓</button>
            </div>
          </div>
        </form>
      </div>
    `;

    modal.style.display = 'flex';

    document.getElementById('closeAccountModalBtn').onclick = () => { modal.style.display = 'none'; };
    document.getElementById('cancelAccountModalBtn').onclick = () => { modal.style.display = 'none'; };

    document.getElementById('btnSwitchAccountModal').onclick = () => {
      if (confirm('Bạn có muốn đăng xuất để chuyển sang tài khoản giáo viên khác qua Cloudflare Access?')) {
        localStorage.removeItem('dolphins21_current_user_email');
        window.location.href = 'https://sparkling-dust-0f63.cloudflareaccess.com/cdn-cgi/access/logout?returnTo=' + encodeURIComponent(window.location.origin + '/onboarding.html');
      }
    };

    document.getElementById('modalProfileForm').onsubmit = (e) => {
      e.preventDefault();
      const updatedProfile = {
        name: document.getElementById('modalNameInput').value.trim(),
        subject: document.getElementById('modalSubjectInput').value.trim(),
        years_experience: parseInt(document.getElementById('modalYearsInput').value) || 0,
        school: document.getElementById('modalSchoolInput').value.trim()
      };
      DolphinsStore.saveProfile(updatedProfile);
      modal.style.display = 'none';
      DolphinsAPI.renderUserBadge();
      // If on dashboard, reload to reflect name
      if (window.location.pathname.includes('dashboard')) {
        window.location.reload();
      }
    };
  },

  async saveProfileRemote(profile) {
    return fetch(`${API_BASE}/profile`, { method: 'POST', headers: this.getHeaders(), body: JSON.stringify(profile) });
  },

  async saveRatingRemote(rating) {
    return fetch(`${API_BASE}/indicators`, { method: 'POST', headers: this.getHeaders(), body: JSON.stringify(rating) });
  },

  async saveSnapshotRemote(snapshot) {
    return fetch(`${API_BASE}/snapshots`, { method: 'POST', headers: this.getHeaders(), body: JSON.stringify(snapshot) });
  },

  async saveGoalRemote(goal) {
    return fetch(`${API_BASE}/goals`, { method: 'POST', headers: this.getHeaders(), body: JSON.stringify(goal) });
  },

  async updateMilestoneRemote(milestoneId, completed, note) {
    return fetch(`${API_BASE}/milestones/${milestoneId}`, { method: 'PATCH', headers: this.getHeaders(), body: JSON.stringify({ completed, evidence_note: note }) });
  },

  async saveEvidenceRemote(evidence) {
    return fetch(`${API_BASE}/evidence`, { method: 'POST', headers: this.getHeaders(), body: JSON.stringify(evidence) });
  },

  async saveWeeklyLogRemote(log) {
    return fetch(`${API_BASE}/weekly-logs`, { method: 'POST', headers: this.getHeaders(), body: JSON.stringify(log) });
  },

  async saveFocusRemote(compId) {
    return fetch(`${API_BASE}/focus`, { method: 'POST', headers: this.getHeaders(), body: JSON.stringify({ competency_id: compId }) });
  },

  async removeFocusRemote(compId) {
    return fetch(`${API_BASE}/focus/${compId}`, { method: 'DELETE', headers: this.getHeaders() });
  }
};

// Auto-run auth on script load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    DolphinsAPI.initAuth();
  });
}
