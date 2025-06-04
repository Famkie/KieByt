import { readdir } from 'fs/promises';
import path from 'path';
import logger from '../utils/logger.js';

export async function loadPrefixCommands(client) {
  const commandPath = './commands/prefix';
  const folders = await readdir(commandPath);

  for (const folder of folders) {
    const commandFiles = await readdir(`${commandPath}/${folder}`);

    for (const file of commandFiles) {
      if (!file.endsWith('.js')) continue;
      const command = (await import(`${commandPath}/${folder}/${file}`)).default;

      if (!command?.name || typeof command.execute !== 'function') {
        logger.warn(`[PREFIX] Invalid command at ${file}`);
        continue;
      }

      client.prefixCommands.set(command.name, command);

      if (command.aliases && Array.isArray(command.aliases)) {
        command.aliases.forEach(alias => {
          client.aliases.set(alias, command.name);
        });
      }

      logger.info(`[PREFIX] Loaded ${command.name} (${file})`);
    }
  }
}
