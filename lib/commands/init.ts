import * as fs from 'fs';
import { defaultConfig, getDefaultConfigPath } from '../config';

export const init = () => {
  const configPath = getDefaultConfigPath();

  if (!fs.existsSync(`${process.env.PWD}/${defaultConfig.migrationsDir}`)) {
    fs.mkdirSync(`${process.env.PWD}/${defaultConfig.migrationsDir}`);
  }

  if (!fs.existsSync(configPath)) {
    // creating migration config
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
  }
};
