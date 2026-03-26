export function extractDomain(url?: string | null) {
  if (!url) return "unknown";
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "unknown";
  }
}

export function formatDate(date: string) {
  try {
    return new Date(date).toLocaleString();
  } catch {
    return date;
  }
}

export function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
