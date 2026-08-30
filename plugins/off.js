import { disabledGroups } from "../lib/botState.js";

export default {
  command: "off",
  description: "Spegne il bot nel gruppo.",
  category: "admin",

  async execute({ sock, chatId, message, config }) {
    const sender = message.key.participant || message.key.remoteJid;
    const isOwner = config.owner?.number ? sender.includes(config.owner.number) : false;

    if (!isOwner) {
      return await sock.sendMessage(chatId, { text: "❌ Solo l'Owner del bot può usare questo comando!" });
    }

    disabledGroups.add(chatId);
    await sock.sendMessage(chatId, { text: "🔴 Bot disattivato in questo gruppo." });
  }
};