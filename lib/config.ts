import * as fs from 'fs';
import { MongoClientOptions } from 'mongodb';

const CONFIG_FILENAME = 'migrations.json';
const MIGRATIONS_DIR = 'migrations';

export interface IConfig {
  uri: string;
  database: string;
  useEnv: boolean;
  options: MongoClientOptions;
  migrationsDir: string;
  migrationsCollection: string;
}

export const getConfig = (): IConfig => {
  const configPath = getDefaultConfigPath();

  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file ${configPath} not found.`);
  }

  const rawConfig = fs.readFileSync(configPath).toString();
  const config = JSON.parse(rawConfig) as IConfig;

  if (config.useEnv) {
    config.uri = process.env.MONGO_MIGRATE_URI || '';
    config.database = process.env.MONGO_MIGRATE_DB || '';
  }

  return {
    ...config,
    migrationsDir: `${process.env.PWD}/${config.migrationsDir}`
  };
};

export const getDefaultConfigPath = (): string =>
  `${process.env.PWD}/${CONFIG_FILENAME}`;

export const getDefaultMigrationsDir = (): string =>
  `${process.env.PWD}/${MIGRATIONS_DIR}`;
