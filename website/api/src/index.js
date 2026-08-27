import { Router } from 'itty-router';

const router = Router();

// CORS Headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, X-Admin-Key',
};

const jsonResponse = (data, status = 200, error = null) => {
  return new Response(JSON.stringify({
    data,
    error,
    meta: { timestamp: new Date().toISOString() }
  }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
};

// Global OPTIONS
router.options('*', () => new Response(null, { headers: corsHeaders }));

// Health check
router.get('/v1/health', () => jsonResponse({ status: 'ok', app: 'Dolphins21 API' }));

// Profile
router.get('/v1/profile', async (req, env) => {
  try {
    const profile = await env.DB.prepare('SELECT * FROM profiles WHERE id = ?').bind('main').first();
    return jsonResponse(profile || { id: 'main', name: 'Giáo viên', subject: '', years_experience: 0, school: '' });
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

router.post('/v1/profile', async (req, env) => {
  try {
    const body = await req.json();
    await env.DB.prepare(`
      INSERT OR REPLACE INTO profiles (id, name, subject, years_experience, school, settings_json, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind('main', body.name || 'Giáo viên', body.subject || '', body.years_experience || 0, body.school || '', JSON.stringify(body.settings || {})).run();
    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

// Framework
router.get('/v1/framework/domains', async (req, env) => {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM framework_domains ORDER BY sort_order ASC').all();
    return jsonResponse(results);
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

router.get('/v1/framework/competencies', async (req, env) => {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM framework_competencies ORDER BY sort_order ASC').all();
    return jsonResponse(results);
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

router.get('/v1/framework/indicators', async (req, env) => {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM framework_indicators ORDER BY indicator_index ASC').all();
    return jsonResponse(results);
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

// Ratings
router.get('/v1/indicators', async (req, env) => {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM indicator_ratings').all();
    return jsonResponse(results);
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

router.post('/v1/indicators', async (req, env) => {
  try {
    const body = await req.json(); // { indicator_id, competency_id, domain_id, stage }
    const id = `${body.indicator_id}_rating`;
    await env.DB.prepare(`
      INSERT OR REPLACE INTO indicator_ratings (id, indicator_id, competency_id, domain_id, stage, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).bind(id, body.indicator_id, body.competency_id, body.domain_id, body.stage).run();
    return jsonResponse({ id, indicator_id: body.indicator_id, stage: body.stage });
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

// Snapshots
router.get('/v1/snapshots', async (req, env) => {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM snapshots ORDER BY created_at DESC').all();
    return jsonResponse(results);
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

router.post('/v1/snapshots', async (req, env) => {
  try {
    const body = await req.json(); // { label, items: [{ indicator_id, stage }] }
    const snapId = 'snap_' + Date.now();
    await env.DB.prepare('INSERT INTO snapshots (id, label, created_at) VALUES (?, ?, datetime("now"))')
      .bind(snapId, body.label || 'Đánh giá năng lực').run();
    
    if (body.items && body.items.length) {
      for (const item of body.items) {
        await env.DB.prepare('INSERT INTO snapshot_items (snapshot_id, indicator_id, stage) VALUES (?, ?, ?)')
          .bind(snapId, item.indicator_id, item.stage).run();
      }
    }
    return jsonResponse({ id: snapId, label: body.label });
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

// Goals
router.get('/v1/goals', async (req, env) => {
  try {
    const { results: goals } = await env.DB.prepare('SELECT * FROM goals ORDER BY created_at DESC').all();
    const { results: milestones } = await env.DB.prepare('SELECT * FROM milestones ORDER BY sort_order ASC').all();
    
    const goalsWithMilestones = goals.map(g => ({
      ...g,
      milestones: milestones.filter(m => m.goal_id === g.id)
    }));
    return jsonResponse(goalsWithMilestones);
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

router.post('/v1/goals', async (req, env) => {
  try {
    const body = await req.json();
    const goalId = 'goal_' + Date.now();
    await env.DB.prepare(`
      INSERT INTO goals (id, indicator_id, competency_id, current_stage, target_stage, deadline, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 'active', datetime('now'), datetime('now'))
    `).bind(goalId, body.indicator_id, body.competency_id, body.current_stage, body.target_stage, body.deadline).run();

    if (body.milestones && body.milestones.length) {
      for (let i = 0; i < body.milestones.length; i++) {
        const ms = body.milestones[i];
        const msId = `ms_${goalId}_${i+1}`;
        await env.DB.prepare(`
          INSERT INTO milestones (id, goal_id, label, due_date, completed, sort_order)
          VALUES (?, ?, ?, ?, 0, ?)
        `).bind(msId, goalId, ms.label, ms.due_date || body.deadline, i+1).run();
      }
    }
    return jsonResponse({ id: goalId });
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

router.patch('/v1/milestones/:id', async (req, env) => {
  try {
    const id = req.params.id;
    const body = await req.json(); // { completed, evidence_note }
    await env.DB.prepare(`
      UPDATE milestones
      SET completed = ?, completed_at = ?, evidence_note = ?
      WHERE id = ?
    `).bind(body.completed ? 1 : 0, body.completed ? new Date().toISOString() : null, body.evidence_note || '', id).run();
    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

// Evidence
router.get('/v1/evidence', async (req, env) => {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM evidence_notes ORDER BY date DESC').all();
    return jsonResponse(results);
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

router.post('/v1/evidence', async (req, env) => {
  try {
    const body = await req.json();
    const evId = 'ev_' + Date.now();
    await env.DB.prepare(`
      INSERT INTO evidence_notes (id, indicator_id, competency_id, date, content, tags_json, linked_goal_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(evId, body.indicator_id, body.competency_id, body.date || new Date().toISOString().split('T')[0], body.content, JSON.stringify(body.tags || []), body.linked_goal_id || null).run();
    return jsonResponse({ id: evId });
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

// Weekly logs & Streak
router.get('/v1/weekly-logs', async (req, env) => {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM weekly_logs ORDER BY week_start_date DESC').all();
    return jsonResponse(results);
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

router.post('/v1/weekly-logs', async (req, env) => {
  try {
    const body = await req.json();
    const logId = 'wk_' + Date.now();
    await env.DB.prepare('INSERT INTO weekly_logs (id, week_start_date, note, created_at) VALUES (?, ?, ?, datetime("now"))')
      .bind(logId, body.week_start_date || new Date().toISOString().split('T')[0], body.note || '').run();
    return jsonResponse({ id: logId });
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

// Pinned Competencies
router.get('/v1/focus', async (req, env) => {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM pinned_competencies ORDER BY pinned_at DESC').all();
    return jsonResponse(results);
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

router.post('/v1/focus', async (req, env) => {
  try {
    const body = await req.json();
    await env.DB.prepare('INSERT OR REPLACE INTO pinned_competencies (competency_id, pinned_at) VALUES (?, datetime("now"))')
      .bind(body.competency_id).run();
    return jsonResponse({ success: true, competency_id: body.competency_id });
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

router.delete('/v1/focus/:id', async (req, env) => {
  try {
    const compId = req.params.id;
    await env.DB.prepare('DELETE FROM pinned_competencies WHERE competency_id = ?').bind(compId).run();
    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

// Catch all
router.all('*', () => jsonResponse(null, 404, { message: 'Route not found' }));

export default {
  fetch: (request, env, ctx) => router.fetch(request, env, ctx).catch(err => jsonResponse(null, 500, { message: err.message }))
};

