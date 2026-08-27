export default {
  command: "admin",

  description: "Mostra i comandi admin.",

  category: "admin",

  async execute({ sock, chatId }) {
    await sock.sendMessage(chatId, {
      text:
`╭━━〔 👑 ADMIN 〕━━╮
│
│ 🚧 Sezione in costruzione
│
│ I comandi admin arriveranno
│ prossimamente.
│
╰━━━━━━━━━━━━━━━━━━╯`,
      footer: "🤖 Malphy • Admin"
    });
  }
};