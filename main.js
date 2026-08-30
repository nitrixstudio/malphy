import baileys from "@realvare/baileys";
import pino from "pino";
import qrcode from "qrcode-terminal";
import NodeCache from "node-cache";

import { config } from "./config.js";
import { handleMessage } from "./handler.js";
import { loadPlugins } from "./lib/pluginLoader.js";

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = baileys;

// Cache per i tentativi di cifratura E2E
const msgRetryCounterCache = new NodeCache();

export async function startMalphy() {
  const { state, saveCreds } = await useMultiFileAuthState(
    config.sessionFolder
  );

  await loadPlugins();

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    markOnlineOnConnect: true,
    msgRetryCounterCache, // Risolve l'errore "In attesa del messaggio"
    // Rimosso getMessage vuoto per evitare corruzione della cifratura
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    // Gestisce sia i messaggi in arrivo sia quelli inviati dal bot stesso
    for (const message of messages) {
      try {
        await handleMessage(sock, message);
      } catch (error) {
        console.log(`❌ ERRORE GESTIONE MESSAGGIO: ${error.message}`);
      }
    }
  });

  sock.ev.on("connection.update", ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log("\n📱 SCANSIONA IL QR CON WHATSAPP:\n");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      console.log("✅ MALPHY ONLINE\n");
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !==
        DisconnectReason.loggedOut;

      if (shouldReconnect) {
        console.log("🔄 RICONNESSIONE...");
        startMalphy();
      } else {
        console.log("❌ MALPHY DISCONNESSO");
      }
    }
  });
}