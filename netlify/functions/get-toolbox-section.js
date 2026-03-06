// netlify/functions/get-toolbox-section.js
import { pool } from "./_db.js";

export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const slug = event.queryStringParameters?.slug;
  if (!slug) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing slug" }) };
  }

  try {
    const secRes = await pool.query(
      `
      SELECT id, slug, title, description, badge, icon
      FROM public.tool_sections
      WHERE slug = $1 AND is_active = true
      LIMIT 1;
      `,
      [slug]
    );

    const section = secRes.rows[0];
    if (!section) {
      return { statusCode: 404, body: JSON.stringify({ error: "Section not found" }) };
    }

    const toolsRes = await pool.query(
      `
      SELECT
        id, section_id, slug, title, subtitle, tone_line,
        estimated_seconds, kind, is_pinned, pinned_order,
        sort_order, is_active, group_label
      FROM public.tools
      WHERE section_id = $1 AND is_active = true
      ORDER BY
        sort_order ASC,
        title ASC;
      `,
      [section.id]
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        section: {
          id: section.id,
          slug: section.slug,
          title: section.title,
          description: section.description || "",
          badge: section.badge || "",
          icon: section.icon || null,
        },
        tools: toolsRes.rows.map((t) => ({
          id: t.id,
          sectionId: t.section_id,
          slug: t.slug,
          title: t.title,
          subtitle: t.subtitle || "",
          toneLine: t.tone_line || "",
          estimatedSeconds: t.estimated_seconds ?? null,
          kind: t.kind || "action",
          isPinned: t.is_pinned === true,
          pinnedOrder: t.pinned_order ?? null,
          sortOrder: t.sort_order ?? 0,
          groupLabel: t.group_label || null,
        })),
        groups: [],
        groupItems: [],
      }),
    };
  } catch (err) {
    console.error("get-toolbox-section error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error", details: err.message }),
    };
  }
};