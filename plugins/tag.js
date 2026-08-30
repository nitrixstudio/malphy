export default {
  command: ["tag", "hidetag"],
  description: "Menziona tutti i membri del gruppo senza mostrare l'elenco dei numeri.",
  category: "admin",

  async execute({ sock, chatId, message, args }) {
    if (!chatId.endsWith("@g.us")) {
      return await sock.sendMessage(chatId, { 
        text: "⚠️ Questo comando funziona solo nei gruppi!" 
      });
    }

    const groupMetadata = await sock.groupMetadata(chatId);
    const participants = groupMetadata.participants;
    const sender = message.key.participant || message.key.remoteJid;

     const isSenderAdmin = participants.some(
      (p) => p.id === sender && (p.admin === "admin" || p.admin === "superadmin")
    );

    if (!isSenderAdmin) {
      return await sock.sendMessage(chatId, { 
        text: "❌ Soltanto gli amministratori possono usare questo comando." 
      });
    }

    const customText = args.join(" ");

        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    const mentions = participants.map((p) => p.id);

       if (quotedMessage) {
      const contextInfo = message.message?.extendedTextMessage?.contextInfo;
      const stanzaId = contextInfo?.stanzaId;
      const participant = contextInfo?.participant;

      await sock.sendMessage(chatId, {
        text: customText || "📢 *Notifica per tutti i membri!*",
        mentions: mentions
      }, {
        quoted: {
          key: {
            remoteJid: chatId,
            fromMe: false,
            id: stanzaId,
            participant: participant
          },
          message: quotedMessage
        }
      });
      return;
    }

    if (!customText) {
      return await sock.sendMessage(chatId, { 
        text: "⚠️ Inserisci un messaggio dopo il comando. Es: `.tag Avviso importante`" 
      });
    }

    await sock.sendMessage(chatId, {
      text: `📢 ${customText}`,
      mentions: mentions
    });
  }
};