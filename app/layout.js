import "./globals.css";
export const metadata = {
  title: "EasyChef × Caterline — Dossier operativo",
  description: "Dossier interattivo: sviluppo software, preventivatore e analisi di mercato, con assistente AI.",
};
export const viewport = { width: "device-width", initialScale: 1, maximumScale: 5 };
export default function RootLayout({ children }) {
  return (<html lang="it"><body>{children}</body></html>);
}
