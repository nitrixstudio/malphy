import { startMalphy } from "./main.js";

console.clear();

console.log("╔══════════════════════════════════╗");
console.log("║              🤖 MALPHY           ║");
console.log("║          WhatsApp Bot            ║");
console.log("╚══════════════════════════════════╝");
console.log("");

startMalphy().catch((error) => {
  console.log(`❌ ERRORE: ${error.message}`);
});