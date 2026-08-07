import { NextResponse } from "next/server";
import { COOKIE, tokenFor } from "./lib/auth";
const PUBLIC = ["/login", "/preventivo", "/api/login", "/api/logout"];
export async function middleware(req) {
  const pass = process.env.SITE_PASSWORD;
  if (!pass) return NextResponse.next();
  const { pathname } = req.nextUrl;
  if (PUBLIC.some((p) => pathname === p || pathname.startsWith(p + "/"))) return NextResponse.next();
  const cookie = req.cookies.get(COOKIE)?.value;
  const expected = await tokenFor(pass);
  if (cookie && cookie === expected) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}
export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
