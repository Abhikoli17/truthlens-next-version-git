"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FilterBar } from "@/components/filter-bar";
import { NewsCard } from "@/components/news-card";
import { ArticleAnalysis, NewsArticle } from "@/lib/types";

const defaultCountry = process.env.NEXT_PUBLIC_DEFAULT_COUNTRY || "in";
const defaultCategory = process.env.NEXT_PUBLIC_DEFAULT_CATEGORY || "general";

export default function HomePage() {
  const [country, setCountry] = useState(defaultCountry);
  const [category, setCategory] = useState(defaultCategory);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [analysisMap, setAnalysisMap] = useState<Record<string, ArticleAnalysis>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runAnalysis = useCallback(async (items: NewsArticle[]) => {
    await Promise.all(
      items.slice(0, 12).map(async (article) => {
        try {
          const res = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...article, category, country })
          });
          const data = await res.json();
          if (res.ok) {
            setAnalysisMap((prev) => ({ ...prev, [article.url]: data as ArticleAnalysis }));
          }
        } catch {
          // Leave partial results if one request fails.
        }
      })
    );
  }, [category, country]);

  const loadNews = useCallback(async () => {
    setLoading(true);
    setError("");
    setAnalysisMap({});

    try {
      const res = await fetch(`/api/news?category=${category}&country=${country}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to fetch news.");
      }
      const items = (data.articles || []) as NewsArticle[];
      setArticles(items);
      await runAnalysis(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [category, country, runAnalysis]);

  useEffect(() => {
    void loadNews();
  }, [loadNews]);

  const summary = useMemo(() => {
    const values = Object.values(analysisMap);
    return {
      trueCount: values.filter((item) => item.verdict === "LIKELY_TRUE").length,
      verifyCount: values.filter((item) => item.verdict === "NEEDS_VERIFICATION").length,
      misleadingCount: values.filter((item) => item.verdict === "LIKELY_MISLEADING").length
    };
  }, [analysisMap]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 md:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-6 shadow-2xl shadow-black/30">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
              TruthLens V2
            </span>
            <a href="/saved" className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-200">Saved analyses</a>
            <a href="/admin" className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-200">Admin</a>
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight md:text-6xl">Live news + explainable verification</h1>
          <p className="max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
            This upgraded version adds saved article records, a simple admin panel, feedback collection, and AI-assisted claim extraction.
          </p>
        </section>

        <FilterBar
          category={category}
          country={country}
          onCategoryChange={setCategory}
          onCountryChange={setCountry}
          onRefresh={() => void loadNews()}
          loading={loading}
        />

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5">
            <div className="text-sm text-emerald-200">Likely True</div>
            <div className="mt-2 text-3xl font-bold">{summary.trueCount}</div>
          </div>
          <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5">
            <div className="text-sm text-amber-200">Needs Verification</div>
            <div className="mt-2 text-3xl font-bold">{summary.verifyCount}</div>
          </div>
          <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-5">
            <div className="text-sm text-rose-200">Likely Misleading</div>
            <div className="mt-2 text-3xl font-bold">{summary.misleadingCount}</div>
          </div>
        </section>

        {error ? <div className="mb-6 rounded-3xl border border-rose-500/30 bg-rose-500/10 p-5 text-rose-200">{error}</div> : null}

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <NewsCard key={article.url} article={article} analysis={analysisMap[article.url]} />
          ))}
        </section>
      </div>
    </main>
  );
}
