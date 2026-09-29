import { useEffect, useState } from 'react';

export default function useToolExercise(section, slug) {
  const [state, setState] = useState({ loading: true, error: '', tool: null, steps: [] });
  useEffect(() => {
    const controller = new AbortController();
    setState({ loading: true, error: '', tool: null, steps: [] });
    async function load() {
      try {
        const res = await fetch(`/.netlify/functions/get-toolbox-tool?section=${encodeURIComponent(section)}&slug=${encodeURIComponent(slug)}`, { signal: controller.signal });
        if (!res.ok) throw new Error(res.status === 404 ? 'Tool not found.' : 'Could not load this exercise. Please try again.');
        const data = await res.json();
        if (!data.tool || !Array.isArray(data.steps)) throw new Error('Invalid exercise response.');
        if (!controller.signal.aborted) setState({ ...data, loading: false, error: '' });
      } catch (error) {
        if (!controller.signal.aborted) setState({ loading: false, error: error.message, tool: null, steps: [] });
      }
    }
    load();
    return () => controller.abort();
  }, [section, slug]);
  return state;
}
