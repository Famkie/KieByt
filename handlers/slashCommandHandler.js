import { readdir } from 'fs/promises';
import { logger } from '../utils/logger.js';

export async function loadSlashCommands(client) {
  const commandPath = './commands/slash';
  const folders = await readdir(commandPath);

  for (const folder of folders) {
    const commandFiles = await readdir(`${commandPath}/${folder}`);

    for (const file of commandFiles) {
      if (!file.endsWith('.js')) continue;
      const command = (await import(`${commandPath}/${folder}/${file}`)).default;

      if (!command?.data || !command?.execute) {
        logger.warn(`[SLASH] Invalid command file: ${file}`);
        continue;
      }

      client.slashCommands.set(command.data.name, command);
      logger.info(`[SLASH] Loaded /${command.data.name} (${file})`);
    }
  }
}
