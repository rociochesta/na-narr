// Change copy only: database IDs, eligibility and selection stay canonical.
export function themedGuidedTool(tool, rangerTools, theme) {
  if (!tool || theme !== "rangers") return tool;
  const copy = rangerTools.find((entry) =>
    entry.id === tool.id || (tool.slug && entry.id === tool.slug)
  );
  if (!copy) return tool;
  return {
    ...tool,
    title: copy.title ?? tool.title,
    how: copy.how ?? tool.how,
    why: copy.why ?? tool.why,
    punchlines: copy.punchlines ?? tool.punchlines,
  };
}
