import { NextRequest, NextResponse } from "next/server";
import { fetchTopHeadlines } from "@/lib/news";

export async function GET(req: NextRequest) {
  try {
    const category = req.nextUrl.searchParams.get("category") || process.env.NEXT_PUBLIC_DEFAULT_CATEGORY || "general";
    const country = req.nextUrl.searchParams.get("country") || process.env.NEXT_PUBLIC_DEFAULT_COUNTRY || "in";
    const articles = await fetchTopHeadlines(category, country);
    return NextResponse.json({ articles });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch news.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
