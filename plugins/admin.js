export default {
  command: "admin",
  description: "Mostra i comandi riservati agli amministratori.",
  category: "admin",

  async execute({ sock, chatId, config }) {
    const adminText = `╭━━〔 👑 *ADMIN COMANDI* 〕━━╮
│
│ 🛠️ *Gestione Gruppo:*
│ 
│ 🔹 \`${config.prefix}kick\` ➔ Espelle un utente
│ 🔹 \`${config.prefix}muta\` ➔ muta un utente
│ 🔹 \`${config.prefix}smuta\` ➔ smuta un utente
│ 🔹 \`${config.prefix}tag\` ➔ Menziona tutti i membri
│
╰━━━━━━━━━━━━━━━━━━╯

🤖 *${config.botName}* • Usa questi comandi nei gruppi in cui sei Admin.`;

    await sock.sendMessage(chatId, {
      text: adminText
    });
  }
};