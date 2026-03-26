export function VerdictBadge({ verdict }: { verdict?: string }) {
  if (!verdict) {
    return <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">Analyzing</span>;
  }

  const styles = {
    LIKELY_TRUE: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
    NEEDS_VERIFICATION: "border-amber-500/30 bg-amber-500/10 text-amber-200",
    LIKELY_MISLEADING: "border-rose-500/30 bg-rose-500/10 text-rose-200"
  } as const;

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${styles[verdict as keyof typeof styles] || "border-slate-700 text-slate-300"}`}>
      {verdict.replaceAll("_", " ")}
    </span>
  );
}
