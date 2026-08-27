/**
 * Dolphins21 Internationalization (i18n) Module
 * Clean, lean micro-copy (≤ 2-3 words per label/title/button)
 * Preserves core English pedagogical terms (Radar Chart, Evidence Vault, Streak, Goals, Focus).
 */

const DICTIONARY = {
  vi: {
    // Navigation & Header (≤2 từ)
    nav_dashboard: 'Tổng quan',
    nav_assessment: 'Đánh giá',
    nav_growth: 'Kế hoạch',
    nav_admin: 'Quản trị',
    
    // Common Actions / Buttons (≤2-3 từ)
    btn_save: 'Lưu',
    btn_cancel: 'Hủy',
    btn_close: 'Đóng',
    btn_continue: 'Tiếp tục',
    btn_continue_assess: 'Đánh giá tiếp →',
    btn_compare_snapshots: 'So sánh Snapshots',
    btn_save_snapshot: '📸 Lưu Snapshot',
    btn_quick_checkin: '⚡ Check-in tuần',
    btn_create_goal: '+ Tạo Mục Tiêu',
    btn_add_evidence: '+ Thêm Evidence',
    btn_export_json: 'Xuất tệp Backup ↓',
    btn_import_json: 'Khôi phục tệp',
    btn_back_dashboard: '← Về Tổng quan',
    btn_back_focus: '← Về Focus',
    btn_pin: '📌 Ghim Focus',
    btn_unpin: 'Bỏ ghim',
    btn_load_sample: '✨ Dữ liệu mẫu',
    btn_clear_sample: 'Dữ liệu thật của tôi',
    btn_view_details: 'Chi tiết →',
    btn_view_vault: 'Xem Vault →',
    btn_action_now: 'Thực hiện ngay →',

    // Dashboard (≤2-3 từ)
    dash_greeting: 'Lộ trình phát triển',
    dash_title: 'Tổng quan',
    dash_teacher_label: 'Giáo viên',
    dash_subject_label: 'Môn',
    dash_stat_progress: 'Tiến độ',
    dash_stat_progress_tip: 'Tỷ lệ tiêu chí đã hoàn thành tự đánh giá',
    dash_stat_avg: 'Điểm TB',
    dash_stat_avg_tip: 'Điểm trung bình cộng cấp độ hiện tại',
    dash_stat_scale: 'thang điểm 4.0',
    dash_stat_streak: 'Streak',
    dash_stat_streak_tip: 'Số tuần duy trì ghi chép và phản tư chuyên môn',
    dash_stat_streak_unit: 'tuần ✨',
    dash_stat_goals: 'Mục tiêu',
    dash_stat_evidence: 'Evidence',
    dash_radar_title: 'Radar Chart',
    dash_growth_areas_title: 'Vùng phát triển',
    dash_growth_areas_subtitle: 'Các năng lực cần ưu tiên cải thiện trong chu kỳ này',
    dash_sample_banner: '💡 Bạn đang xem dữ liệu mẫu giáo viên đổi mới.',

    // Assessment
    assess_eyebrow: 'Core Loop',
    assess_title: 'Đánh giá',
    assess_subtitle: 'Tự đánh giá toàn diện năng lực giảng dạy theo 5 Trụ cột và 4 Cấp độ chuẩn Building 21.',
    assess_radar_title: 'Biểu đồ Radar Điểm số',
    assess_score_by_domain: 'Điểm theo Cụm tiêu chí',
    assess_notes_log_title: 'Nhật ký ghi chú & Minh chứng của Đánh giá viên',
    assess_notes_empty: 'Chưa có ghi chú hoặc minh chứng nào. Vui lòng chọn mức điểm và điền lý do giải trình bên dưới.',
    assess_progress_label: 'Tiến độ hoàn thành tự đánh giá:',
    assess_indicators_scored: 'tiêu chí đã đánh giá',
    assess_search_placeholder: 'Tìm kiếm tiêu chí, năng lực, từ khóa...',
    assess_filter_all: 'Tất cả 5 Trụ cột',
    assess_collapse_all: 'Thu gọn tất cả',
    assess_expand_all: 'Mở rộng tất cả',
    assess_not_assessed: 'Chưa đánh giá',
    assess_stage_selected: 'Cấp độ',
    assess_notes_header: 'Ghi chú & Minh chứng thực tế (Tùy chọn)',
    assess_notes_placeholder: 'Ghi lại phản tư, ví dụ thực tế trong tiết dạy...',
    assess_prompt_snapshot: 'Tên Snapshot:',
    assess_snapshot_success: 'Đã lưu Snapshot thành công!',
    assess_next_action: 'Đã đánh giá xong các tiêu chí? Hãy xem Biểu Đồ Năng Lực hoặc đặt Mục Tiêu ngay.',
    assess_view_dashboard_cta: 'Xem Biểu Đồ Năng Lực →',
    assess_create_goal_cta: 'Đặt Mục Tiêu Ngay →',

    // Growth Plan & Tabs (≤2-3 từ)
    growth_eyebrow: 'Action Loop',
    growth_title: 'Kế hoạch',
    growth_subtitle: 'Không gian hợp nhất: Focus, SMART Goals và Evidence Vault.',
    tab_focus: '🎯 Focus',
    tab_goals: '⛳ Mục tiêu',
    tab_evidence: '📁 Evidence Vault',
    
    // Focus
    focus_pinned_title: '📌 Pinned Focus',
    focus_pinned_limit: 'Tối đa 5 trọng tâm/chu kỳ',
    focus_pinned_empty: 'Chưa ghim năng lực nào. Hãy chọn bên dưới để đưa vào tiêu điểm.',
    focus_all_title: 'Tất cả Competencies',
    focus_all_subtitle: 'Xếp theo vùng cần phát triển nhất để dễ ưu tiên',
    
    // Goals & Milestones
    goal_title: 'Mục tiêu',
    goal_subtitle: 'Biến đánh giá thành hành động có thời hạn và cột mốc rõ ràng.',
    goal_empty_title: 'Chưa có mục tiêu',
    goal_empty_desc: 'Thiết lập SMART Goals với các cột mốc thực thi cụ thể.',
    goal_modal_title: 'Tạo Mục Tiêu',
    goal_target_stage: 'Stage mục tiêu:',
    goal_deadline: 'Hạn chót:',
    goal_milestone_first: 'Milestone tuần 1:',
    goal_milestone_list: 'Milestones:',
    goal_status_active: 'Active',
    goal_milestones_done: 'milestones xong',
    
    // Evidence Vault
    evidence_eyebrow: 'Proof of Work',
    evidence_title: 'Evidence Vault',
    evidence_subtitle: 'Lưu trữ bằng chứng thực tế từ lớp học và phản hồi học sinh.',
    evidence_empty_title: 'Chưa có Evidence',
    evidence_empty_desc: 'Bắt đầu ghi lại câu chuyện thực tế đầu tiên từ lớp học.',
    evidence_badge: 'Evidence',
    evidence_placeholder: 'Mô tả hành động thực tế từ lớp học...',

    // Check-in
    checkin_eyebrow: 'Rhythm',
    checkin_title: 'Weekly Check-in',
    checkin_subtitle: 'Dành <5 phút để cập nhật tiến độ và duy trì chuỗi Streak.',
    checkin_q1: '1. Năng lực tập trung tuần này:',
    checkin_q2: '2. Ghi 1 bằng chứng thực tế trong tuần:',
    checkin_btn_submit: '⚡ Hoàn thành Check-in →',
    checkin_success: 'Đã hoàn thành Check-in tuần!',

    // Compare
    compare_title: 'So sánh Snapshots',
    compare_subtitle: 'Xem đối sánh Before vs. After trên biểu đồ Radar.',
    compare_snap_a: 'Snapshot trước',
    compare_snap_b: 'Snapshot sau / Hiện tại',
    compare_btn: 'So sánh →',
    compare_radar_title: 'Radar Chart Đối Sánh',
    compare_current_live: 'Dữ liệu hiện tại (Live)',

    // Onboarding
    onboard_title: 'Chào mừng bạn',
    onboard_subtitle: 'Khởi tạo hồ sơ giáo viên để cá nhân hóa lộ trình phát triển.',
    onboard_card_title: 'Hồ sơ giáo viên',
    onboard_name: 'Họ và tên',
    onboard_subject: 'Môn giảng dạy',
    onboard_years: 'Năm kinh nghiệm',
    onboard_school: 'Trường / Cơ sở',
    onboard_btn_submit: 'Lưu & Vào Dashboard →',

    // Export & Backup
    export_title: 'Xuất dữ liệu',
    export_subtitle: 'Toàn quyền sao lưu và khôi phục dữ liệu hồ sơ.',
    export_card1_title: '1. Sao lưu JSON',
    export_card1_desc: 'Tải về toàn bộ hồ sơ, ratings, snapshots, goals và evidence.',
    export_card2_title: '2. Khôi phục JSON',
    export_card2_desc: 'Tải lên tệp backup để khôi phục trạng thái làm việc.',

    // Micro-copy
    mc_saved: 'Đã lưu ✓',
    mc_not_assessed: 'Chưa đánh giá',
    mc_milestone_done: 'Đã đạt ✓',
    mc_growth_area: 'Đang phát triển nhất',
    mc_share: 'Chia sẻ'
  },

  en: {
    // Navigation & Header (≤2 words)
    nav_dashboard: 'Dashboard',
    nav_assessment: 'Assessment',
    nav_growth: 'Growth Plan',
    nav_admin: 'Admin',

    // Common Actions / Buttons (≤2-3 words)
    btn_save: 'Save',
    btn_cancel: 'Cancel',
    btn_close: 'Close',
    btn_continue: 'Continue',
    btn_continue_assess: 'Continue Assess →',
    btn_compare_snapshots: 'Compare Snapshots',
    btn_save_snapshot: '📸 Save Snapshot',
    btn_quick_checkin: '⚡ Quick Check-in',
    btn_create_goal: '+ New Goal',
    btn_add_evidence: '+ Add Evidence',
    btn_export_json: 'Download Backup ↓',
    btn_import_json: 'Restore Backup',
    btn_back_dashboard: '← Back to Dashboard',
    btn_back_focus: '← Back to Focus',
    btn_pin: '📌 Pin Focus',
    btn_unpin: 'Unpin',
    btn_load_sample: '✨ Sample Data',
    btn_clear_sample: 'My Real Data',
    btn_view_details: 'Details →',
    btn_view_vault: 'View Vault →',
    btn_action_now: 'Take Action →',

    // Dashboard (≤2-3 words)
    dash_greeting: 'Growth Overview',
    dash_title: 'Dashboard',
    dash_teacher_label: 'Teacher',
    dash_subject_label: 'Subject',
    dash_stat_progress: 'Progress',
    dash_stat_progress_tip: 'Completed indicators percentage',
    dash_stat_avg: 'Avg Stage',
    dash_stat_avg_tip: 'Average rating across assessed indicators',
    dash_stat_scale: 'on 4.0 scale',
    dash_stat_streak: 'Streak',
    dash_stat_streak_tip: 'Consecutive active reflection weeks',
    dash_stat_streak_unit: 'weeks ✨',
    dash_stat_goals: 'Goals',
    dash_stat_evidence: 'Evidence',
    dash_radar_title: 'Radar Chart',
    dash_growth_areas_title: 'Growth Areas',
    dash_growth_areas_subtitle: 'Top priority competencies for current cycle',
    dash_sample_banner: '💡 You are viewing sample data of an innovative educator.',

    // Assessment
    assess_eyebrow: 'Core Loop',
    assess_title: 'Assessment',
    assess_subtitle: 'Comprehensive self-assessment across 5 Domains and 4 Stages aligned with Building 21.',
    assess_radar_title: 'Radar Chart Score Breakdown',
    assess_score_by_domain: 'Scores by Domain',
    assess_notes_log_title: 'Evaluator Notes & Evidence Log',
    assess_notes_empty: 'No notes or evidence records entered yet. Select score levels and enter justifications in the fields below.',
    assess_progress_label: 'Self-assessment completion progress:',
    assess_indicators_scored: 'indicators scored',
    assess_search_placeholder: 'Search indicators, competencies, keywords...',
    assess_filter_all: 'All 5 Domains',
    assess_collapse_all: 'Collapse all',
    assess_expand_all: 'Expand all',
    assess_not_assessed: 'Not assessed',
    assess_stage_selected: 'Stage',
    assess_notes_header: 'Classroom Evidence & Reflection (Optional)',
    assess_notes_placeholder: 'Add reflections, classroom evidence notes...',
    assess_prompt_snapshot: 'Snapshot Label:',
    assess_snapshot_success: 'Snapshot saved successfully!',
    assess_next_action: 'Completed assessing your indicators? View your Radar Chart or create a SMART Goal now.',
    assess_view_dashboard_cta: 'View Radar Chart →',
    assess_create_goal_cta: 'Set SMART Goal Now →',

    // Growth Plan & Tabs (≤2-3 words)
    growth_eyebrow: 'Action Loop',
    growth_title: 'Growth Plan',
    growth_subtitle: 'Unified workspace: Focus, SMART Goals, and Evidence Vault.',
    tab_focus: '🎯 Focus',
    tab_goals: '⛳ Goals',
    tab_evidence: '📁 Evidence Vault',

    // Focus
    focus_pinned_title: '📌 Pinned Focus',
    focus_pinned_limit: 'Max 5 priorities/cycle',
    focus_pinned_empty: 'No competencies pinned yet. Choose below to focus.',
    focus_all_title: 'All Competencies',
    focus_all_subtitle: 'Sorted by primary growth areas',

    // Goals & Milestones
    goal_title: 'Goals',
    goal_subtitle: 'Turn self-assessments into time-bound milestones.',
    goal_empty_title: 'No Active Goals',
    goal_empty_desc: 'Set SMART Goals with observable milestones.',
    goal_modal_title: 'New SMART Goal',
    goal_target_stage: 'Target Stage:',
    goal_deadline: 'Deadline:',
    goal_milestone_first: 'Week 1 Milestone:',
    goal_milestone_list: 'Milestones:',
    goal_status_active: 'Active',
    goal_milestones_done: 'milestones done',

    // Evidence Vault
    evidence_eyebrow: 'Proof of Work',
    evidence_title: 'Evidence Vault',
    evidence_subtitle: 'Authentic classroom artifacts and student feedback.',
    evidence_empty_title: 'No Evidence Yet',
    evidence_empty_desc: 'Log your first authentic classroom story.',
    evidence_badge: 'Evidence',
    evidence_placeholder: 'Describe authentic classroom practice...',

    // Check-in
    checkin_eyebrow: 'Rhythm',
    checkin_title: 'Weekly Check-in',
    checkin_subtitle: 'Spend <5 minutes to update progress and keep streak.',
    checkin_q1: '1. Focus competencies this week:',
    checkin_q2: '2. Log one key evidence note:',
    checkin_btn_submit: '⚡ Complete Check-in →',
    checkin_success: 'Weekly check-in completed!',

    // Compare
    compare_title: 'Compare Snapshots',
    compare_subtitle: 'Before vs. After overlay on Radar Chart.',
    compare_snap_a: 'Earlier Snapshot',
    compare_snap_b: 'Later / Live Data',
    compare_btn: 'Compare →',
    compare_radar_title: 'Overlay Radar Chart',
    compare_current_live: 'Live Assessment Data',

    // Onboarding
    onboard_title: 'Welcome',
    onboard_subtitle: 'Set up your profile to personalize your growth pathway.',
    onboard_card_title: 'Teacher Profile',
    onboard_name: 'Full Name',
    onboard_subject: 'Teaching Subject',
    onboard_years: 'Years Experience',
    onboard_school: 'School / Institution',
    onboard_btn_submit: 'Save & Open Dashboard →',

    // Export & Backup
    export_title: 'Export Data',
    export_subtitle: 'Backup and restore your profile anytime.',
    export_card1_title: '1. Export JSON',
    export_card1_desc: 'Download all profile, ratings, snapshots, goals and evidence.',
    export_card2_title: '2. Restore JSON',
    export_card2_desc: 'Upload a backup JSON file to restore your workspace.',

    // Micro-copy
    mc_saved: 'Saved ✓',
    mc_not_assessed: 'Not assessed',
    mc_milestone_done: 'Achieved ✓',
    mc_growth_area: 'Primary growth area',
    mc_share: 'Share'
  }
};

