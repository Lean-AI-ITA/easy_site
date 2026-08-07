import Preventivatore from "../../components/Preventivatore";
import PrintButton from "../../components/PrintButton";

export const metadata = {
  title: "Preventivatore EasyChef · Caterline",
  description: "Simulatore prezzi EasyChef — prodotto unico Ordini + Magazzino via Caterline.",
};

export default function PreventivoPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div className="hero rosso" style={{ borderRadius: 0, marginBottom: 0 }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
          <div>
            <h1>Preventivatore EasyChef</h1>
            <p>Prodotto unico: <b>Ordini Caterline + Gestione Magazzino</b>. Inserisci il numero di clienti per fascia — il prezzo si calcola in tempo reale.</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <a href="/" className="print-btn" style={{ background: "rgba(255,255,255,.2)", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>← Dossier</a>
            <PrintButton />
          </div>
        </div>
      </div>
      <div className="wrap" style={{ maxWidth: 1140, margin: "0 auto" }}>
        <Preventivatore />
        <p style={{ textAlign: "center", color: "var(--muted)", fontSize: 12, marginTop: 20 }}>
          EasyChef × Caterline · EasyChef — pagina condivisibile del preventivatore
        </p>
      </div>
    </div>
  );
}
