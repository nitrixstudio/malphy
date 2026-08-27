export default {
  command: "ping",

  async execute({ sock, chatId }) {
    const start = process.hrtime.bigint();

    await sock.sendMessage(chatId, {
      text: "🏓 Calcolo della latenza..."
    });

    const end = process.hrtime.bigint();

    const responseTime = Number(end - start) / 1_000_000;

    const ping = responseTime.toFixed(0);

    await sock.sendMessage(chatId, {
      text:
`╭━━〔 🤖 MALPHY 〕━━╮
│
│ 🏓 Pong!
│ ⚡ Latenza: ${ping} ms
│
╰━━━━━━━━━━━━━━━━━━╯`
    });
  }
};