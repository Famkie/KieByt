import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadEvents(client) {
  try {
    const eventFiles = ['ready.js', 'messageCreate.js', 'error.js']; // contoh
    for (const file of eventFiles) {
      const filePath = path.join(__dirname, '..', 'events', 'client', file);
      // Pakai import dengan file:// + absolute path
      const event = await import(`file://${filePath}`);
      const eventName = file.split('.')[0];
      if (event.default.once) {
        client.once(eventName, (...args) => event.default.execute(client, ...args));
      } else {
        client.on(eventName, (...args) => {
          try {
            event.default.execute(client, ...args);
          } catch (err) {
            logger.error(`Event error on ${eventName}: ${err.message}`);
          }
        });
      }
      logger.info(`Loaded event: ${eventName}`);
    }
  } catch (err) {
    logger.error(`Failed to load events: ${err.message}`);
    throw err;
  }
}
