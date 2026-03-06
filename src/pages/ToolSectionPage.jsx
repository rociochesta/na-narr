// src/pages/ToolSectionPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header3PM from "../components/Header3PM.jsx";
import BottomNav from "../components/BottomNav.jsx";

const GROUP_LABELS = {
  "start-here": "Start here",
  "body-first": "Body-first",
};

export default function ToolSectionPage() {
  const { sectionId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [section, setSection] = useState(null);
  const [tools, setTools] = useState([]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `/.netlify/functions/get-toolbox-section?slug=${encodeURIComponent(sectionId)}`
        );

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`get-toolbox-section failed: ${res.status} – ${txt}`);
        }

        const json = await res.json();
        if (ignore) return;

        setSection(json.section ?? null);
        setTools(Array.isArray(json.tools) ? json.tools : []);
      } catch (e) {
        console.error(e);
        if (!ignore) {
          setError(e.message || "Could not load section");
          setSection(null);
          setTools([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => { ignore = true; };
  }, [sectionId]);

  // Group tools by groupLabel, preserving sort order
  const grouped = useMemo(() => {
    const map = new Map();
    const order = [];

    for (const t of tools) {
      const key = t.groupLabel || "__ungrouped__";
      if (!map.has(key)) {
        map.set(key, []);
        order.push(key);
      }
      map.get(key).push(t);
    }

    return order.map((key) => ({
      key,
      label: GROUP_LABELS[key] || (key === "__ungrouped__" ? "All tools" : key),
      tools: map.get(key),
    }));
  }, [tools]);

  function ToolCard({ t }) {
    const showTone = t.groupLabel === "start-here";
    return (
      <button
        type="button"
        onClick={() => navigate(`/tools/${sectionId}/${t.slug}`)}
        className="text-left rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 hover:border-cyan-400/60 hover:bg-slate-900 transition-colors"
      >
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-slate-100">{t.title}</p>
          {t.estimatedSeconds ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 whitespace-nowrap">
              {Math.max(1, Math.ceil(t.estimatedSeconds / 60))} min
            </span>
          ) : null}
        </div>

        {t.subtitle ? (
          <p className="text-[11px] text-slate-400 mt-1">{t.subtitle}</p>
        ) : null}

        {showTone && t.toneLine ? (
          <p className="text-[11px] text-cyan-300 italic mt-2 border-l border-cyan-400/20 pl-2">
            {t.toneLine}
          </p>
        ) : null}
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col pb-16">
      <Header3PM showMenu />

      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-6 space-y-5">
          <button
            type="button"
            onClick={() => navigate("/tools")}
            className="text-[11px] text-slate-400 underline underline-offset-2 hover:text-cyan-300"
          >
            ← Back to Toolbox
          </button>

          {loading ? (
            <p className="text-[11px] text-slate-500 italic">Loading…</p>
          ) : error ? (
            <div className="rounded-2xl border border-rose-900/40 bg-rose-950/20 px-4 py-3">
              <p className="text-sm text-rose-300">Couldn't load this section.</p>
              <p className="text-[11px] text-rose-200/70 mt-1">{error}</p>
            </div>
          ) : !section ? (
            <p className="text-sm text-rose-400">Section not found.</p>
          ) : (
            <>
              {/* Section header */}
              <section className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-4">
                <h1 className="text-lg font-semibold tracking-tight">
                  {section.title}
                </h1>
                {section.description ? (
                  <p className="text-[12px] text-slate-300 mt-1">
                    {section.description}
                  </p>
                ) : null}
                {section.badge ? (
                  <p className="text-[11px] text-slate-500 mt-2">
                    {section.badge}
                  </p>
                ) : null}
              </section>

              {/* Tool groups */}
              {grouped.map(({ key, label, tools: list }) => (
                <section key={key} className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                    {label}
                  </p>
                  <div className="grid gap-2">
                    {list.map((t) => (
                      <ToolCard key={t.id} t={t} />
                    ))}
                  </div>
                </section>
              ))}
            </>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}