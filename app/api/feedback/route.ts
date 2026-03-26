import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  articleUrl: z.string().url(),
  feedback: z.enum(["correct", "wrong", "unclear"]),
  note: z.string().max(500).optional()
});

export async function POST(req: NextRequest) {
  try {
    const data = schema.parse(await req.json());
    const saved = await prisma.verificationFeedback.create({ data });
    return NextResponse.json({ ok: true, id: saved.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save feedback.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
