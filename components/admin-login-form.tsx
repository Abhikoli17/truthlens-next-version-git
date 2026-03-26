"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
      <div>
        <label className="mb-2 block text-sm text-slate-300">Admin email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" />
      </div>
      <div>
        <label className="mb-2 block text-sm text-slate-300">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3" />
      </div>
      {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div> : null}
      <button disabled={loading} className="w-full rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-50">
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
