import { NextResponse } from "next/server";
import { adminCookieName } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.redirect(new URL("/admin/login", process.env.APP_URL || "http://localhost:3000"));
  res.cookies.set(adminCookieName, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
