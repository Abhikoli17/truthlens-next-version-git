import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAppConfig } from "@/lib/admin";
import { z } from "zod";

const schema = z.object({
  trustedDomains: z.string(),
  blockedDomains: z.string(),
  likelyTrueThreshold: z.number().min(0).max(1),
  misleadingThreshold: z.number().min(0).max(1),
  autoSaveArticles: z.boolean()
});

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = schema.parse(await req.json());
    const config = await getAppConfig();
    const updated = await prisma.appConfig.update({
      where: { id: config.id },
      data: body
    });
    return NextResponse.json({ ok: true, config: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save settings.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
