# EasyChef × Caterline — App (Next.js)

App Next.js (App Router) del dossier operativo: sviluppo software, preventivatore, analisi di mercato
e **sezione Adempimenti software**, con **assistente AI in streaming**. Responsive, pronta per Vercel.

## 🔐 Chiave OpenRouter
Va SOLO nelle Environment Variables di Vercel, mai nel codice. Se una chiave è stata esposta,
revocala e generane una nuova su openrouter.ai → Keys, con limite di spesa.

## Struttura
```
app/
  layout.js · page.js · globals.css
  api/chat/route.js      # chat STREAMING verso OpenRouter (key nascosta)
  api/login/route.js     # login (imposta cookie)
  api/logout/route.js    # logout
  login/page.js          # pagina password + pulsante "Vai al preventivatore"
  preventivo/page.js     # PAGINA PUBBLICA del preventivatore (senza password)
components/  Dossier.js · Chatbot.js · Preventivatore.js · PrintButton.js
lib/         dossierBody.js · initDossier.js · knowledge.js · pricing.js · auth.js
middleware.js            # protegge tutto tranne /login, /preventivo, /api/*
```

## 🚀 Deploy su Vercel (via GitHub)
1. Carica la cartella su GitHub (NON `node_modules`).
2. Vercel → Add New → Project → Import. Framework: Next.js.
3. Settings → Environment Variables (vedi sotto).
4. Deploy. Ogni push successivo ri-deploya.

## Variabili d'ambiente (Vercel → Settings → Environment Variables)
| Nome | Obbligatoria? | Valore |
|---|---|---|
| `OPENROUTER_API_KEY` | Sì (per la chat) | la tua NUOVA chiave OpenRouter |
| `SITE_PASSWORD` | Sì (per proteggere il dossier) | la password del dossier |
| `OPENROUTER_MODEL` | No | `google/gemini-2.0-flash-001` (default) |
| `SITE_URL` | No | l'URL del progetto Vercel |

- Se NON imposti `SITE_PASSWORD`, il dossier è pubblico (nessun login).
- `/preventivo` è SEMPRE pubblico, anche con password attiva.

## Sviluppo locale
```bash
npm install
# .env.local con OPENROUTER_API_KEY=... e SITE_PASSWORD=...
npm run dev
```

## Novità di questa versione
- Nuova sezione **⚖️ Adempimenti software** nel menu (compliance della software house).
- Pagina pubblica **/preventivo** condivisibile.
- **Login** con pulsante "Vai al preventivatore" ben visibile.
- Chat in **streaming**; responsive con menu ☰ su mobile.
