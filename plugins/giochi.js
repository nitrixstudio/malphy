export default {
  command: "giochi",

  description: "Mostra i giochi disponibili.",

  category: "menu",

  async execute({ sock, chatId }) {
    await sock.sendMessage(chatId, {
      text:
`╭━━〔 🎮 GIOCHI 〕━━╮
│
│ 🚧 In arrivo...
│
│ Stiamo preparando i giochi
│ di Malphy! 🔥
│
╰━━━━━━━━━━━━━━━━━━╯`,
      footer: "🤖 Malphy • Giochi"
    });
  }
};