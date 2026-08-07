"use client";

// app/login/page.js — logo EasyChef incorporato (base64), non dipende da /public.
import { useState } from "react";
import { LOGO } from "../../lib/assets";

export default function LoginPage() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const res = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
      const data = await res.json();
      if (data.ok) {
        const next = new URLSearchParams(window.location.search).get("next") || "/";
        window.location.href = next;
      } else { setErr(data.error || "Accesso negato."); }
    } catch { setErr("Errore di rete. Riprova."); } finally { setBusy(false); }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(120deg,#0B4C8C,#083A6B)", padding: 20 }}>
      <form onSubmit={submit} style={{ background: "#fff", borderRadius: 16, padding: "32px 28px", width: "100%", maxWidth: 380, boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}>
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <img src={LOGO} alt="EasyChef" style={{ width: 130, height: "auto" }} />
          <div style={{ fontWeight: 700, fontSize: 15, color: "#6B7280", marginTop: -6 }}>× Caterline</div>
        </div>
        <p style={{ color: "#6B7280", fontSize: 13.5, margin: "0 0 20px", textAlign: "center" }}>Dossier riservato. Inserisci la password per accedere.</p>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#1A1F2B", display: "block", marginBottom: 6 }}>Password</label>
        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus placeholder="••••••••"
          style={{ width: "100%", padding: "11px 13px", border: "1px solid #E4E7EC", borderRadius: 10, fontSize: 15, marginBottom: 14, boxSizing: "border-box" }} />
        {err && (<div style={{ background: "#FDECED", color: "#9C0C16", border: "1px solid #F3C2C6", borderRadius: 8, padding: "8px 11px", fontSize: 13, marginBottom: 14 }}>⚠️ {err}</div>)}
        <button type="submit" disabled={busy || !pw}
          style={{ width: "100%", background: "#C40F1C", color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 15, fontWeight: 700, cursor: busy || !pw ? "not-allowed" : "pointer", opacity: busy || !pw ? 0.6 : 1 }}>
          {busy ? "Verifica…" : "Entra"}
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0 14px" }}>
          <div style={{ flex: 1, height: 1, background: "#E4E7EC" }} />
          <span style={{ fontSize: 11, color: "#9CA3AF" }}>oppure, senza password</span>
          <div style={{ flex: 1, height: 1, background: "#E4E7EC" }} />
        </div>
        <a href="/preventivo"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", background: "#fff", color: "#0B4C8C", border: "1.5px solid #0B4C8C", borderRadius: 10, padding: "12px", fontSize: 14.5, fontWeight: 700, textDecoration: "none", boxSizing: "border-box" }}>
          🧮 Vai al preventivatore
        </a>
        <p style={{ color: "#9CA3AF", fontSize: 11.5, textAlign: "center", marginTop: 10, marginBottom: 0 }}>Il preventivatore è pubblico e non richiede accesso.</p>
      </form>
    </div>
  );
}
