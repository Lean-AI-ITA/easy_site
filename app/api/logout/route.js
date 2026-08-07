import { COOKIE } from "../../../lib/auth";
export const runtime = "nodejs";
export async function POST() {
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: {
    "Content-Type": "application/json",
    "Set-Cookie": `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
  }});
}
export async function GET() {
  return new Response(null, { status: 302, headers: {
    Location: "/login",
    "Set-Cookie": `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
  }});
}
