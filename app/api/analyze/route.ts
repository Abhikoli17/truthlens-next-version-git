import { NextRequest, NextResponse } from "next/server";
import { searchEverything } from "@/lib/news";
import { analyzeArticle } from "@/lib/scoring";
import { extractDomain } from "@/lib/utils";
import { getAppConfig } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const title = String(body.title || "").trim();
    if (!title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }

    const description = typeof body.description === "string" ? body.description : "";
    const content = typeof body.content === "string" ? body.content : "";
    const url = typeof body.url === "string" ? body.url : "";
    const category = typeof body.category === "string" ? body.category : null;
    const country = typeof body.country === "string" ? body.country : null;

    const [similarStories, config] = await Promise.all([
      searchEverything(title),
      getAppConfig()
    ]);

    const matchedDomains = Array.from(new Set(similarStories
      .map((item) => extractDomain(item.url))
      .filter((domain) => domain !== "unknown")
      .filter((domain) => !config.blockedDomains.split(",").map((s) => s.trim()).filter(Boolean).includes(domain))
    ));

    const analysis = await analyzeArticle({
      title,
      description,
      content,
      sourceDomain: extractDomain(url),
      corroborationCount: matchedDomains.length || 1,
      matchedDomains,
      thresholds: {
        likelyTrueThreshold: config.likelyTrueThreshold,
        misleadingThreshold: config.misleadingThreshold
      }
    });

    if (config.autoSaveArticles && url) {
      await prisma.articleRecord.upsert({
        where: { url },
        update: {
          title,
          description,
          sourceName: body.source?.name || "Unknown source",
          sourceDomain: extractDomain(url),
          imageUrl: body.urlToImage || null,
          category,
          country,
          publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
          verdict: analysis.verdict,
          credibilityScore: analysis.score,
          reason: analysis.reason,
          extractedClaim: analysis.extractedClaim,
          corroborationCount: analysis.corroborationCount,
          factCheckTitle: analysis.factCheckTitle,
          factCheckUrl: analysis.factCheckUrl,
          factCheckRating: analysis.factCheckRating
        },
        create: {
          title,
          description,
          url,
          imageUrl: body.urlToImage || null,
          sourceName: body.source?.name || "Unknown source",
          sourceDomain: extractDomain(url),
          category,
          country,
          publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
          verdict: analysis.verdict,
          credibilityScore: analysis.score,
          reason: analysis.reason,
          extractedClaim: analysis.extractedClaim,
          corroborationCount: analysis.corroborationCount,
          factCheckTitle: analysis.factCheckTitle,
          factCheckUrl: analysis.factCheckUrl,
          factCheckRating: analysis.factCheckRating
        }
      });
    }

    return NextResponse.json(analysis);
  } catch (error) {
  console.error("ANALYZE_ROUTE_ERROR:", error);
  return NextResponse.json(
    {
      error: "Analysis failed",
      details: error instanceof Error ? error.message : "Unknown error",
    },
    { status: 500 }
  );
}
