import { MongoClientOptions } from 'mongodb';
export interface ProcessedConfig {
  uri: string;
  database: string;
  migrationsDir: string;
  migrationsCollection: string;
  options?: MongoClientOptions;
}
export interface Config {
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
export declare const readConfigFromFile: (filePath: string) => Config;
export declare const getCurrentWorkingDirectory: () => string;
export declare const getDefaultConfigPath: () => string;
export declare const getDefaultMigrationsDir: () => string;
export declare const processConfig: (config: Config) => ProcessedConfig;
