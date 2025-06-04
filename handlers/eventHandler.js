import logger from '../utils/logger.js';

export async function loadEvents(client) {
  try {
    // Misal di folder events/client ada file event
    const eventFiles = ['ready.js', 'messageCreate.js', 'error.js']; // contoh
    for (const file of eventFiles) {
      const event = await import(`../events/client/${file}`);
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
    throw err; // Biar index.js tau ada error fatal
  }
}
