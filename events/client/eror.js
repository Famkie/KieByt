import { handleError } from '../../utils/errorHandler.js';

export default {
  name: 'error', // Nama event client error
  once: false, // Event ini bisa dipanggil berkali-kali

  /**
   * @param {Error} error
   * @param {Client} client
   */
  async execute(error, client) {
    // Tangkap error dan log pakai handler
    handleError(error);

    // Bisa juga kirim notif ke channel khusus kalau mau
    // Contoh:
    // const logChannel = await client.channels.fetch('CHANNEL_ID_LOG');
    // if (logChannel) logChannel.send(`🚨 Client error: \`${error.message}\``);
  },
}; 
