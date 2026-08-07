import { COOKIE, tokenFor } from "../../../lib/auth";
export const runtime = "nodejs";
export async function POST(req) {
  const pass = process.env.SITE_PASSWORD;
  if (!pass) return json({ ok: true, disabled: true });
  let body = {}; try { body = await req.json(); } catch {}
  const input = typeof body?.password === "string" ? body.password : "";
  if (input !== pass) return json({ ok: false, error: "Password errata." }, 401);
  const token = await tokenFor(pass);
  const secure = process.env.NODE_ENV === "production" ? " Secure;" : "";
  const maxAge = 60 * 60 * 24 * 30;
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: {
    "Content-Type": "application/json",
    "Set-Cookie": `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax;${secure} Max-Age=${maxAge}`,
  }});
}
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}
