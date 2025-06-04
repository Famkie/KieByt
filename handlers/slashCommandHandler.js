import { readdirSync } from 'fs';
import path from 'path';
import logger from '../utils/logger.js';

export async function loadSlashCommands(client) {
  try {
    const slashCommandsPath = path.resolve('./commands/slash');
    const categories = readdirSync(slashCommandsPath);

    for (const category of categories) {
      const categoryPath = path.join(slashCommandsPath, category);
      const commandFiles = readdirSync(categoryPath).filter(file => file.endsWith('.js'));

      for (const file of commandFiles) {
        try {
          const command = await import(path.join(categoryPath, file));
          // Command structure must have name and execute function
          if (!command.default || !command.default.name || !command.default.execute) {
            logger.warn(`Slash command in file ${file} is missing a required "name" or "execute" property.`);
            continue;
          }

          client.slashCommands.set(command.default.name, command.default);
          logger.info(`Loaded slash command: ${command.default.name}`);
        } catch (cmdErr) {
          logger.error(`Failed to load slash command at ${file}: ${cmdErr.message}`);
        }
      }
    }
  } catch (err) {
    logger.error(`Failed to load slash commands: ${err.message}`);
    throw err;
  }
}
