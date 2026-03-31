import { NextResponse } from "next/server";
import { analyzeArticle } from "@/lib/scoring";
import { prisma } from "@/lib/prisma";

function extractDomain(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "unknown";
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await analyzeArticle({
      title: body.title,
      description: body.description,
      sourceDomain: extractDomain(body.url),
      corroborationCount: body.corroborationCount || 1,
    });

    await prisma.articleRecord.upsert({
      where: { url: body.url },
      update: {
        title: body.title,
        description: body.description ?? null,
        imageUrl: body.urlToImage ?? null,
        sourceName: body.source?.name ?? "Unknown",
        sourceDomain: extractDomain(body.url),
        category: body.category ?? null,
        country: body.country ?? null,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
        verdict: result.verdict,
        credibilityScore: result.score,
        reason: result.reason ?? null,
        extractedClaim: result.extractedClaim ?? null,
        corroborationCount: body.corroborationCount || 1,
        factCheckTitle: result.factCheckTitle ?? null,
        factCheckUrl: result.factCheckUrl ?? null,
        factCheckRating: result.factCheckRating ?? null,
      },
      create: {
        url: body.url,
        title: body.title,
        description: body.description ?? null,
        imageUrl: body.urlToImage ?? null,
        sourceName: body.source?.name ?? "Unknown",
        sourceDomain: extractDomain(body.url),
        category: body.category ?? null,
        country: body.country ?? null,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
        verdict: result.verdict,
        credibilityScore: result.score,
        reason: result.reason ?? null,
        extractedClaim: result.extractedClaim ?? null,
        corroborationCount: body.corroborationCount || 1,
        factCheckTitle: result.factCheckTitle ?? null,
        factCheckUrl: result.factCheckUrl ?? null,
        factCheckRating: result.factCheckRating ?? null,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("ANALYZE_ROUTE_ERROR:", error);

    return NextResponse.json(
      {
        error: "Analysis failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}