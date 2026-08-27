export default {
  command: "menu",

  aliases: ["comandi"],

  description: "Mostra il menu principale di Malphy.",

  category: "info",

  async execute({ sock, chatId }) {
    const menuText = `╭━━〔 🤖 MALPHY 〕━━╮
│
│ ⚡ Benvenuto su Malphy!
│
│ 📋 MENU PRINCIPALE
│
╰━━━━━━━━━━━━━━━━━━╯

👇 Seleziona una categoria:`;

    const buttons = [
      {
        buttonId: ".funzioni",
        buttonText: {
          displayText: "⚙️ FUNZIONI"
        },
        type: 1
      },
      {
        buttonId: ".giochi",
        buttonText: {
          displayText: "🎮 GIOCHI"
        },
        type: 1
      },
      {
        buttonId: ".admin",
        buttonText: {
          displayText: "👑 ADMIN"
        },
        type: 1
      }
    ];

    await sock.sendMessage(chatId, {
      text: menuText,
      footer: "🤖 Malphy • Seleziona una categoria",
      buttons,
      headerType: 1
    });
  }
};