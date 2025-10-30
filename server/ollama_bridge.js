// server/ollama_bridge.js
// ==========================================================
// MENTE DI ABIGAIL – Metodo Marika – Legge Universale
// Interpreta la domanda dell’Operatore e seleziona il Comando Operativo corretto
// Nessuna invenzione, nessuna fusione, solo corrispondenza rigorosa

const moment = require("moment");

// Mappa ufficiale dei Comandi Operativi riconosciuti da Abigail
const COMMANDS = {
  AURORIA: ["RAE", "RAS"],
  ECHO: ["REE", "RES"],
  VELARIA: ["RVE", "RVS"],
  ETERIA: ["REteriaE", "REteriaS"],
  VENERE: ["RVC", "RVA", "RVV", "RVEteria", "Identikit"], // solo manuali
};

// Parole chiave per la selezione automatica
const KEYWORDS = {
  sentimentale_profondo: ["prova", "sente", "amore", "emozioni", "perché", "allontanato", "connessione"],
  sentimentale_rapido: ["scriverà", "chiamerà", "tornerà", "messaggio", "contatto"],
  riflessivo: ["pensa", "intenzioni", "motivi", "atteggiamento", "percezione", "riflesso"],
  spirituale: ["anima", "energia", "guarigione", "trasformazione", "consapevolezza", "percorso", "missione"],
  lavorativo: ["lavoro", "progetto", "carriera", "ufficio", "collaborazione", "esito", "contratto"],
  evolutivo: ["fase", "sviluppo", "direzione", "decisione", "scelta"],
};

// Funzione principale: analizza la domanda e restituisce il comando corretto
function analyzeQuestion(inputText) {
  const text = inputText.toLowerCase().trim();

  let command = null;
  let modello = null;

  // === SEZIONE AURORIA (RAE / RAS) ===
  if (containsAny(text, KEYWORDS.sentimentale_profondo)) {
    command = "RAE";
    modello = "Auroria";
  } else if (containsAny(text, KEYWORDS.sentimentale_rapido)) {
    command = "RAS";
    modello = "Auroria";

  // === SEZIONE ECHO (REE / RES) ===
  } else if (containsAny(text, KEYWORDS.riflessivo)) {
    command = "REE";
    modello = "Echo";
  } else if (containsAny(text, KEYWORDS.spirituale)) {
    command = "RES";
    modello = "Echo";

  // === SEZIONE VELARIA (RVE / RVS) ===
  } else if (containsAny(text, KEYWORDS.lavorativo)) {
    command = "RVE";
    modello = "Velaria";
  } else if (containsAny(text, KEYWORDS.evolutivo)) {
    command = "RVS";
    modello = "Velaria";

  // === SEZIONE ETERIA (REteriaE / REteriaS) ===
  } else if (text.match(/(portale|quantico|origine|scopo|piano superiore|connessione cosmica)/)) {
    command = "REteriaE";
    modello = "Eteria";
  } else if (text.match(/(energia|fase spirituale|equilibrio|vibrazione)/)) {
    command = "REteriaS";
    modello = "Eteria";

  // === SEZIONE VENERE (manuale) ===
  } else if (text.match(/(tema natale|venere|identikit|vip|auroria|eteria|velaria)/)) {
    return {
      status: "manual",
      message:
        "⚠️ Questa domanda richiede un Comando Venere (RVC, RVA, RVV, RVEteria, Identikit) da selezionare manualmente.",
    };
  }

  // === SE NESSUN COMANDO RICONOSCIUTO ===
  if (!command) {
    return {
      status: "ask",
      message: "Vuoi che lo analizzi in ambito sentimentale, lavorativo, evolutivo o spirituale?",
    };
  }

  // === GENERAZIONE DATI DI ESECUZIONE ===
  const now = moment();
  const data = now.format("DD/MM/YYYY");
  const ora = now.format("HH:mm");
  const luogo = "Montebelluna (TV, Italia)"; // può essere aggiornato da input utente

  // === RISCRITTURA DOMANDA NEL LINGUAGGIO DEL METODO ===
  let domanda_riscritta = rewriteQuestion(inputText);

  // === OUTPUT STANDARDIZZATO ===
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

// ————————————————————————————————————————————————
// FUNZIONI DI SUPPORTO

// Verifica se il testo contiene almeno una parola chiave
function containsAny(text, words) {
  return words.some((word) => text.includes(word));
}

// Riscrive la domanda nel linguaggio corretto del Metodo
function rewriteQuestion(question) {
  let q = question.trim();
  if (!q.endsWith("?")) q += "?";
  q = q.charAt(0).toUpperCase() + q.slice(1);
  return q;
}

// ————————————————————————————————————————————————
module.exports = { analyzeQuestion };
