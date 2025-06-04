import { REST, Routes } from 'discord.js';
import { readdir } from 'fs/promises';
import { logger } from '../utils/logger.js';

export async function deploySlashCommands(client) {
  const commands = [];
  const folders = await readdir('./commands/slash');

  for (const folder of folders) {
    const files = await readdir(`./commands/slash/${folder}`);
    for (const file of files) {
      const command = (await import(`../commands/slash/${folder}/${file}`)).default;
      if (command?.data) commands.push(command.data.toJSON());
    }
  }

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  const { clientId, devGuildId } = client.config;

  try {
    logger.info(`[DEPLOY] Registering ${commands.length} slash commands to guild ${devGuildId}...`);
    await rest.put(
      Routes.applicationGuildCommands(clientId, devGuildId),
      { body: commands }
    );
    logger.info('[DEPLOY] Slash commands deployed!');
  } catch (err) {
    logger.error('[DEPLOY] Error deploying slash commands:', err);
  }
       } 
