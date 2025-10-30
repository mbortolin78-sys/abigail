// server/narrativa_engine.js
// ==========================================================
// CUORE DI ABIGAIL – Metodo Marika – Legge Universale
// Attiva il modello corretto, genera la narrazione e la tabella tecnica dei calcoli

const path = require("path");

// Importa i generatori per ciascun comando operativo
const rae = require("../generatori/rae_generator");
const ras = require("../generatori/ras_generator");
const ree = require("../generatori/ree_generator");
const res = require("../generatori/res_generator");
const rve = require("../generatori/rve_generator");
const rvs = require("../generatori/rvs_generator");
const reteriaE = require("../generatori/reteriaE_generator");
const reteriaS = require("../generatori/reteriaS_generator");

// (I generatori Venere non vengono caricati automaticamente: sono manuali)

// ————————————————————————————————————————————————
// FUNZIONE PRINCIPALE

async function executeNarrative(commandPackage) {
  const { command, modello, data, ora, luogo, domanda_riscritta } = commandPackage;

  // Sicurezza: controllo base
  if (!command || !modello) {
    return {
      status: "error",
      message: "❌ Comando o modello mancanti. Verifica la domanda.",
    };
  }

  // Traccia di apertura tassativa
  const apertura = `Ho fatto l’oraria: ${data}, ore ${ora}, ${luogo}.\nDomanda: ${domanda_riscritta}\n`;

  // Inizializzazione variabili di risultato
  let narrativa = "";
  let tabella = "";

  // ————————————————————————————————————————————————
  // ATTIVAZIONE GENERATORI IN BASE AL COMANDO
  try {
    switch (command) {
      // ——— AURORIA ———
      case "RAE":
        narrativa = await rae.generate(data, ora, luogo, domanda_riscritta);
        tabella = await rae.table();
        break;
      case "RAS":
        narrativa = await ras.generate(data, ora, luogo, domanda_riscritta);
        tabella = await ras.table();
        break;

      // ——— ECHO ———
      case "REE":
        narrativa = await ree.generate(data, ora, luogo, domanda_riscritta);
        tabella = await ree.table();
        break;
      case "RES":
        narrativa = await res.generate(data, ora, luogo, domanda_riscritta);
        tabella = await res.table();
        break;

      // ——— VELARIA ———
      case "RVE":
        narrativa = await rve.generate(data, ora, luogo, domanda_riscritta);
        tabella = await rve.table();
        break;
      case "RVS":
        narrativa = await rvs.generate(data, ora, luogo, domanda_riscritta);
        tabella = await rvs.table();
        break;

      // ——— ETERIA ———
      case "REteriaE":
        narrativa = await reteriaE.generate(data, ora, luogo, domanda_riscritta);
        tabella = await reteriaE.table();
        break;
      case "REteriaS":
        narrativa = await reteriaS.generate(data, ora, luogo, domanda_riscritta);
        tabella = await reteriaS.table();
        break;

      // ——— VENERE (solo manuale) ———
      default:
        return {
          status: "manual",
          message: `⚠️ Il comando ${command} appartiene alla sezione Venere e deve essere attivato manualmente.`,
        };
    }
  } catch (err) {
    console.error("Errore nel motore:", err);
    return {
      status: "error",
      message: "❌ Errore nell’esecuzione del generatore. Controlla i file.",
    };
  }

  // ————————————————————————————————————————————————
  // CHIUSURA TASSATIVA
  const chiusura = "\n✨ I calcoli sono stati eseguiti con rigore secondo le Leggi Universali.\n";

  // OUTPUT COMPLETO
  return {
    status: "ok",
    modello,
    command,
    output: `${apertura}${narrativa}${chiusura}\n${tabella}`,
  };
}

// ————————————————————————————————————————————————
module.exports = { executeNarrative };
