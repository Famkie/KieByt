import dotenv from 'dotenv';
dotenv.config();

export default {
  token: process.env.TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  prefix: process.env.PREFIX || '!',  // tambahkan prefix di sini
};
