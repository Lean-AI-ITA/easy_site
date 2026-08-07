export const COOKIE = "ec_auth";
export async function tokenFor(pw) {
  const data = new TextEncoder().encode("ec::" + (pw || ""));
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
