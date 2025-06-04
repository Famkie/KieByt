import fs from 'fs';
import path from 'path';
import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { config } from 'dotenv';
import { loadEvents } from './handlers/eventHandler.js';
import { loadSlashCommands } from './handlers/slashCommandHandler.js';
import { loadPrefixCommands } from './handlers/prefixCommandHandler.js';
import { deploySlashCommands } from './deploy/deploySlash.js';
import { keepAlive } from './keepAlive.js';
import logger from './utils/logger.js';

config(); // Load .env variables

// Setup error logging folder & file
const logsDir = path.resolve('./logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);
const errorLogFile = path.join(logsDir, 'error.log');

// Global error handlers
process.on('uncaughtException', (err) => {
  const msg = `[${new Date().toISOString()}] Uncaught Exception: ${err.stack || err.message || err}\n`;
  fs.appendFileSync(errorLogFile, msg, 'utf8');
  console.error(msg);
  process.exit(1); // Restart bot biar fresh
});

process.on('unhandledRejection', (reason, promise) => {
  const msg = `[${new Date().toISOString()}] Unhandled Rejection at: ${promise}\nReason: ${reason.stack || reason}\n`;
  fs.appendFileSync(errorLogFile, msg, 'utf8');
  console.error(msg);
  // Bisa lanjut jalan, gak usah exit
});

// Optional: override console.error supaya log manual juga nyangkut di file
const originalConsoleError = console.error;
console.error = (...args) => {
  const msg = `[${new Date().toISOString()}] ${args.join(' ')}\n`;
  fs.appendFileSync(errorLogFile, msg, 'utf8');
  originalConsoleError(...args);
};

// Keep bot alive (misal hosting di Replit/Glitch)
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
  try {
    client.config = (await import('./config/config.js')).default;

    logger.info('🟡 Starting up KieBot...');

    // Load event handlers dan commands
    await loadEvents(client);
    await loadSlashCommands(client);
    await loadPrefixCommands(client);

    // Deploy slash commands (optional, bisa dikomentar)
    await deploySlashCommands(client);

    // Login bot ke Discord
    await client.login(process.env.TOKEN);
    logger.info('🟢 Bot logged in successfully.');
  } catch (err) {
    logger.error(`🔴 Fatal startup error: ${err.stack || err.message || err}`);
    process.exit(1);
  }
})();
