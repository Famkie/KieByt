import chalk from 'chalk';

const log = {
  info: (msg) => {
    console.log(chalk.blue(`[INFO] ${new Date().toISOString()}: ${msg}`));
  },

  warn: (msg) => {
    console.warn(chalk.yellow(`[WARN] ${new Date().toISOString()}: ${msg}`));
  },

  error: (msg) => {
    console.error(chalk.red(`[ERROR] ${new Date().toISOString()}: ${msg}`));
  },

  debug: (msg) => {
    if (process.env.DEBUG === 'true') {
      console.debug(chalk.gray(`[DEBUG] ${new Date().toISOString()}: ${msg}`));
    }
  }
};

export default log;
