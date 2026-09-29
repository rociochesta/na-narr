import { pool } from './_db.js';

export const handler = async (event) => {
  const reply = (statusCode, data) => ({ statusCode, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify(data) });
  if (event.httpMethod !== 'GET') return reply(405, { error: 'Method not allowed' });
  const { slug, section } = event.queryStringParameters || {};
  if (!slug || !section) return reply(400, { error: 'Missing tool slug or section' });
  try {
    const result = await pool.query(`
      SELECT t.id, t.slug, t.title, t.subtitle, t.tone_line, t.estimated_seconds,
             t.intro_text, t.completion_text
      FROM public.tools t JOIN public.tool_sections s ON s.id = t.section_id
      WHERE t.slug = $1 AND s.slug = $2 AND t.is_active = true AND s.is_active = true
      LIMIT 1`, [slug, section]);
    const t = result.rows[0];
    if (!t) return reply(404, { error: 'Tool not found' });
    const steps = await pool.query(`
      SELECT id, step_key, sort_order, step_type, title, hint, body,
             placeholder, duration_seconds, is_required
      FROM public.tool_steps WHERE tool_id = $1 ORDER BY sort_order ASC`, [t.id]);
    return reply(200, {
      tool: { id: t.id, slug: t.slug, title: t.title, subtitle: t.subtitle,
        toneLine: t.tone_line, estimatedSeconds: t.estimated_seconds,
        introText: t.intro_text, completionText: t.completion_text },
      steps: steps.rows.map(s => ({ id: s.id, key: s.step_key, type: s.step_type,
        title: s.title, hint: s.hint, body: s.body, placeholder: s.placeholder,
        durationSeconds: s.duration_seconds, required: s.is_required }))
    });
  } catch (error) {
    console.error('get-toolbox-tool failed:', error);
    return reply(500, { error: 'Could not load this exercise' });
  }
};
