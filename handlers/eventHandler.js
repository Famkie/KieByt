import { readdir } from 'fs/promises';
import { logger } from '../utils/logger.js';

export async function loadEvents(client) {
  const eventFolders = ['./events/client', './events/guild'];

  for (const folder of eventFolders) {
    const files = await readdir(folder);

    for (const file of files) {
      if (!file.endsWith('.js')) continue;
      const event = (await import(`${folder}/${file}`)).default;

      if (!event || !event.name || typeof event.execute !== 'function') {
        logger.warn(`[EVENT] Invalid event file: ${file}`);
        continue;
      }

      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }

      logger.info(`[EVENT] Loaded ${event.name} from ${file}`);
    }
  }
} 
