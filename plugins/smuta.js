import { mutedUsers } from "../lib/mute_user.js";

export default {
  command: "smuta",
  description: "Smuta un utente nel gruppo.",
  category: "admin",

  async execute({ sock, chatId, message, isGroup, isAdmin, reply }) {
    if (!isGroup) return reply("⚠️ Questo comando può essere usato solo nei gruppi!");
    if (!isAdmin) return reply("❌ Solo gli Admin possono usare questo comando!");

    const contextInfo = message.message?.extendedTextMessage?.contextInfo;
    
    let target = 
      contextInfo?.participant || 
      contextInfo?.mentionedJid?.[0];

    if (!target) {
      return reply("⚠️ Per smutare qualcuno, **rispondi** al suo messaggio o **menzionalo**!");
    }

    if (mutedUsers.has(chatId)) {
      mutedUsers.get(chatId).delete(target);
    }

    await reply(`🔊 Utente @${target.split("@")[0]} smutato con successo.`, {
      mentions: [target]
    });
  }
};