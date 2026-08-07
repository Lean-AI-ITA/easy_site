"use client";

import { useEffect, useRef, useState } from "react";

function md(t) {
  t = t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/((?:^\|.*\|$\n?)+)/gm, (block) => {
    const rows = block.trim().split("\n").filter((r) => r.trim());
    if (rows.length < 2) return block;
    let html = "<table>";
    rows.forEach((r, i) => {
      if (/^\|[\s:\-|]+\|$/.test(r)) return;
      const cells = r.split("|").slice(1, -1);
      const tag = i === 0 ? "th" : "td";
      html += "<tr>" + cells.map((c) => `<${tag}>${c.trim()}</${tag}>`).join("") + "</tr>";
    });
    return html + "</table>";
  });
  t = t.replace(/(?:^[-•*] .*(?:\n|$))+/gm, (block) => {
    const items = block.trim().split("\n").map((l) => l.replace(/^[-•*]\s?/, ""));
    return "<ul>" + items.map((i) => `<li>${i}</li>`).join("") + "</ul>";
  });
  t = t.split(/\n{2,}/).map((p) => (/^<(ul|table|ol)/.test(p.trim()) ? p : `<p>${p.replace(/\n/g, "<br>")}</p>`)).join("");
  return t;
}

const SUGG = [
  { q: "Quanto pago se ho 30 clienti micro e 10 grandi?", label: "Esempio di preventivo" },
  { q: "Cosa include il canone base?", label: "Cosa c'è nel prezzo" },
  { q: "Quali adempimenti normativi deve fare la software house?", label: "Adempimenti" },
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showSugg, setShowSugg] = useState(true);
  const [msgs, setMsgs] = useState([]);
  const [draft, setDraft] = useState("");
  const msgsRef = useRef(null);
  const taRef = useRef(null);

  const scrollBottom = () => { const el = msgsRef.current; if (el) el.scrollTop = el.scrollHeight; };
  useEffect(() => { scrollBottom(); }, [msgs]);
  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([{ role: "assistant", content: "Ciao! Sono l'assistente del dossier **EasyChef × Caterline**. Posso spiegarti prezzi, requisiti software, segmenti, adempimenti e simulare un preventivo. Cosa ti serve?" }]);
    }
    if (open) setTimeout(() => taRef.current?.focus(), 100);
  }, [open]);

  async function send(text) {
    const q = (text ?? draft).trim();
    if (!q || busy) return;
    setDraft(""); setShowSugg(false);
    if (taRef.current) taRef.current.style.height = "auto";
    const history = [...msgs, { role: "user", content: q }];
    setMsgs([...history, { role: "assistant", content: "" }]);
    setBusy(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history }) });
      if (!res.ok || !res.body) {
        // Mostra il MESSAGGIO REALE dell'errore (con dettaglio da OpenRouter)
        const err = await res.json().catch(() => ({}));
        const full = "⚠️ " + (err.error || "Errore di rete.") + (err.detail ? "\n\n**Dettaglio:** `" + err.detail + "`" : "");
        setMsgs((m) => { const c = [...m]; c[c.length - 1] = { role: "assistant", content: full }; return c; });
        setBusy(false); return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMsgs((m) => { const c = [...m]; c[c.length - 1] = { role: "assistant", content: acc }; return c; });
      }
    } catch (e) {
      setMsgs((m) => { const c = [...m]; c[c.length - 1] = { role: "assistant", content: "⚠️ Non riesco a contattare il servizio. Verifica il deploy di /api/chat.\n\n`" + String(e).slice(0, 200) + "`" }; return c; });
    } finally { setBusy(false); taRef.current?.focus(); }
  }

  function onKey(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }
  function autosize(e) { e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px"; setDraft(e.target.value); }

  return (
    <>
      <button id="ec-fab" title="Assistente EasyChef" onClick={() => setOpen((o) => !o)}>{open ? "✕" : "💬"}</button>
      {open && (
        <div id="ec-chat" role="dialog" aria-label="Assistente EasyChef">
          <div id="ec-head">
            <div>
              <div className="t">🍽️ Assistente EasyChef</div>
              <div className="s">Chiedimi del dossier, prezzi, adempimenti…</div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Chiudi">✕</button>
          </div>
          <div id="ec-msgs" ref={msgsRef}>
            {msgs.map((m, i) => {
              const last = i === msgs.length - 1;
              const showCursor = m.role === "assistant" && busy && last;
              return (
                <div key={i} className={"ec-m " + (m.role === "user" ? "u" : "a")}>
                  <div className="b" dangerouslySetInnerHTML={{ __html: m.role === "assistant" ? md(m.content) + (showCursor ? '<span class="ec-cursor"></span>' : "") : m.content.replace(/</g, "&lt;") }} />
                </div>
              );
            })}
          </div>
          {showSugg && (
            <div className="ec-sugg">
              {SUGG.map((s, i) => (<button key={i} onClick={() => send(s.q)}>{s.label}</button>))}
            </div>
          )}
          <div id="ec-input">
            <textarea ref={taRef} rows={1} placeholder="Scrivi una domanda…" value={draft} onChange={autosize} onKeyDown={onKey} />
            <button id="ec-send" onClick={() => send()} disabled={busy}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}
