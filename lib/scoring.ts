import { extractClaim } from "@/lib/claimExtraction";
import { searchFactChecks } from "@/lib/factcheck";
import { getSourceScore } from "@/lib/sourceReputation";

export type Verdict = "LIKELY_TRUE" | "NEEDS_VERIFICATION" | "LIKELY_MISLEADING";

function normalizeRating(rating?: string) {
  return (rating || "").toLowerCase();
}

function hasNegativeRating(rating?: string) {
  const value = normalizeRating(rating);
  return ["false", "misleading", "incorrect", "fake", "mostly false", "partly false", "pants on fire"].some((item) => value.includes(item));
}

function hasPositiveRating(rating?: string) {
  const value = normalizeRating(rating);
  return ["true", "correct", "accurate", "mostly true"].some((item) => value.includes(item));
}

function sensationalismPenalty(text: string) {
  const lower = text.toLowerCase();
  const triggers = ["shocking", "must see", "they don't want you to know", "100% proof", "miracle", "exposed", "guaranteed"];
  const hits = triggers.filter((item) => lower.includes(item)).length;
  return Math.min(hits * 0.08, 0.24);
}

export async function analyzeArticle(input: {
  title: string;
  description?: string | null;
  content?: string | null;
  sourceDomain?: string | null;
  corroborationCount?: number;
  matchedDomains?: string[];
  thresholds?: { likelyTrueThreshold?: number; misleadingThreshold?: number };
}) {
  const text = `${input.title} ${input.description || ""} ${input.content || ""}`.trim();
  const sourceScore = getSourceScore(input.sourceDomain);
  const corroboration = Math.min((input.corroborationCount || 1) / 10, 1);
  const extractedClaim = await extractClaim({ title: input.title, description: input.description, content: input.content });

  let score = 0.35 * sourceScore + 0.35 * corroboration + 0.2;
  score -= sensationalismPenalty(text);

  const factChecks = await searchFactChecks(extractedClaim || input.title);
  const review = factChecks?.[0]?.claimReview?.[0];
  const rating = review?.textualRating;

  const likelyTrueThreshold = input.thresholds?.likelyTrueThreshold ?? 0.72;
  const misleadingThreshold = input.thresholds?.misleadingThreshold ?? 0.42;

  let verdict: Verdict = "NEEDS_VERIFICATION";
  let reason = "There is some evidence, but not enough to confidently verify the claim yet.";

  if (hasNegativeRating(rating)) {
    score -= 0.45;
    verdict = "LIKELY_MISLEADING";
    reason = `A matching fact-check review reported a negative rating: ${rating}.`;
  } else if (hasPositiveRating(rating)) {
    score += 0.2;
    verdict = "LIKELY_TRUE";
    reason = `A matching fact-check review supported the claim with rating: ${rating}.`;
  } else if (score >= likelyTrueThreshold) {
    verdict = "LIKELY_TRUE";
    reason = "The story is published by stronger sources and appears corroborated across multiple domains.";
  } else if (score <= misleadingThreshold) {
    verdict = "LIKELY_MISLEADING";
    reason = "The story has weaker sourcing, thin corroboration, or sensational language.";
  }

  score = Math.max(0, Math.min(1, score));

  return {
    score,
    verdict,
    reason,
    extractedClaim,
    corroborationCount: input.corroborationCount || 1,
    matchedDomains: input.matchedDomains || [],
    factCheckTitle: review?.title || null,
    factCheckUrl: review?.url || null,
    factCheckRating: rating || null
  };
}
