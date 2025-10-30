// server/motore_calcoli.js
// CUORE DEI CALCOLI – Metodo Marika – Legge Universale

const auroria = require("../modelli/auroria");
const echo = require("../modelli/echo");
const velaria = require("../modelli/velaria");
const eteria = require("../modelli/eteria");

const venere_classica = require("../modelli/venere_classica");
const venere_auroria = require("../modelli/venere_auroria");
const venere_eteria = require("../modelli/venere_eteria");
const venere_velaria = require("../modelli/venere_velaria");
const identikit = require("../modelli/identikit");

async function eseguiCalcolo(command, data, ora, luogo) {
  try {
    let risultati = {};

    if (["RAE", "RAS"].includes(command)) {
      risultati = await auroria.calcola(data, ora, luogo, command);
    } else if (["REE", "RES"].includes(command)) {
      risultati = await echo.calcola(data, ora, luogo, command);
    } else if (["RVE", "RVS"].includes(command)) {
      risultati = await velaria.calcola(data, ora, luogo, command);
    } else if (["REteriaE", "REteriaS"].includes(command)) {
      risultati = await eteria.calcola(data, ora, luogo, command);
    } else if (["RVC"].includes(command)) {
      risultati = await venere_classica.calcola(data, ora, luogo, command);
    } else if (["RVA"].includes(command)) {
      risultati = await venere_auroria.calcola(data, ora, luogo, command);
    } else if (["RVEteria"].includes(command)) {
      risultati = await venere_eteria.calcola(data, ora, luogo, command);
    } else if (["RVV"].includes(command)) {
      risultati = await venere_velaria.calcola(data, ora, luogo, command);
    } else if (["Identikit"].includes(command)) {
      risultati = await identikit.calcola(data, ora, luogo, command);
    } else {
      throw new Error(`Comando ${command} non riconosciuto dal motore.`);
    }

    if (!risultati || Object.keys(risultati).length === 0) {
      throw new Error("Nessun risultato restituito dal modello.");
    }

    return {
      status: "ok",
      command,
      data,
      ora,
      luogo,
      risultati,
    };
  } catch (err) {
    console.error("Errore nel motore dei calcoli:", err);
    return {
      status: "error",
      message: "Errore durante l’esecuzione del calcolo.",
      dettaglio: err.message,
    };
  }
}

module.exports = { eseguiCalcolo };
