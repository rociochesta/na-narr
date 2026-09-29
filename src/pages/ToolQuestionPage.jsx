import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import useToolExercise from '../hooks/useToolExercise.js';
import ToolExerciseLayout from '../components/ToolExerciseLayout.jsx';

export default function ToolQuestionPage() {
  const { sectionId, toolSlug, step } = useParams();
  const { steps, loading, error } = useToolExercise(sectionId, toolSlug);
  const index = Number(step) - 1;
  if (loading || error) return <ToolExerciseLayout><p role={error ? 'alert' : undefined}>{error || 'Loading step…'}</p></ToolExerciseLayout>;
  if (!/^\d+$/.test(step || '') || !Number.isSafeInteger(index) || !steps[index]) return <Navigate to={`/tools/${sectionId}/${toolSlug}`} replace />;
  return <ExerciseStep key={`${sectionId}/${toolSlug}/${steps[index].id}`} q={steps[index]} index={index} total={steps.length} sectionId={sectionId} toolSlug={toolSlug} />;
}

function ExerciseStep({ q, index, total, sectionId, toolSlug }) {
  const navigate = useNavigate();
  const base = `/tools/${sectionId}/${toolSlug}`;
  const storageKey = `na_toolrun_${sectionId}_${toolSlug}`;
  const [value, setValue] = useState(() => {
    try { const draft = JSON.parse(localStorage.getItem(storageKey) || '{}'); return typeof draft?.[q.key] === 'string' ? draft[q.key] : ''; } catch { return ''; }
  });
  const [remaining, setRemaining] = useState(q.durationSeconds || 0);
  const [running, setRunning] = useState(false);
  const [saveError, setSaveError] = useState('');
  useEffect(() => {
    if (!running || remaining <= 0) return;
    const timer = setTimeout(() => setRemaining(n => Math.max(0, n - 1)), 1000);
    return () => clearTimeout(timer);
  }, [running, remaining]);
  function update(next) {
    setValue(next);
    try {
      const raw = JSON.parse(localStorage.getItem(storageKey) || '{}');
      const draft = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
      localStorage.setItem(storageKey, JSON.stringify({ ...draft, [q.key]: next, updatedAt: new Date().toISOString() }));
      setSaveError('');
    } catch { setSaveError('Your answer could not be saved on this device.'); }
  }
  const supported = ['question', 'instruction', 'timer'].includes(q.type);
  const canContinue = supported && (!q.required || (q.type === 'question' ? value.trim().length > 0 : q.type === 'timer' ? remaining === 0 : true));
  function next() {
    if (!canContinue) return;
    if (index + 1 === total) navigate(base, { state: { completedTool: `${sectionId}/${toolSlug}` } });
    else navigate(`${base}/${index + 2}`);
  }
  return <ToolExerciseLayout>
    <p className="text-xs uppercase tracking-widest">Step {index + 1} of {total}</p>
    <section className="border rounded-2xl p-4 space-y-4">
      <h1 id="step-title" className="text-lg font-semibold">{q.title}</h1>
      {q.hint && <p className="text-sm">{q.hint}</p>}
      {q.body && <p className="whitespace-pre-wrap">{q.body}</p>}
      {q.type === 'question' && <>
        <textarea aria-labelledby="step-title" rows={4} value={value} onChange={e => update(e.target.value)} placeholder={q.placeholder || ''} className="w-full rounded-xl border border-[var(--dash-6f5630)] bg-[var(--dash-0b0c0f)] p-3" />
        <button onClick={() => update('I don’t know.')} className="text-xs underline">I don’t know</button>
      </>}
      {q.type === 'timer' && <div className="space-y-2">
        <p role="timer" className="text-3xl">{remaining}s</p>
        <button disabled={!remaining} onClick={() => setRunning(v => !v)} className="border rounded-xl p-2">{remaining === 0 ? 'Done' : running ? 'Pause' : 'Start timer'}</button>
      </div>}
      {!supported && <p role="alert">This step type is not supported yet.</p>}
      {saveError && <p role="alert">{saveError}</p>}
    </section>
    <div className="flex gap-3">
      <button onClick={() => navigate(index === 0 ? base : `${base}/${index}`)} className="flex-1 border rounded-xl p-3">Back</button>
      <button disabled={!canContinue} onClick={next} className="flex-1 border rounded-xl p-3 disabled:opacity-40 text-[var(--dash-c6a56b)]">{index + 1 === total ? 'Finish' : 'Continue'}</button>
    </div>
  </ToolExerciseLayout>;
}
