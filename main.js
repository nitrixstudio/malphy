import baileys from "@realvare/baileys";
import pino from "pino";
import qrcode from "qrcode-terminal";

import { config } from "./config.js";
import { handleMessage } from "./handler.js";
import { loadPlugins } from "./lib/pluginLoader.js";

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = baileys;

export async function startMalphy() {
  const { state, saveCreds } = await useMultiFileAuthState(
    config.sessionFolder
  );

  await loadPlugins();

  const sock = makeWASocket({
  auth: state,
  logger: pino({ level: "silent" }),
  printQRInTerminal: false,
  markOnlineOnConnect: false,
  syncFullHistory: false
});

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages }) => {
    for (const message of messages) {
      try {
        await handleMessage(sock, message);
      } catch (error) {
        console.log(`❌ ERRORE COMANDO: ${error.message}`);
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
        console.log(
          "⚠️ Elimina la cartella sessions per effettuare un nuovo collegamento."
        );
      }
    }
  });
}