window.I18N = {
  STORAGE_KEY: 'dolphins21_lang',

  getLang() {
    return localStorage.getItem(this.STORAGE_KEY) || 'vi';
  },

  setLang(lang) {
    if (lang !== 'vi' && lang !== 'en') lang = 'vi';
    localStorage.setItem(this.STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    this.applyToDOM();
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  },

  t(key) {
    const lang = this.getLang();
    return (DICTIONARY[lang] && DICTIONARY[lang][key]) || (DICTIONARY['vi'][key]) || key;
  },

  init() {
    const currentLang = this.getLang();
    document.documentElement.lang = currentLang;
    this.renderLanguageSwitcher();
    this.applyToDOM();
  },

  renderLanguageSwitcher() {
    const headerInner = document.querySelector('.header-inner');
    if (!headerInner) return;

    let switcher = document.getElementById('langSwitcher');
    if (!switcher) {
      switcher = document.createElement('div');
      switcher.id = 'langSwitcher';
      switcher.className = 'lang-switcher-wrap';
      switcher.style.display = 'flex';
      switcher.style.alignItems = 'center';
      switcher.style.gap = '4px';
      switcher.style.marginLeft = '16px';
      
      const navLinks = headerInner.querySelector('.nav-links');
      if (navLinks) {
        headerInner.insertBefore(switcher, navLinks.nextSibling);
      } else {
        headerInner.appendChild(switcher);
      }
    }

    const currentLang = this.getLang();
    switcher.innerHTML = `
      <div style="display:inline-flex; border:1px solid var(--border); border-radius:6px; overflow:hidden; font-size:12px; font-weight:700;">
        <button type="button" onclick="I18N.setLang('vi')" style="border:none; padding:4px 8px; cursor:pointer; background:${currentLang === 'vi' ? 'var(--primary)' : 'var(--card)'}; color:${currentLang === 'vi' ? '#fff' : 'var(--muted-foreground)'};">VI</button>
        <button type="button" onclick="I18N.setLang('en')" style="border:none; padding:4px 8px; cursor:pointer; background:${currentLang === 'en' ? 'var(--primary)' : 'var(--card)'}; color:${currentLang === 'en' ? '#fff' : 'var(--muted-foreground)'};">EN</button>
      </div>
    `;
  },

  applyToDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = this.t(key);
    });

    this.renderLanguageSwitcher();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.I18N.init();
});
