import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

const logFilePath = path.resolve('./logs/debug.log');

// Pastikan folder logs ada, kalau belum buat
if (!fs.existsSync(path.dirname(logFilePath))) {
  fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
}

function writeToFile(level, msg) {
  const time = new Date().toISOString();
  const logMsg = `[${level}] ${time}: ${msg}\n`;
  fs.appendFile(logFilePath, logMsg, (err) => {
    if (err) console.error('Failed to write log file:', err);
  });
}

const logger = {
  info: (msg) => {
    const text = chalk.blue(`[INFO] ${new Date().toISOString()}: ${msg}`);
    console.log(text);
    writeToFile('INFO', msg);
  },

  warn: (msg) => {
    const text = chalk.yellow(`[WARN] ${new Date().toISOString()}: ${msg}`);
    console.warn(text);
    writeToFile('WARN', msg);
  },

  error: (msg) => {
    const text = chalk.red(`[ERROR] ${new Date().toISOString()}: ${msg}`);
    console.error(text);
    writeToFile('ERROR', msg);
  },

  debug: (msg) => {
    if (process.env.DEBUG === 'true') {
      const text = chalk.gray(`[DEBUG] ${new Date().toISOString()}: ${msg}`);
      console.debug(text);
      writeToFile('DEBUG', msg);
    }
  }
};

export default logger;
