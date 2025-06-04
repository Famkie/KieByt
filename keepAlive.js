import express from 'express';

export function keepAlive() {
  const app = express();

  app.all('/', (req, res) => {
    res.send('KieBot is alive!');
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`[KEEPALIVE] Server is running on port ${PORT}`);
  });
}
