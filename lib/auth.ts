import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

const COOKIE_NAME = "truthlens_admin";

function secretKey() {
  const value = process.env.JWT_SECRET || "development-secret-change-me";
  return new TextEncoder().encode(value);
}

export async function createAdminToken(email: string) {
  return await new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}

export async function verifyAdminToken(token: string) {
  const { payload } = await jwtVerify(token, secretKey());
  return payload;
}

export async function getAdminSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const payload = await verifyAdminToken(token);
    return { email: String(payload.email || "") };
  } catch {
    return null;
  }
}

export const adminCookieName = COOKIE_NAME;
