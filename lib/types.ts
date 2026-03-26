export type NewsArticle = {
  source: { id: string | null; name: string };
  author?: string | null;
  title: string;
  description?: string | null;
  url: string;
  urlToImage?: string | null;
  publishedAt: string;
  content?: string | null;
};

export type ArticleAnalysis = {
  score: number;
  verdict: "LIKELY_TRUE" | "NEEDS_VERIFICATION" | "LIKELY_MISLEADING";
  reason: string;
  extractedClaim: string;
  corroborationCount: number;
  matchedDomains: string[];
  factCheckTitle?: string | null;
  factCheckUrl?: string | null;
  factCheckRating?: string | null;
};

export type DashboardSummary = {
  totalSaved: number;
  likelyTrue: number;
  needsVerification: number;
  likelyMisleading: number;
  recentFeedback: number;
};
