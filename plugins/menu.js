export default {
  command: "menu",

  aliases: ["comandi", "help"],

  description: "Mostra il menu principale di Malphy.",

  category: "info",

  async execute({ sock, chatId }) {
    const menuText = `
*┌───〔 🤖 𝗠𝗔𝗟𝗣𝗛𝗬 𝗕𝗢𝗧 〕───┐*
│
│ ⚡ *Benvenuto nell'interfaccia di Malphy!*
│ 
│ 📌 *Seleziona una categoria qui sotto*
│    *per esplorare i comandi disponibili.*
│
*└───────────────────────┘*`;

    const buttons = [
      {
        buttonId: ".funzioni",
        buttonText: {
          displayText: "⚡ 𝗙𝗨𝗡𝗭𝗜𝗢𝗡𝗜"
        },
        type: 1
      },
      {
        buttonId: ".giochi",
        buttonText: {
          displayText: "🎮 𝗚𝗜𝗢𝗖𝗛𝗜"
        },
        type: 1
      },
      {
        buttonId: ".admin",
        buttonText: {
          displayText: "👑 𝗔𝗗𝗠𝗜𝗡"
        },
        type: 1
      }
    ];

    await sock.sendMessage(chatId, {
      text: menuText.trim(),
      footer: "─────── 🤖 𝗠𝗮𝗹𝗽𝗵𝘆 𝗦𝘆𝘀𝘁𝗲𝗺 ───────",
      buttons,
      headerType: 1
    });
  }
};