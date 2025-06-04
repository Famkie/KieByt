export default {
  name: 'error',
  once: false,
  execute(client, error) {
    console.error(`❗ Discord client error:\n${error.stack || error}`);
  },
};
