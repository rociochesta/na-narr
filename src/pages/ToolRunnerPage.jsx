import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useToolExercise from '../hooks/useToolExercise.js';
import ToolExerciseLayout from '../components/ToolExerciseLayout.jsx';

export default function ToolRunnerPage() {
  const { sectionId, toolSlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { tool, steps, loading, error } = useToolExercise(sectionId, toolSlug);
  const finished = location.state?.completedTool === `${sectionId}/${toolSlug}`;
  function start(fresh = false) {
    if (fresh) {
      try { localStorage.removeItem(`na_toolrun_${sectionId}_${toolSlug}`); } catch { /* Storage unavailable. */ }
    }
    navigate(`/tools/${sectionId}/${toolSlug}/1`);
  }
  return <ToolExerciseLayout>
    <button onClick={() => navigate(`/tools/${sectionId}`)} className="text-sm underline">← Back to tools</button>
    {loading ? <p>Loading exercise…</p> : error ? <p role="alert">{error}</p> : tool && <>
      <section className="space-y-2">
        <h1 className="text-xl font-semibold">{tool.title}</h1>
        {tool.subtitle && <p>{tool.subtitle}</p>}
        {tool.estimatedSeconds > 0 && <p className="text-xs">Takes about {Math.max(1, Math.ceil(tool.estimatedSeconds / 60))} min</p>}
        {tool.toneLine && <p className="italic text-[var(--dash-c6a56b)]">{tool.toneLine}</p>}
      </section>
      <section className="border rounded-2xl p-4 space-y-4">
        {!steps.length ? <p>This exercise isn’t available yet. Its guided steps haven’t been added.</p> : finished ? <>
          <h2 className="font-semibold">Exercise complete</h2>
          <p>{tool.completionText || 'You made time for yourself. Take your next step when you’re ready.'}</p>
          <button onClick={() => start(true)} className="border rounded-xl p-3 w-full">Start fresh</button>
        </> : <>
          <p>{tool.introText || 'Take this exercise one step at a time.'}</p>
          <p className="text-xs">{steps.length} steps</p>
          <button onClick={() => start()} className="border rounded-xl p-3 w-full text-[var(--dash-c6a56b)]">Let’s do this</button>
        </>}
      </section>
    </>}
  </ToolExerciseLayout>;
}
