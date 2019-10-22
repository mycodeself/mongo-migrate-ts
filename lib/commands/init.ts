import * as fs from 'fs';
import { getDefaultConfigPath } from '../config';

export const init = () => {
  const baseOptions = {
    uri: 'mongodb://username:password@host:27017',
    database: 'db',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    migrationsDir: 'migrations',
    migrationsCollection: 'migrations_changelog'
  };
  const configPath = getDefaultConfigPath();

  if (!fs.existsSync(`${process.env.PWD}/${baseOptions.migrationsDir}`)) {
    fs.mkdirSync(`${process.env.PWD}/${baseOptions.migrationsDir}`);
  }

  if (!fs.existsSync(configPath)) {
    // creating migration config
    fs.writeFileSync(configPath, JSON.stringify(baseOptions, null, 2));
  }
};
