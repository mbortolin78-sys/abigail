// server/ollama_bridge.js
// MENTE UNIFICATA DI ABIGAIL – Metodo Marika
// Legge la domanda grezza, la riscrive in modo naturale, sceglie il comando corretto
// e prepara il pacchetto per il motore dei calcoli. Nessuna invenzione, nessuna fusione.

const moment = require("moment-timezone");

// Configurazioni base
const TZ = process.env.ABIGAIL_TZ || "Europe/Rome";
const DEFAULT_PLACE = process.env.ABIGAIL_PLACE || "Montebelluna (TV, Italia)";

// Elenco ufficiale comandi per mappa modello
const MAP_MODEL = {
  RAE: "Auroria",
  RAS: "Auroria",
  REE: "Echo",
  RES: "Echo",
  RVE: "Velaria",
  RVS: "Velaria",
  REteriaE: "Eteria",
  REteriaS: "Eteria",
  RVC: "Venere",
  RVA: "Venere",
  RVV: "Venere",
  RVEteria: "Venere",
  Identikit: "Venere",
};

// Parole chiave per il riconoscimento
const KW = {
  // Auroria: sentimentale diretto
  auroria_profondo: [
    "cosa prova", "cosa sente", "sentimento", "relazione", "allontanato",
    "perché si è allontanato", "che intenzioni ha con me"
  ],
  auroria_breve: [
    "mi scriverà", "si farà sentire", "mi chiamerà", "tornerà", "messaggio",
    "contatto", "quando si farà sentire"
  ],

  // Echo: riflesso e percezione
  echo_riflesso: [
    "cosa pensa", "intenzioni", "atteggiamento", "come mi percepisce",
    "come mi vede", "che idea ha di me"
  ],
  echo_spirituale_breve: [
    "percezioni", "intuizioni", "stato interiore", "sentire interiore"
  ],

  // Velaria: decisione ed esito pratico 360
  velaria_esteso: [
    "cosa deciderà", "quale decisione", "quale direzione", "esito del progetto",
    "sviluppo", "scelta", "quale azione farà", "risultato concreto"
  ],
  velaria_breve: [
    "accetterà", "rifiuterà", "mi richiameranno", "mi sceglierà", "esito breve"
  ],

  // Eteria: processo, compito, destino verso sé e gli altri
  eteria_esteso: [
    "cosa sta elaborando", "cosa sta orchestrando", "compito", "missione",
    "destino", "origine", "scopo"
  ],
  eteria_breve: [
    "fase che sta vivendo", "movimento in atto", "assetto del percorso"
  ],

  // Venere: identità relazionale superiore
  venere_rva: [
    "che legame c'è", "natura del nostro rapporto", "cosa rappresentiamo",
    "come si muove il sentimento tra noi", "che relazione c'è tra noi",
    "il nostro rapporto"
  ],
  venere_rvc: [
    "compatibilità", "tema della relazione", "tema natale di coppia",
    "quadro completo della relazione"
  ],
  venere_rveteria: [
    "connessione d'anima", "anima gemella", "legame karmico", "vite precedenti",
    "legame di destino"
  ],
  venere_rvv: [
    "rapporto pubblico", "immagine sociale", "come veniamo visti",
    "visibilità", "riconoscimento", "ufficiale"
  ],
  venere_identikit: [
    "chi è", "identikit", "profilo", "che tipo di persona è", "descrivimi soggetto"
  ],
};

// Utilità
function includesAny(text, list) {
  return list.some(k => text.includes(k));
}

function normalizeQuestion(q = "") {
  // Riscrittura naturale, pulita, senza tecnicismi
  let s = q.trim();
  // Capitalizza e chiudi con punto interrogativo se manca
  if (!s.endsWith("?")) s += "?";
  s = s.charAt(0).toUpperCase() + s.slice(1);
  // Piccole normalizzazioni frequenti
  s = s.replace(/\s+/g, " ");
  return s;
}

// Classificatore principale
function classify(textRaw) {
  const t = (textRaw || "").toLowerCase().trim();

  // ——— VENERE ———
  if (includesAny(t, KW.venere_identikit)) return "Identikit";
  if (includesAny(t, KW.venere_rva))       return "RVA";
  if (includesAny(t, KW.venere_rvc))       return "RVC";
  if (includesAny(t, KW.venere_rveteria))  return "RVEteria";
  if (includesAny(t, KW.venere_rvv))       return "RVV";

  // ——— AURORIA ———
  if (includesAny(t, KW.auroria_profondo)) return "RAE";
  if (includesAny(t, KW.auroria_breve))    return "RAS";

  // ——— ECHO ———
  if (includesAny(t, KW.echo_riflesso))          return "REE";
  if (includesAny(t, KW.echo_spirituale_breve))  return "RES";

  // ——— VELARIA ———
  if (includesAny(t, KW.velaria_esteso)) return "RVE";
  if (includesAny(t, KW.velaria_breve))  return "RVS";

  // ——— ETERIA ———
  if (includesAny(t, KW.eteria_esteso)) return "REteriaE";
  if (includesAny(t, KW.eteria_breve))  return "REteriaS";

  return null;
}

// Funzione pubblica
function analyzeQuestion({ text, override = {} }) {
  // Data, ora, luogo automatici con TZ Europe/Rome
  const now = moment().tz(TZ);
  const data = override.date
    ? moment(override.date).tz(TZ).format("DD/MM/YYYY")
    : now.format("DD/MM/YYYY");
  const ora = override.time || now.format("HH:mm");
  const luogo = override.place || DEFAULT_PLACE;

  // Classificazione comando
  const command = classify(text);
  if (!command) {
    return {
      status: "ask",
      message: "Specifica meglio. Vuoi leggere il legame tra voi, un pensiero, una decisione pratica, oppure la direzione del suo percorso?"
    };
  }

  // Mappa modello
  const modello = MAP_MODEL[command] || "Venere";

  // Riscrittura domanda in linguaggio naturale
  const domanda_riscritta = normalizeQuestion(text);

  return {
    status: "ok",
    modello,
    command,
    data,
    ora,
    luogo,
    domanda_riscritta,
  };
}

module.exports = { analyzeQuestion };
