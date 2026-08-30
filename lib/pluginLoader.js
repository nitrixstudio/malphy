import { readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const plugins = new Map();

export async function loadPlugins() {
  plugins.clear();

  const pluginsPath = path.resolve("./plugins");

  let files;

  try {
    files = await readdir(pluginsPath);
  } catch (error) {
    console.log(`❌ Impossibile leggere la cartella plugins: ${error.message}`);
    return plugins;
  }

  for (const file of files) {
    if (!file.endsWith(".js")) continue;

    const filePath = path.join(pluginsPath, file);
    const moduleUrl = `${pathToFileURL(filePath).href}?update=${Date.now()}`;

    try {
      const module = await import(moduleUrl);
      const plugin = module.default;

      if (!plugin?.command || typeof plugin.execute !== "function") {
        console.log(`⚠️ Plugin ignorato (non è un comando): ${file}`);
        continue;
      }

      const commands = Array.isArray(plugin.command)
        ? plugin.command
        : [plugin.command];

      for (const command of commands) {
        plugins.set(command.toLowerCase(), plugin);
      }

      // Gestione degli alias (se presenti nel plugin)
      if (Array.isArray(plugin.aliases)) {
        for (const alias of plugin.aliases) {
          plugins.set(alias.toLowerCase(), plugin);
        }
      }
    } catch (error) {
      console.log(`❌ Errore nel caricamento del plugin ${file}: ${error.message}`);
    }
  }

  console.log(`✅ Plugin caricati: ${plugins.size}`);
  return plugins;
}

export function getPlugin(command) {
  return plugins.get(command.toLowerCase());
}