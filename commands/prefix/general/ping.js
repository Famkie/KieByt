export default {
  name: 'ping',
  aliases: ['pong'],
  description: 'Cek respons bot.',
  async execute(message, args, client) {
    const msg = await message.reply('Pinging...');
    const latency = msg.createdTimestamp - message.createdTimestamp;
    msg.edit(`🏓 Pong! Latency: ${latency}ms`);
  },
}; 
