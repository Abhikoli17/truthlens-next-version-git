export type FactCheckResult = {
  text?: string;
  claimant?: string;
  claimReview?: Array<{
    publisher?: { name?: string; site?: string };
    url?: string;
    title?: string;
    reviewDate?: string;
    textualRating?: string;
  }>;
};

export async function searchFactChecks(query: string): Promise<FactCheckResult[]> {
  const key = process.env.GOOGLE_FACTCHECK_API_KEY;
  if (!key) return [];

  const url = `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodeURIComponent(query)}&languageCode=en&key=${key}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];

  const data = await res.json();
  return data.claims || [];
}
