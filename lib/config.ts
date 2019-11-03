import * as fs from 'fs';
import { MongoClientOptions } from 'mongodb';
import { getDbFromUri } from './utils/getDbFromUri';

const DEFAULT_MIGRATIONS_COLLECTION = 'migrations_changelog';
const DEFAULT_MIGRATIONS_DIR = 'migrations';
const DEFAULT_CONFIG_FILENAME = 'migrations.json';
const DEFAULT_ENV_VAR_URI = 'MONGO_MIGRATE_URI';
const DEFAULT_ENV_VAR_DB = 'MONGO_MIGRATE_DB';

export interface IProcessedConfig {
  uri: string;
  database: string;
  migrationsDir: string;
  migrationsCollection: string;
  options?: MongoClientOptions;
}

export interface IConfig {
  migrationsDir: string;
  migrationsCollection?: string;
  uri?: string;
  database?: string;
  useEnv?: boolean;
  environment?: {
    uriVar?: string;
    databaseVar?: string;
  };
  options?: MongoClientOptions;
}

export const readConfigFromFile = (filePath: string): IConfig => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Config file ${filePath} not found.`);
  }

  const rawConfig = fs.readFileSync(filePath).toString();
  const config = JSON.parse(rawConfig) as IConfig;

  return config;
};

export const getDefaultConfigPath = (): string =>
  `${process.env.PWD}/${DEFAULT_CONFIG_FILENAME}`;

export const getDefaultMigrationsDir = (): string =>
  `${process.env.PWD}/${DEFAULT_MIGRATIONS_DIR}`;

export const processConfig = (config: IConfig): IProcessedConfig => {
  const dbConfig = config.useEnv
    ? getConfigFromEnv(config)
    : {
        uri: config.uri,
        database: config.database
      };

  if (!dbConfig.uri) {
    throw new Error(`Invalid configuration, uri is empty.`);
  }

  if (!dbConfig.database) {
    dbConfig.database = getDbFromUri(dbConfig.uri);

    if (!dbConfig.database) {
      throw new Error(`Invalid configuration, database is empty.`);
    }
  }

  return {
    ...dbConfig,
    migrationsDir: config.migrationsDir,
    migrationsCollection:
      config.migrationsCollection || DEFAULT_MIGRATIONS_COLLECTION,
    options: config.options
  } as IProcessedConfig;
};

const getConfigFromEnv = (
  config: IConfig
): { uri: string; database: string } => {
  const uriVarName =
    (config.environment && config.environment.uriVar) || DEFAULT_ENV_VAR_URI;
  const dbVarName =
    (config.environment && config.environment.databaseVar) ||
    DEFAULT_ENV_VAR_DB;
  const uri = process.env[uriVarName] || '';
  const database = process.env[dbVarName] || '';

  return {
    uri,
    database
  };
};
