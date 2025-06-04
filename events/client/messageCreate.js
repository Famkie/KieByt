export default {
  name: 'messageCreate',
  async execute(message, client) {
    const prefix = client.config.prefix;

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();

    const command = client.prefixCommands.get(commandName)
      || client.prefixCommands.get(client.aliases.get(commandName));

    if (!command) return;

    try {
      await command.execute(message, args, client);
    } catch (error) {
      console.error(error);
      message.reply('❌ Error executing command.');
    }
  },
};
