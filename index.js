import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { config } from 'dotenv';
import { loadEvents } from './handlers/eventHandler.js';
import { loadSlashCommands } from './handlers/slashCommandHandler.js';
import { loadPrefixCommands } from './handlers/prefixCommandHandler.js';
import { deploySlashCommands } from './deploy/deploySlash.js';
import { keepAlive } from './keepAlive.js';
import logger from './utils/logger.js';  // <-- perbaikan import

config(); // Load .env variables
keepAlive();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.GuildMember,
    Partials.User,
  ],
});

client.slashCommands = new Collection();
client.prefixCommands = new Collection();
client.aliases = new Collection();
client.cooldowns = new Collection();

(async () => {
  client.config = (await import('./config/config.js')).default;

  logger.info('🟡 Starting up KieBot...');

  // Handler setup
  await loadEvents(client);
  await loadSlashCommands(client);
  await loadPrefixCommands(client);
  await deploySlashCommands(client); // Optional: Slash command deploy

  // Start bot
  try {
    await client.login(process.env.TOKEN);
    logger.info('🟢 Bot logged in successfully.');
  } catch (err) {
    logger.error(`🔴 Failed to login: ${err.message}`);
    process.exit(1);
  }
})();
