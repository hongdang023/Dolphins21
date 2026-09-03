import { Router } from 'itty-router';

const router = Router();

// CORS Headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, X-Admin-Key, X-User-Email, Cf-Access-Authenticated-User-Email, Authorization',
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

// Extract user email from Cloudflare Access or Custom headers
const getUserEmail = (req) => {
  const cfEmail = req.headers.get('Cf-Access-Authenticated-User-Email');
  if (cfEmail) return cfEmail.toLowerCase().trim();

  const customEmail = req.headers.get('X-User-Email');
  if (customEmail) return customEmail.toLowerCase().trim();

  return 'anonymous_teacher';
};

// Health & Auth Identity check
router.get('/v1/health', () => jsonResponse({ status: 'ok', app: 'Dolphins21 API' }));

router.get('/v1/auth/me', (req) => {
  const email = getUserEmail(req);
  return jsonResponse({
    authenticated: email !== 'anonymous_teacher',
    email: email,
    source: req.headers.get('Cf-Access-Authenticated-User-Email') ? 'cloudflare_access' : (req.headers.get('X-User-Email') ? 'x_user_email' : 'anonymous')
  });
});

// Profile (Per User)
router.get('/v1/profile', async (req, env) => {
  try {
    const userEmail = getUserEmail(req);
    const profile = await env.DB.prepare('SELECT * FROM profiles WHERE id = ?').bind(userEmail).first();
    return jsonResponse(profile || { id: userEmail, name: userEmail !== 'anonymous_teacher' ? userEmail.split('@')[0] : 'Giáo viên', subject: '', years_experience: 0, school: '' });
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

router.post('/v1/profile', async (req, env) => {
  try {
    const userEmail = getUserEmail(req);
    const body = await req.json();
    await env.DB.prepare(`
      INSERT OR REPLACE INTO profiles (id, name, subject, years_experience, school, settings_json, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(userEmail, body.name || userEmail.split('@')[0], body.subject || '', body.years_experience || 0, body.school || '', JSON.stringify(body.settings || {})).run();
    return jsonResponse({ success: true, email: userEmail });
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

// Framework Data (Shared - Read Only)
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

// Ratings (Per User)
router.get('/v1/indicators', async (req, env) => {
  try {
    const userEmail = getUserEmail(req);
    const { results } = await env.DB.prepare('SELECT * FROM indicator_ratings WHERE user_email = ?').bind(userEmail).all();
    return jsonResponse(results);
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

router.post('/v1/indicators', async (req, env) => {
  try {
    const userEmail = getUserEmail(req);
    const body = await req.json(); // { indicator_id, competency_id, domain_id, stage, note }
    const id = `${userEmail}_${body.indicator_id}`;
    await env.DB.prepare(`
      INSERT OR REPLACE INTO indicator_ratings (id, user_email, indicator_id, competency_id, domain_id, stage, note, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(id, userEmail, body.indicator_id, body.competency_id, body.domain_id, body.stage, body.note || '').run();
    return jsonResponse({ id, indicator_id: body.indicator_id, stage: body.stage, user_email: userEmail });
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

// Snapshots (Per User)
router.get('/v1/snapshots', async (req, env) => {
  try {
    const userEmail = getUserEmail(req);
    const { results: snapshots } = await env.DB.prepare('SELECT * FROM snapshots WHERE user_email = ? ORDER BY created_at DESC').bind(userEmail).all();
    const { results: items } = await env.DB.prepare('SELECT * FROM snapshot_items WHERE snapshot_id IN (SELECT id FROM snapshots WHERE user_email = ?)').bind(userEmail).all();

    const fullSnapshots = snapshots.map(s => ({
      ...s,
      items: items.filter(i => i.snapshot_id === s.id)
    }));
    return jsonResponse(fullSnapshots);
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

router.post('/v1/snapshots', async (req, env) => {
  try {
    const userEmail = getUserEmail(req);
    const body = await req.json(); // { label, items: [{ indicator_id, stage }] }
    const snapId = 'snap_' + Date.now();
    await env.DB.prepare('INSERT INTO snapshots (id, user_email, label, created_at) VALUES (?, ?, ?, datetime("now"))')
      .bind(snapId, userEmail, body.label || 'Đánh giá năng lực').run();
    
    if (body.items && body.items.length) {
      for (const item of body.items) {
        await env.DB.prepare('INSERT INTO snapshot_items (snapshot_id, indicator_id, stage) VALUES (?, ?, ?)')
          .bind(snapId, item.indicator_id, item.stage).run();
      }
    }
    return jsonResponse({ id: snapId, label: body.label, user_email: userEmail });
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

// Goals & Milestones (Per User)
router.get('/v1/goals', async (req, env) => {
  try {
    const userEmail = getUserEmail(req);
    const { results: goals } = await env.DB.prepare('SELECT * FROM goals WHERE user_email = ? ORDER BY created_at DESC').bind(userEmail).all();
    const { results: milestones } = await env.DB.prepare('SELECT * FROM milestones WHERE goal_id IN (SELECT id FROM goals WHERE user_email = ?) ORDER BY sort_order ASC').bind(userEmail).all();
    
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
    const userEmail = getUserEmail(req);
    const body = await req.json();
    const goalId = 'goal_' + Date.now();
    await env.DB.prepare(`
      INSERT INTO goals (id, user_email, indicator_id, competency_id, current_stage, target_stage, deadline, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'active', datetime('now'), datetime('now'))
    `).bind(goalId, userEmail, body.indicator_id, body.competency_id, body.current_stage, body.target_stage, body.deadline).run();

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
    return jsonResponse({ id: goalId, user_email: userEmail });
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

// Evidence Notes (Per User)
router.get('/v1/evidence', async (req, env) => {
  try {
    const userEmail = getUserEmail(req);
    const { results } = await env.DB.prepare('SELECT * FROM evidence_notes WHERE user_email = ? ORDER BY date DESC').bind(userEmail).all();
    return jsonResponse(results);
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

router.post('/v1/evidence', async (req, env) => {
  try {
    const userEmail = getUserEmail(req);
    const body = await req.json();
    const evId = 'ev_' + Date.now();
    await env.DB.prepare(`
      INSERT INTO evidence_notes (id, user_email, indicator_id, competency_id, date, content, tags_json, linked_goal_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(evId, userEmail, body.indicator_id, body.competency_id, body.date || new Date().toISOString().split('T')[0], body.content, JSON.stringify(body.tags || []), body.linked_goal_id || null).run();
    return jsonResponse({ id: evId, user_email: userEmail });
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

// Weekly logs & Streak (Per User)
router.get('/v1/weekly-logs', async (req, env) => {
  try {
    const userEmail = getUserEmail(req);
    const { results } = await env.DB.prepare('SELECT * FROM weekly_logs WHERE user_email = ? ORDER BY week_start_date DESC').bind(userEmail).all();
    return jsonResponse(results);
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

router.post('/v1/weekly-logs', async (req, env) => {
  try {
    const userEmail = getUserEmail(req);
    const body = await req.json();
    const logId = 'wk_' + Date.now();
    await env.DB.prepare('INSERT INTO weekly_logs (id, user_email, week_start_date, note, created_at) VALUES (?, ?, ?, ?, datetime("now"))')
      .bind(logId, userEmail, body.week_start_date || new Date().toISOString().split('T')[0], body.note || '').run();
    return jsonResponse({ id: logId, user_email: userEmail });
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

// Pinned Competencies / Focus (Per User)
router.get('/v1/focus', async (req, env) => {
  try {
    const userEmail = getUserEmail(req);
    const { results } = await env.DB.prepare('SELECT * FROM pinned_competencies WHERE user_email = ? ORDER BY pinned_at DESC').bind(userEmail).all();
    return jsonResponse(results);
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

router.post('/v1/focus', async (req, env) => {
  try {
    const userEmail = getUserEmail(req);
    const body = await req.json();
    await env.DB.prepare('INSERT OR REPLACE INTO pinned_competencies (competency_id, user_email, pinned_at) VALUES (?, ?, datetime("now"))')
      .bind(body.competency_id, userEmail).run();
    return jsonResponse({ success: true, competency_id: body.competency_id, user_email: userEmail });
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

router.delete('/v1/focus/:id', async (req, env) => {
  try {
    const userEmail = getUserEmail(req);
    const compId = req.params.id;
    await env.DB.prepare('DELETE FROM pinned_competencies WHERE competency_id = ? AND user_email = ?').bind(compId, userEmail).run();
    return jsonResponse({ success: true, user_email: userEmail });
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

// Admin Endpoints
router.put('/v1/admin/rubrics/:id', async (req, env) => {
  try {
    const indicatorId = req.params.id;
    const body = await req.json();
    
    await env.DB.prepare(`
      UPDATE framework_indicators
      SET rubric_stage1 = ?, rubric_stage2 = ?, rubric_stage3 = ?, rubric_stage4 = ?
      WHERE id = ?
    `).bind(
      body.rubric_stage1 || '',
      body.rubric_stage2 || '',
      body.rubric_stage3 || '',
      body.rubric_stage4 || '',
      indicatorId
    ).run();

    return jsonResponse({ success: true, indicator_id: indicatorId });
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

router.get('/v1/admin/analytics', async (req, env) => {
  try {
    const { results: profiles } = await env.DB.prepare('SELECT COUNT(*) as total_profiles FROM profiles').all();
    const totalProfiles = profiles?.[0]?.total_profiles || 0;

    const { results: ratings } = await env.DB.prepare(`
      SELECT stage, domain_id, COUNT(*) as count 
      FROM indicator_ratings 
      GROUP BY stage, domain_id
    `).all();

    const { results: domainAverages } = await env.DB.prepare(`
      SELECT domain_id, AVG(stage) as avg_stage, COUNT(*) as rated_count
      FROM indicator_ratings
      GROUP BY domain_id
    `).all();

    const { results: totalRatingsRow } = await env.DB.prepare('SELECT COUNT(*) as total_ratings FROM indicator_ratings').all();
    const totalRatings = totalRatingsRow?.[0]?.total_ratings || 0;

    const { results: goalsCountRow } = await env.DB.prepare('SELECT COUNT(*) as active_goals FROM goals WHERE status = "active"').all();
    const activeGoals = goalsCountRow?.[0]?.active_goals || 0;

    const { results: evidenceCountRow } = await env.DB.prepare('SELECT COUNT(*) as total_evidence FROM evidence_notes').all();
    const totalEvidence = evidenceCountRow?.[0]?.total_evidence || 0;

    const stageDistribution = { 1: 0, 2: 0, 3: 0, 4: 0 };
    ratings.forEach(r => {
      if (r.stage && stageDistribution[r.stage] !== undefined) {
        stageDistribution[r.stage] += r.count;
      }
    });

    const completionRate = totalProfiles > 0 ? Math.round((totalRatings / (totalProfiles * 117)) * 100) : (totalRatings > 0 ? Math.round((totalRatings / 117) * 100) : 0);

    return jsonResponse({
      total_profiles: totalProfiles,
      total_ratings: totalRatings,
      completion_rate_percent: Math.min(100, completionRate),
      active_goals: activeGoals,
      total_evidence: totalEvidence,
      stage_distribution: stageDistribution,
      domain_averages: domainAverages
    });
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

router.get('/v1/admin/profiles', async (req, env) => {
  try {
    const { results: profiles } = await env.DB.prepare('SELECT * FROM profiles ORDER BY updated_at DESC').all();
    const profilesWithProgress = await Promise.all(profiles.map(async p => {
      const { results: ratingsCount } = await env.DB.prepare('SELECT COUNT(*) as rated_count FROM indicator_ratings WHERE user_email = ?').bind(p.id).all();
      const ratedCount = ratingsCount?.[0]?.rated_count || 0;
      return {
        ...p,
        email: p.id,
        rated_count: ratedCount,
        completion_percent: Math.round((ratedCount / 117) * 100)
      };
    }));

    return jsonResponse(profilesWithProgress);
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

router.delete('/v1/admin/profiles/:id', async (req, env) => {
  try {
    const profileId = req.params.id;
    await env.DB.prepare('DELETE FROM indicator_ratings WHERE user_email = ?').bind(profileId).run();
    await env.DB.prepare('DELETE FROM goals WHERE user_email = ?').bind(profileId).run();
    await env.DB.prepare('DELETE FROM evidence_notes WHERE user_email = ?').bind(profileId).run();
    await env.DB.prepare('DELETE FROM weekly_logs WHERE user_email = ?').bind(profileId).run();
    await env.DB.prepare('DELETE FROM pinned_competencies WHERE user_email = ?').bind(profileId).run();
    await env.DB.prepare('DELETE FROM snapshots WHERE user_email = ?').bind(profileId).run();
    await env.DB.prepare('DELETE FROM profiles WHERE id = ?').bind(profileId).run();
    return jsonResponse({ success: true, message: `Profile ${profileId} reset successfully` });
  } catch (err) {
    return jsonResponse(null, 500, { message: err.message });
  }
});

// Catch all
router.all('*', () => jsonResponse(null, 404, { message: 'Route not found' }));

export default {
  fetch: (request, env, ctx) => router.fetch(request, env, ctx).catch(err => jsonResponse(null, 500, { message: err.message }))
};
