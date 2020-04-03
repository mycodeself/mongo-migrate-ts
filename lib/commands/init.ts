import * as fs from 'fs';
import { getDefaultConfigPath } from '../config';
import ora from 'ora';

const initConfig = {
  uri: 'mongodb://username:password@host:27017',
  database: 'db',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  migrationsDir: 'migrations',
  migrationsCollection: 'migrations_changelog',
};

export const init = (): void => {
  const configPath = getDefaultConfigPath();
  const spinner = ora('Initializing config').start();
  const migrationsDir = `${process.env.PWD}/${initConfig.migrationsDir}`;

  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir);
  }

  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify(initConfig, null, 2));
  }

  spinner.succeed('Config initialized').stop();
};
