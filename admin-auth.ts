import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "qt_admin";
const SESSION_SECONDS = 60 * 60 * 24 * 7;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export function adminConfigured() {
  return (process.env.ADMIN_PASSWORD || "").length >= 8;
}

export function checkPassword(input: string) {
  if (!adminConfigured()) return false;
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256")
    .update(process.env.ADMIN_PASSWORD as string)
    .digest();
  return timingSafeEqual(a, b);
}

export async function createSession() {
  const expires = Date.now() + SESSION_SECONDS * 1000;
  const store = await cookies();
  store.set(COOKIE_NAME, `${expires}.${sign(String(expires))}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAdmin() {
  if (!adminConfigured() || !secret()) return false;
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature) return false;
  const expected = sign(expires);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  return Number(expires) > Date.now();
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
