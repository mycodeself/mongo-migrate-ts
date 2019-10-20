import * as fs from 'fs';
import { getDefaultConfigPath, getDefaultMigrationsDir } from '../config';

export const clearConfig = () => {
  const configPath = getDefaultConfigPath();
  const migrationsDir = getDefaultMigrationsDir();

  if (fs.existsSync(configPath)) {
    fs.unlinkSync(configPath);
  }

  if (fs.existsSync(migrationsDir)) {
    const files = fs.readdirSync(migrationsDir);
    files.map((file: string) => fs.unlinkSync(`${migrationsDir}/${file}`));
    fs.rmdirSync(migrationsDir);
  }
};
