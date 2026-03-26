import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ConfigForm } from "@/components/config-form";
import { getAppConfig } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [config, articles, feedback] = await Promise.all([
    getAppConfig(),
    prisma.articleRecord.findMany({ orderBy: { updatedAt: "desc" }, take: 10 }),
    prisma.verificationFeedback.findMany({ orderBy: { createdAt: "desc" }, take: 10 })
  ]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">Signed in as {session.email}</p>
            <h1 className="text-4xl font-black">Admin dashboard</h1>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="rounded-2xl border border-slate-700 px-4 py-2 text-sm">Home</Link>
            <form action="/api/admin/logout" method="post">
              <button className="rounded-2xl bg-slate-800 px-4 py-2 text-sm">Logout</button>
            </form>
          </div>
        </div>

        <section className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5"><div className="text-sm text-slate-400">Saved articles</div><div className="mt-2 text-3xl font-bold">{await prisma.articleRecord.count()}</div></div>
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5"><div className="text-sm text-slate-400">Likely true</div><div className="mt-2 text-3xl font-bold">{await prisma.articleRecord.count({ where: { verdict: "LIKELY_TRUE" } })}</div></div>
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5"><div className="text-sm text-slate-400">Needs verification</div><div className="mt-2 text-3xl font-bold">{await prisma.articleRecord.count({ where: { verdict: "NEEDS_VERIFICATION" } })}</div></div>
          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5"><div className="text-sm text-slate-400">Feedback items</div><div className="mt-2 text-3xl font-bold">{await prisma.verificationFeedback.count()}</div></div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <ConfigForm initial={{
            trustedDomains: config.trustedDomains,
            blockedDomains: config.blockedDomains,
            likelyTrueThreshold: config.likelyTrueThreshold,
            misleadingThreshold: config.misleadingThreshold,
            autoSaveArticles: config.autoSaveArticles
          }} />

          <div className="space-y-6">
            <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
              <h2 className="mb-4 text-2xl font-bold">Recent feedback</h2>
              <div className="space-y-3">
                {feedback.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <div className="text-sm text-slate-400">{item.feedback}</div>
                    <div className="mt-2 break-all text-sm text-slate-200">{item.articleUrl}</div>
                    {item.note ? <div className="mt-2 text-sm text-slate-300">{item.note}</div> : null}
                  </div>
                ))}
                {feedback.length === 0 ? <p className="text-slate-400">No feedback yet.</p> : null}
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
              <h2 className="mb-4 text-2xl font-bold">Latest saved stories</h2>
              <div className="space-y-3">
                {articles.map((article) => (
                  <div key={article.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <div className="font-semibold">{article.title}</div>
                    <div className="mt-1 text-sm text-slate-400">{article.sourceName} • {Math.round(article.credibilityScore * 100)}%</div>
                    <div className="mt-2 text-sm text-slate-300">{article.verdict.replaceAll("_", " ")}</div>
                  </div>
                ))}
                {articles.length === 0 ? <p className="text-slate-400">No saved stories yet.</p> : null}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
