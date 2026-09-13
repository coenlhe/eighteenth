export const ADMIN_COOKIE_NAME = "admin_session";

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 1 week
};

export function checkAdminPassword(password: string): boolean {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword) return false;
  return password === expectedPassword;
}

export function createSessionToken(): string {
  const secret = process.env.SESSION_SECRET || "default_secret_key";
  return `session_${secret}`;
}

export function verifySessionToken(token: string): boolean {
  if (!token) return false;
  const secret = process.env.SESSION_SECRET || "default_secret_key";
  return token === `session_${secret}`;
}

import { cookies } from "next/headers";

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}