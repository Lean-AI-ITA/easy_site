"use client";

import { useMemo, useState } from "react";
import { CFG as CFG0, SCENARIO, eur, compute } from "../lib/pricing";

export default function Preventivatore() {
  const [cfg, setCfg] = useState(() => JSON.parse(JSON.stringify(CFG0)));
  const [distr, setDistr] = useState(() => JSON.parse(JSON.stringify(SCENARIO)));
  const [vista, setVista] = useState("mese");

  const r = useMemo(() => compute(cfg, distr), [cfg, distr]);
  const mult = vista === "mese" ? 1 : 12;
  const sfx = vista === "mese" ? "/mese" : "/anno";

  const setRow = (i, k, v) => setDistr((d) => d.map((row, idx) => (idx === i ? { ...row, [k]: +v || 0 } : row)));
  const setBase = (id, v) => setCfg((c) => ({ ...c, fasce: c.fasce.map((f) => (f.id === id ? { ...f, baseMese: +v || 0 } : f)) }));
  const setParam = (k, v) => setCfg((c) => ({ ...c, [k]: v }));
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="calc">
      <div>
        <div className="card">
          <h3><span className="pill-ic pi-rosso">1</span> Portafoglio clienti Caterline</h3>
          <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 10 }}>
            Metti in <b>N. clienti</b> quanti clienti hai in ogni fascia (i numeri che ti passa Caterline).
            <b> N. strutture</b> = media di sedi per singolo cliente.
          </p>
          {distr.map((row, i) => {
            const f = cfg.fasce.find((x) => x.id === row.id);
            const rr = r.righe[i];
            return (
              <div className="segrow" key={row.id}>
                <div className="top">
                  <b>{f.nome}</b>
                  <span className="mini">a noi <b>{eur(rr.whole * mult)}{sfx}</b> · €/pasto {rr.cpp.toFixed(3)}</span>
                </div>
                <div className="fields">
                  <div><label>Pasti/giorno</label><input type="number" value={row.pasti} onChange={(e) => setRow(i, "pasti", e.target.value)} /></div>
                  <div><label>N. strutture</label><input type="number" value={row.strut} onChange={(e) => setRow(i, "strut", e.target.value)} /></div>
                  <div><label>N. clienti</label><input type="number" value={row.clienti} onChange={(e) => setRow(i, "clienti", e.target.value)} /></div>
                  <div><label>Base/mese</label><input type="number" value={f.baseMese} onChange={(e) => setBase(row.id, e.target.value)} /></div>
                </div>
              </div>
            );
          })}
          <p className="hint">Multi-sito: ogni struttura oltre la prima aggiunge € {cfg.costoStrutturaExtra}/mese.</p>
        </div>
        <details className="params card">
          <summary>⚙️ Parametri di listino</summary>
          <div className="pgrid">
            {cfg.fasce.map((f) => (
              <div key={f.id} style={{ display: "contents" }}>
                <span>{f.nome}</span>
                <input type="number" value={f.baseMese} onChange={(e) => setBase(f.id, e.target.value)} />
              </div>
            ))}
          </div>
          <div className="pgrid" style={{ marginTop: 12 }}>
            <span>Sovrapprezzo / struttura extra (mese)</span>
            <input type="number" value={cfg.costoStrutturaExtra} onChange={(e) => setParam("costoStrutturaExtra", +e.target.value || 0)} />
            <span>Markup Caterline sul cliente (%)</span>
            <input type="number" value={Math.round(cfg.markupCaterline * 100)} onChange={(e) => setParam("markupCaterline", (+e.target.value || 0) / 100)} />
            <span>Setup una-tantum / cliente</span>
            <input type="number" value={cfg.setup} onChange={(e) => setParam("setup", +e.target.value || 0)} />
            <span>Giorni di servizio / anno</span>
            <input type="number" value={cfg.giorni} onChange={(e) => setParam("giorni", +e.target.value || 365)} />
          </div>
          <p className="hint" style={{ marginTop: 8 }}>Sconto volume automatico sul wholesale: 0% &lt;20 · 5% ≥20 · 8% ≥50 · 10% ≥80 clienti.</p>
        </details>
      </div>
      <div>
        <div className="card">
          <h3><span className="pill-ic pi-rosso">📈</span> Risultato · i nostri ricavi</h3>
          <div className="toggle" style={{ marginBottom: 14 }}>
            <button className={vista === "mese" ? "on" : ""} onClick={() => setVista("mese")}>Mensile</button>
            <button className={vista === "anno" ? "on" : ""} onClick={() => setVista("anno")}>Annuale</button>
          </div>
          <div className="kpi">
            <div className="kbox primary"><div className="k">Ricavo NOSTRO {sfx}</div><div className="v">{eur(r.ricavo * mult)}</div></div>
            <div className="kbox"><div className="k">Medio / cliente {sfx}</div><div className="v">{eur(r.medio * mult)}</div></div>
            <div className="kbox"><div className="k">Clienti totali</div><div className="v">{r.nTot}</div></div>
            <div className="kbox"><div className="k">Sconto volume</div><div className="v">{Math.round(r.sv * 100)}%</div></div>
          </div>
          <table style={{ fontSize: 13 }}>
            <tbody>
              <tr><td>Fatturato Caterline verso i clienti {sfx}</td><td className="num">{eur(r.fatt * mult)}</td></tr>
              <tr><td>Margine Caterline {sfx}</td><td className="num">{eur(r.margine * mult)}</td></tr>
              <tr><td>Setup una-tantum totale (anno 1)</td><td className="num">{eur(r.setupTot)}</td></tr>
            </tbody>
          </table>
        </div>
        <div className="card">
          <h3><span className="pill-ic pi-blu">📋</span> Dettaglio per fascia</h3>
          <div className="tbl-wrap" style={{ boxShadow: "none", border: "none" }}>
            <table style={{ fontSize: 12 }}>
              <thead><tr><th>Fascia</th><th className="num">N.</th><th className="num">A noi{sfx}</th><th className="num">Cliente{sfx}</th><th className="num">€/pasto</th><th className="num">Nostro{sfx}</th></tr></thead>
              <tbody>
                {r.righe.map((x) => (
                  <tr key={x.id}>
                    <td>{cap(x.id)}</td>
                    <td className="num">{x.clienti}</td>
                    <td className="num">{eur(x.whole * mult)}</td>
                    <td className="num">{eur(x.retail * mult)}</td>
                    <td className="num">{x.cpp.toFixed(3)}</td>
                    <td className="num">{eur(x.nostro * mult)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="hint" style={{ marginTop: 8 }}>"A noi" = quanto Caterline paga a noi (dopo sconto volume). "Cliente" = retail (a noi + markup). "€/pasto" = costo per pasto per la struttura.</p>
        </div>
      </div>
    </div>
  );
}
