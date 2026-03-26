"use client";

import { useState } from "react";

export function ConfigForm({ initial }: { initial: { trustedDomains: string; blockedDomains: string; likelyTrueThreshold: number; misleadingThreshold: number; autoSaveArticles: boolean; } }) {
  const [state, setState] = useState(initial);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function save() {
    setMessage("");
    setError("");
    const res = await fetch("/api/admin/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state)
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Unable to save settings.");
      return;
    }
    setMessage("Settings saved.");
  }

  return (
    <div className="space-y-4 rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
      <div>
        <label className="mb-2 block text-sm text-slate-300">Trusted domains</label>
        <textarea value={state.trustedDomains} onChange={(e) => setState({ ...state, trustedDomains: e.target.value })} className="min-h-28 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" />
      </div>
      <div>
        <label className="mb-2 block text-sm text-slate-300">Blocked domains</label>
        <textarea value={state.blockedDomains} onChange={(e) => setState({ ...state, blockedDomains: e.target.value })} className="min-h-24 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-slate-300">Likely true threshold</label>
          <input type="number" min="0" max="1" step="0.01" value={state.likelyTrueThreshold} onChange={(e) => setState({ ...state, likelyTrueThreshold: Number(e.target.value) })} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" />
        </div>
        <div>
          <label className="mb-2 block text-sm text-slate-300">Misleading threshold</label>
          <input type="number" min="0" max="1" step="0.01" value={state.misleadingThreshold} onChange={(e) => setState({ ...state, misleadingThreshold: Number(e.target.value) })} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" />
        </div>
      </div>
      <label className="flex items-center gap-3 text-sm text-slate-300">
        <input type="checkbox" checked={state.autoSaveArticles} onChange={(e) => setState({ ...state, autoSaveArticles: e.target.checked })} />
        Auto-save analyzed articles
      </label>
      {message ? <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">{message}</div> : null}
      {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div> : null}
      <button onClick={save} className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white">Save settings</button>
    </div>
  );
}
