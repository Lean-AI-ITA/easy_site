// Base di conoscenza del bot. È l'UNICA fonte di verità: se un dato non è qui,
// il bot deve dichiararlo e non inventare.

export const KNOWLEDGE = `
# EASYCHEF × CATERLINE — BASE DI CONOSCENZA

## CHI È CATERLINE
Distributore di forniture alimentari per ristorazione collettiva/commerciale/pastry. ~70 anni,
400+ collaboratori, 130 mezzi, ~160 M€ fatturato, 4 magazzini a temperatura, 9.000 clienti attivi,
130+ agenti specializzati, 475.000 ordini/anno, 10.000+ referenze. Canali ordini: telefono, agenti,
EDI, e-commerce, app. Servizi Dedicati agenti: (1) analizzare/valutare il costo pasto; (2) consigliare
prodotti alternativi costo/qualità; (3) confezionamenti eco e monodosi per diete speciali. Caterline Academy (formazione).

## COS'È EASYCHEF (Akinai)
SaaS per ristorazione collettiva e centri cottura. Core venduto: ORDINARE via Caterline + GESTIRE MAGAZZINO.
Moduli opzionali: Documenti/HACCP, Prenotazione Pasti omnicanale, Food Cost AI, orchestratore "Easy Chef Leader".
Claim: -12% costo pasto medio (da validare). Posizionamento: non "un gestionale", ma l'infrastruttura dati
che rende i 130 agenti Caterline consulenti data-driven, aumenta gli ordini e fidelizza i 9.000 clienti.

# PREVENTIVATORE (MODELLO ATTUALE: PRODOTTO UNICO)
Si vende a TUTTI un solo prodotto "Ordini Caterline + Gestione Magazzino". Prezzo scala col VOLUME:
1) FASCIA di pasti/giorno -> canone base mensile WHOLESALE (quello che Caterline paga a NOI).
2) N. STRUTTURE servite -> +35 €/mese per ogni struttura OLTRE LA PRIMA.
Prezzi MENSILI. Caterline aggiunge markup 35% per il prezzo al cliente finale (retail).
Fasce e base wholesale/mese: Micro (<100) 120 · Piccolo (100-300) 200 · Medio (300-800) 350 ·
Grande (800-2.000) 550 · XL (>2.000) 800.
Regola: Prezzo a noi = [Base fascia + (N.strutture-1) × 35] − sconto volume; Prezzo cliente = a noi × 1,35.
Sconto volume sul totale clienti: 0% <20, 5% ≥20, 8% ≥50, 10% ≥80. Setup 150 €/cliente. Giorni/anno 365.
Scenario 80 clienti (20/28/16/6/... strutture 1/1/2/4/8): ricavo nostro ~19.000 €/mese (~228k/anno);
media ~238 €/cliente/mese; €/pasto da ~0,10 (micro) a ~0,014 (XL).
Guida campi: "Pasti/giorno" = pasti medi/gg del cliente della fascia (driver). "N. strutture" = media sedi
PER SINGOLO cliente (+35/mese oltre la prima). "N. clienti" = QUI i numeri di Caterline; ATTENZIONE:
"10 strutture piccole" da Caterline = 10 CLIENTI di fascia piccola. "Base/mese" = listino wholesale, non si tocca.

# ANALISI PRICING SUITE COMPLETA (RICERCA, diversa dal prodotto unico)
Listino moduli/anno retail: Documenti 650 · Prenotazione 550 · Food Cost 600 · Leader AI 900.
Variabile/fascia/anno retail: Micro 2.900 · Piccolo 5.950 · Medio 11.550 · Grande 19.600 · XL 30.000+.
Totali: Micro ~4.100 · Piccolo ~7.750 · Medio ~14.050 · Grande ~23.100 · XL ~31.200+.
Sconto canale a Caterline 25-35% (VAR). Scenari su 80 clienti (ricavo netto/anno): Conservativo 20 cl ~45.500;
Atteso 40 cl ~182.000; Ambizioso 60 cl ~378.000. 500 € è troppo basso per l'intera suite (ok solo modulo micro).
Mercato ISTAT 2024: 12.987 strutture, 425.780 posti letto, media ~32,8; 43,4% <50 posti; 76% privati.
Competitor (8 IT, solo Modular pubblica prezzi: attivazione 600+IVA, semestrale 60+IVA): Gestfood, Ristocloud,
RistoFlex, Meal Manager, E.trace/E.meal (Nova), Desy (Netpolaris, solo con cartella "The.0"), Web RSA, Modular.
Benchmark USA: MarginEdge 350$/mese/location; Dietary Manager Online 375$/mese; CBORD ~500$/mese; Toast 0-69$/mese.
ROI: costo giornata alimentare RSA 9,54 €/gg (UNEBA); -12% AI = 0,30-0,65 €/pasto ≈ 33.000-71.000 €/anno su RSA 100 posti.

# SPECIFICHE SOFTWARE (~40 REQUISITI, 6 AREE) — MoSCoW: M/S/C/W
3 esigenze non negoziabili: tracciabilità HACCP lotto->pasto (Reg. CE 178/2002 art.18, 852/2004 art.5);
allergeni Reg. UE 1169/2011 (14, output stampabile); diete doppio binario (certificazione medica vs autocertificazione).
ORDINI: ORD-01 Catalogo Caterline(M); 02 Ordini ricorrenti(M); 03 Carrello multi-sede(S); 04 Budget/tetto(M);
05 Sostituzioni suggerite(S); 06 Integrazione multicanale(M); 07 Lotti minimi(S); 08 Aggancio panieri CAM(S); 09 Storico ordini agente(M).
MAGAZZINO: MAG-01 Carico/scarico(M); 02 Lotti/scadenze FEFO(M); 03 Tracciabilità HACCP(M); 04 Temperature celle(M);
05 Riordino automatico(S); 06 Resi/non conformità(S); 07 Inventari(C); 08 KPI sprechi(S); 09 Separazione vitto/sopravvitto(S, carceri).
MENU&DIETE: MENU-01 Menu ciclici(S); 02 Ricettario grammature(M); 03 14 allergeni(M); 04 Diete certificazione medica IDDSI(M);
05 Diete autocertificazione(M); 06 Calendario liturgico(C); 07 Validazione LARN(S); 08 Esplosione fabbisogni->ordine(M);
09 Vassoio paziente(S); 10 Contenuti Academy(C).
COSTO PASTO: COST-01 Teorico(M); 02 Reale vs teorico(S); 03 What-if(S); 04 Benchmark listini(C); 05 Cruscotto agente(S);
06 Alert risparmio(S); 07 Prezzi base d'asta(S).
PA/COMPLIANCE: PA-01 Capitolato/paniere(S); 02 Rendicontazione CAM DM 65/2020(M); 03 Report pasti/diete(M);
04 Audit trail(S); 05 Dati sanitari GDPR art.9(M); 06 Flussi L.136/2010(C); 07 FVOE/BDNCP(W); 08 Tabelle vittuarie carceri(C).
REPORTISTICA: REP-01 Cruscotto multi-cliente agente(M); 02 Alert unificato(S); 03 Export Academy(C); 04 Report white-label(S); 05 Cross-sell(C).
Primo rilascio (core): ORD 01,02,04,06,09 · MAG 01,02,03,04 · MENU 02,03,08 · COST-01 · PA 02,03,05 · REP-01. Il canone base copre i Must.

# 7 SEGMENTI
1) Socio-sanitario (RSA/cliniche/coop): disfagia 40-60% IDDSI 0-7; GDPR art.9. 2) Ospedale/ASL: diete cliniche,
vassoio-paziente-letto, appalto D.Lgs.36/2023 art.130. 3) Scuola: allergeni+LARN, rendicontazione mensile Comune,
allergie certificato vs etico-religiose autocert. 4) Aziendale: buoni pasto art.131. 5) Militare: MOS vs catering,
appalto COMMISERVIZI (NON AID), anti-frode. 6) Carcere: 41-bis vieta farina/lievito, vitto+sopravvitto (separazione,
conflitto Corte dei Conti), appalto PRAP/DAP. 7) Religiosi: calendario liturgico, no capitolato pubblico, donazioni.

# COSA IL SOFTWARE NON DEVE FARE
Non vincolare l'ordine solo al catalogo Caterline (concorrenza appalti); non decidere diete senza supervisione medica;
non esporre dati di un cliente ad altri (benchmark solo anonimizzato); non legare l'appalto pubblico all'uso del software;
non disintermediare l'agente.

# ADEMPIMENTI DELLA SOFTWARE HOUSE (Akinai)
Semaforo: diretto / condizionato / indiretto / buona prassi.
- GDPR (Reg. UE 2016/679) DIRETTO: DPA art.28 con Caterline e clienti; dati sanitari art.9; DPIA; misure art.32; data breach 33-34. Max 20M€/4%.
- NIS2 (D.Lgs.138/2024) CONDIZIONATO(size-cap)+INDIRETTO: PMI di solito non soggetto diretto, ma clienti sanità/alimentare ribaltano requisiti supply chain. Scadenza 31/10/2026 (Det. ACN 379907/2025 dal 15/1/2026).
- Cyber Resilience Act (Reg. UE 2024/2847) DIRETTO: secure-by-design, SBOM, gestione vulnerabilità, marcatura CE. Scadenze: 11/6/2026 (Capo IV), 11/9/2026 (art.14 segnalazione ENISA), 11/12/2027 (piena applicazione). Max 15M€/2,5%.
- AI Act (Reg. UE 2024/1689) CONDIZIONATO (moduli AI): trasparenza art.50 dal 2/8/2026 (chatbot deve dichiararsi AI, output identificabili); Akinai = fornitore. Max 35M€/7%.
- Product Liability (Dir. UE 2024/2853) DIRETTO dal recepimento IT 9/12/2026: software/IA=prodotto, responsabilità oggettiva; polizza + disclaimer "supporto decisionale".
- Accessibilità EAA (D.Lgs.82/2022) CONDIZIONATO: dal 28/6/2025 per servizi consumer/e-commerce; escluse microimprese; WCAG; per PA Legge Stanca. Max 5% fatturato.
- Vendita alla PA: qualificazione cloud ACN (dati in Italia, ISO 27001), MePA/CONSIP, DURC, PAD/BDNCP/PDND. NON serve se si vende solo a Caterline per RSA private; serve per clienti pubblici (ASL, scuole, carceri).
- ISO 27001 (+27017/27018) BUONA PRASSI, spesso richiesta in gara.
Checklist adesso: DPA art.28, DPIA, processo segnalazione vulnerabilità, etichettatura output AI. 6 mesi: SBOM, questionario sicurezza fornitore, polizza product liability, verifica NIS2. 12 mesi: ISO 27001, accessibilità WCAG, qualificazione cloud ACN, roadmap CRA 2027.
Nota: citazioni normative da verificare sui testi primari (normattiva.it/eur-lex/GU) prima di un uso legale vincolante.
`;
