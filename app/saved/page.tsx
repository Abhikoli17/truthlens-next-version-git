import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const articles = await prisma.articleRecord.findMany({
    orderBy: { updatedAt: "desc" },
    take: 50
  });

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black">Saved analyses</h1>
            <p className="mt-2 text-slate-400">Latest records stored in the database.</p>
          </div>
          <Link href="/" className="rounded-2xl border border-slate-700 px-4 py-2 text-sm">Back to home</Link>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900">
          <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
            <thead className="bg-slate-950/70 text-slate-300">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Verdict</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Claim</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {articles.map((article) => (
                <tr key={article.id}>
                  <td className="px-4 py-3"><a href={article.url} target="_blank" rel="noreferrer" className="underline">{article.title}</a></td>
                  <td className="px-4 py-3 text-slate-300">{article.sourceName}</td>
                  <td className="px-4 py-3 text-slate-200">{article.verdict.replaceAll("_", " ")}</td>
                  <td className="px-4 py-3">{Math.round(article.credibilityScore * 100)}%</td>
                  <td className="px-4 py-3 text-slate-300">{article.extractedClaim || "—"}</td>
                </tr>
              ))}
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">No saved records yet. Analyze some stories from the homepage.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
