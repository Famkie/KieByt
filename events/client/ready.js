export default {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`[READY] Logged in as ${client.user.tag}`);
  },
}; 
