export const CFG = {
  fasce: [
    { id: "micro",  nome: "Micro (< 100 pasti/gg)",       baseMese: 120 },
    { id: "small",  nome: "Piccolo (100–300 pasti/gg)",   baseMese: 200 },
    { id: "medium", nome: "Medio (300–800 pasti/gg)",     baseMese: 350 },
    { id: "large",  nome: "Grande (800–2.000 pasti/gg)",  baseMese: 550 },
    { id: "xl",     nome: "XL (> 2.000 pasti/gg)",        baseMese: 800 },
  ],
  costoStrutturaExtra: 35, markupCaterline: 0.35, setup: 150, giorni: 365,
  scontoVolume: [{ min: 0, s: 0 }, { min: 20, s: 0.05 }, { min: 50, s: 0.08 }, { min: 80, s: 0.10 }],
};
export const SCENARIO = [
  { id: "micro",  pasti: 70,   strut: 1, clienti: 20 },
  { id: "small",  pasti: 200,  strut: 1, clienti: 28 },
  { id: "medium", pasti: 550,  strut: 2, clienti: 16 },
  { id: "large",  pasti: 1400, strut: 4, clienti: 6 },
  { id: "xl",     pasti: 3000, strut: 8, clienti: 4 },
];
export function eur(n) { return "€ " + Math.round(n || 0).toLocaleString("it-IT"); }
export function scVol(cfg, n) { let f = 0; cfg.scontoVolume.forEach((x) => { if (n >= x.min) f = x.s; }); return f; }
export function baseOf(cfg, id) { const f = cfg.fasce.find((x) => x.id === id); return f ? f.baseMese : 0; }
export function compute(cfg, distr) {
  const nTot = distr.reduce((a, r) => a + (+r.clienti || 0), 0);
  const sv = scVol(cfg, nTot);
  let ricavo = 0, fatt = 0, setupTot = 0;
  const righe = distr.map((r) => {
    const base = baseOf(cfg, r.id);
    const extra = (Math.max(1, r.strut) - 1) * cfg.costoStrutturaExtra;
    const whole = (base + extra) * (1 - sv);
    const retail = whole * (1 + cfg.markupCaterline);
    const pastiAnno = r.pasti * cfg.giorni;
    const cpp = pastiAnno > 0 ? (retail * 12) / pastiAnno : 0;
    ricavo += whole * r.clienti; fatt += retail * r.clienti; setupTot += cfg.setup * r.clienti;
    return { ...r, whole, retail, cpp, nostro: whole * r.clienti };
  });
  return { righe, nTot, sv, ricavo, fatt, setupTot, margine: fatt - ricavo, medio: nTot > 0 ? ricavo / nTot : 0 };
}
