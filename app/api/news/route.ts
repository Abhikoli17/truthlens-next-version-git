import { NextRequest, NextResponse } from "next/server";
import { fetchTopHeadlines, searchEverything } from "@/lib/news";

export async function GET(req: NextRequest) {
  try {
    const category =
      req.nextUrl.searchParams.get("category") ||
      process.env.NEXT_PUBLIC_DEFAULT_CATEGORY ||
      "general";

    const country =
      req.nextUrl.searchParams.get("country") ||
      process.env.NEXT_PUBLIC_DEFAULT_COUNTRY ||
      "in";

    let articles = await fetchTopHeadlines(category, country);

    // Fallback 1: same country, general category
    if (!articles || articles.length === 0) {
      articles = await fetchTopHeadlines("general", country);
    }

    // Fallback 2: for India, use keyword search
    if ((!articles || articles.length === 0) && country === "in") {
      let query = "India news";

      if (category === "entertainment") {
        query = "Bollywood OR movie OR celebrity OR entertainment India";
      } else if (category === "business") {
        query = "India business OR economy OR market";
      } else if (category === "sports") {
        query = "India sports OR cricket OR football";
      } else if (category === "technology") {
        query = "India technology OR startup OR AI";
      } else if (category === "health") {
        query = "India health OR medical OR hospital";
      } else if (category === "science") {
        query = "India science OR space OR research";
      } else {
        query = "India breaking news";
      }

      articles = await searchEverything(query);
    }

    return NextResponse.json({ articles });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to fetch news.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}