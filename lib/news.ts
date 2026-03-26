import { NewsArticle } from "@/lib/types";

async function fetchJson(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "News API request failed.");
  }
  return data;
}

export async function fetchTopHeadlines(category = "general", country = "in") {
  const key = process.env.NEWS_API_KEY;
  if (!key) throw new Error("NEWS_API_KEY is missing.");

  const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&pageSize=24&apiKey=${key}`;
  const data = await fetchJson(url);
  return (data.articles || []) as NewsArticle[];
}

export async function searchEverything(query: string) {
  const key = process.env.NEWS_API_KEY;
  if (!key) throw new Error("NEWS_API_KEY is missing.");

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=24&language=en&apiKey=${key}`;
  const data = await fetchJson(url);
  return (data.articles || []) as NewsArticle[];
}
