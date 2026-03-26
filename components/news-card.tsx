import { ArticleAnalysis, NewsArticle } from "@/lib/types";
import { VerdictBadge } from "@/components/verdict-badge";
import { formatDate } from "@/lib/utils";

export function NewsCard({ article, analysis }: { article: NewsArticle; analysis?: ArticleAnalysis }) {
  return (
    <article className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5 shadow-2xl shadow-black/20">
      {article.urlToImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={article.urlToImage} alt={article.title} className="mb-4 h-48 w-full rounded-2xl object-cover" />
      ) : (
        <div className="mb-4 flex h-48 items-center justify-center rounded-2xl bg-slate-800 text-slate-500">No image</div>
      )}

      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400">{article.source.name}</p>
        <VerdictBadge verdict={analysis?.verdict} />
      </div>

      <h2 className="mb-3 text-xl font-bold leading-7">{article.title}</h2>
      <p className="mb-4 text-sm leading-6 text-slate-300">{article.description || "No description available."}</p>

      {analysis ? (
        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
          <div>Confidence: <span className="font-semibold text-white">{Math.round(analysis.score * 100)}%</span></div>
          <div>Claim: <span className="text-slate-100">{analysis.extractedClaim}</span></div>
          <div>{analysis.reason}</div>
          <div>Corroboration sources: <span className="text-slate-100">{analysis.corroborationCount}</span></div>
          {analysis.factCheckRating ? <div>Fact-check rating: <span className="text-amber-300">{analysis.factCheckRating}</span></div> : null}
          {analysis.factCheckUrl ? (
            <a href={analysis.factCheckUrl} target="_blank" rel="noreferrer" className="inline-flex text-blue-300 underline">
              Open matched fact-check
            </a>
          ) : null}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">Analyzing story...</div>
      )}

      <div className="mt-4 flex items-center justify-between gap-4 text-sm text-slate-400">
        <span>{formatDate(article.publishedAt)}</span>
        <a href={article.url} target="_blank" rel="noreferrer" className="font-semibold text-blue-300 underline">Read article</a>
      </div>
    </article>
  );
}
