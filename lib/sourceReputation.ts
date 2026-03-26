export const sourceReputation: Record<string, number> = {
  "reuters.com": 0.96,
  "apnews.com": 0.95,
  "bbc.com": 0.93,
  "thehindu.com": 0.89,
  "indianexpress.com": 0.87,
  "ndtv.com": 0.8,
  "theguardian.com": 0.88,
  "aljazeera.com": 0.81,
  "timesofindia.indiatimes.com": 0.73,
  "cnn.com": 0.78,
  "foxnews.com": 0.67,
  "unknown": 0.45
};

export function getSourceScore(domain?: string | null) {
  if (!domain) return 0.45;
  return sourceReputation[domain] ?? 0.5;
}
