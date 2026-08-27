export default {
  command: "funzioni",

  description: "Mostra le funzioni di Malphy.",

  category: "menu",

  async execute({ sock, chatId }) {
    await sock.sendMessage(chatId, {
      text:
`╭━━〔 ⚙️ FUNZIONI 〕━━╮
│
│ 🏓 .ping
│ 📋 .menu
│
╰━━━━━━━━━━━━━━━━━━╯`,
      footer: "🤖 Malphy • Funzioni"
    });
  }
};