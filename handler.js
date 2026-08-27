import { config } from "./config.js";
import { getPlugin } from "./lib/pluginLoader.js";

export async function handleMessage(sock, message) {
  if (!message?.message) return;

  const remoteJid = message.key.remoteJid;

  if (!remoteJid) return;

  const msg = message.message;

  let text =
    msg.conversation ||
    msg.extendedTextMessage?.text ||
    msg.buttonsResponseMessage?.selectedButtonId ||
    msg.templateButtonReplyMessage?.selectedId ||
    "";

  // Button WhatsApp
  if (msg.buttonsResponseMessage) {
    console.log(
      `🔘 BUTTON: ${msg.buttonsResponseMessage.selectedButtonId}`
    );
  }

  if (msg.templateButtonReplyMessage) {
    console.log(
      `🔘 BUTTON: ${msg.templateButtonReplyMessage.selectedId}`
    );
  }

  if (!text) return;

  const trimmed = text.trim();

  if (!trimmed.startsWith(config.prefix)) return;

  const args = trimmed
    .slice(config.prefix.length)
    .trim()
    .split(/\s+/);

  const command = args.shift()?.toLowerCase();

  if (!command) return;

  const plugin = getPlugin(command);

  if (!plugin) {
    console.log(`⚠️ COMANDO NON TROVATO: ${command}`);
    return;
  }

  console.log(`⚡ COMANDO: ${config.prefix}${command}`);

  await plugin.execute({
    sock,
    message,
    chatId: remoteJid,
    args,
    command,
    config
  });
}