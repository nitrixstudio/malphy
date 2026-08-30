import { mutedUsers } from "../lib/mute_user.js";

export default {
  command: "muta",
  description: "Muta un utente nel gruppo.",
  category: "admin",

  async execute({ sock, chatId, message, isGroup, isAdmin, reply }) {
    if (!isGroup) return reply("⚠️ Questo comando può essere usato solo nei gruppi!");
    if (!isAdmin) return reply("❌ Solo gli Admin possono usare questo comando!");

    const contextInfo = message.message?.extendedTextMessage?.contextInfo;
    
    let target = 
      contextInfo?.participant || 
      contextInfo?.mentionedJid?.[0];

    if (!target) {
      return reply("⚠️ Per mutare qualcuno, **rispondi** al suo messaggio o **menzionalo**!");
    }

    if (!mutedUsers.has(chatId)) {
      mutedUsers.set(chatId, new Set());
    }

    const groupMuted = mutedUsers.get(chatId);

    if (groupMuted.has(target)) {
      return reply(`⚠️ L'utente @${target.split("@")[0]} è già mutato in questo gruppo.`, {
        mentions: [target]
      });
    }

    groupMuted.add(target);
    await reply(`🔇 Utente @${target.split("@")[0]} mutato con successo. I suoi messaggi verranno eliminati.`, {
      mentions: [target]
    });
  }
};