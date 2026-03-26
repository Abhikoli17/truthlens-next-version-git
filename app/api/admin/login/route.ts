import { NextRequest, NextResponse } from "next/server";
import { createAdminToken, adminCookieName } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = String(body.email || "").trim();
  const password = String(body.password || "");

  const validEmail = process.env.ADMIN_EMAIL || "admin@truthlens.local";
  const validPassword = process.env.ADMIN_PASSWORD || "ChangeThisPassword123!";

  if (email !== validEmail || password != validPassword) {
    return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
  }

  const token = await createAdminToken(email);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(adminCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  return res;
}
