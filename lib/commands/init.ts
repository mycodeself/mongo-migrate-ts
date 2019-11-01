import * as fs from 'fs';
import { getDefaultConfigPath } from '../config';

const initConfig = {
  uri: 'mongodb://username:password@host:27017',
  database: 'db',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  migrationsDir: 'migrations',
  migrationsCollection: 'migrations_changelog'
};

export const init = () => {
  const configPath = getDefaultConfigPath();

  if (!fs.existsSync(`${process.env.PWD}/${initConfig.migrationsDir}`)) {
    fs.mkdirSync(`${process.env.PWD}/${initConfig.migrationsDir}`);
  }

  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify(initConfig, null, 2));
  }
};
