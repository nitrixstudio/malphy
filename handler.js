import baileys from "@realvare/baileys";
import { config } from "./config.js";
import { getPlugin } from "./lib/pluginLoader.js";
import { disabledGroups } from "./lib/botState.js";
import { mutedUsers } from "./lib/mute_user.js";

const { jidNormalizedUser } = baileys;

/**
 * Estrae solo i numeri da un qualsiasi JID o formato stringa
 */
function extractPhoneNumber(jid) {
  if (!jid) return "";
  return jid.split("@")[0].replace(/[^0-9]/g, "");
}

export async function handleMessage(sock, message) {
  if (!message?.message) return;

  const remoteJid = message.key.remoteJid;
  if (!remoteJid) return;

  // JID e Numero del Bot
  const rawBotId = sock.user?.id || "";
  const botJid = rawBotId ? jidNormalizedUser(rawBotId) : "";
  const botNumber = extractPhoneNumber(botJid);

  // Risoluzione sicura del Mittente (gestisce LID, Username e gruppi)
  let rawSender = message.key.fromMe
    ? botJid
    : (message.key.participant || message.participant || remoteJid);

  const senderJid = jidNormalizedUser(rawSender);
  const senderNumber = extractPhoneNumber(senderJid);

  const msg = message.message;

  // Estrazione del testo da qualsiasi tipo di messaggio
  let text =
    msg.conversation ||
    msg.extendedTextMessage?.text ||
    msg.imageMessage?.caption ||
    msg.videoMessage?.caption ||
    msg.buttonsResponseMessage?.selectedButtonId ||
    msg.templateButtonReplyMessage?.selectedId ||
    msg.listResponseMessage?.singleSelectReply?.selectedRowId ||
    msg.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson ||
    "";

  if (!text) return;

  const trimmed = text.trim();

  // Se inviato dal bot e non ha il prefisso, ignora
  if (message.key.fromMe && !trimmed.startsWith(config.prefix)) {
    return;
  }

  if (!trimmed.startsWith(config.prefix)) return;

  const isGroup = remoteJid.endsWith("@g.us");

  // Controllo Utenti Mutati
  if (isGroup && mutedUsers.has(remoteJid)) {
    const groupMuted = mutedUsers.get(remoteJid);
    const isMuted = Array.from(groupMuted).some(muted => {
      const mutedNorm = jidNormalizedUser(muted);
      const mutedNum = extractPhoneNumber(mutedNorm);
      return (
        mutedNorm === senderJid ||
        (senderNumber !== "" && mutedNum === senderNumber)
      );
    });

    if (isMuted) {
      try {
        await sock.sendMessage(remoteJid, { delete: message.key });
      } catch (e) {}
      return;
    }
  }

  const args = trimmed
    .slice(config.prefix.length)
    .trim()
    .split(/\s+/);

  const command = args.shift()?.toLowerCase();
  if (!command) return;

  if (isGroup && disabledGroups.has(remoteJid) && command !== "on") {
    return;
  }

  const plugin = getPlugin(command);
  if (!plugin) return;

  // Permessi Admin e Owner
  let isAdmin = false;
  let isBotAdmin = false;

  if (isGroup) {
    try {
      const groupMetadata = await sock.groupMetadata(remoteJid);
      const participants = groupMetadata?.participants || [];

      for (const p of participants) {
        const pNormalized = jidNormalizedUser(p.id);
        const pNum = extractPhoneNumber(pNormalized);
        const pAdmin = p.admin === "admin" || p.admin === "superadmin";

        if (pAdmin) {
          if (
            pNormalized === senderJid ||
            (senderNumber !== "" && pNum === senderNumber)
          ) {
            isAdmin = true;
          }
          if (
            pNormalized === botJid ||
            (botNumber !== "" && pNum === botNumber)
          ) {
            isBotAdmin = true;
          }
        }
      }
    } catch (e) {}
  }

  const ownerNum = config.owner?.number
    ? config.owner.number.replace(/[^0-9]/g, "")
    : "";
  const isOwner =
    message.key.fromMe ||
    (ownerNum !== "" && senderNumber === ownerNum);

  // Helper per le risposte
  const reply = async (txt, options = {}) => {
    try {
      const payload =
        typeof txt === "string" ? { text: txt, ...options } : { ...txt, ...options };

      if (!message.key.fromMe) {
        payload.quoted = message;
      }

      return await sock.sendMessage(remoteJid, payload);
    } catch (err) {}
  };

  // Esecuzione del Plugin
  try {
    await plugin.execute({
      sock,
      message,
      chatId: remoteJid,
      args,
      command,
      config,
      isGroup,
      sender: senderJid,
      senderNumber,
      isAdmin,
      isBotAdmin,
      isOwner,
      reply
    });
  } catch (error) {}
}