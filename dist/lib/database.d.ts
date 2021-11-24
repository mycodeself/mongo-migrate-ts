import { Collection, Db, MongoClient, MongosOptions } from 'mongodb';
import { MigrationObject } from './migrations';
export interface DatabaseConnection {
  client: MongoClient;
  db: Db;
}
export interface MigrationModel {
  id: string;
  file: string;
  className: string;
  timestamp: number;
}
export declare const mongoConnect: (
  uri: string,
  database: string,
  options?: MongosOptions | undefined
) => Promise<DatabaseConnection>;
export declare const insertMigration: (
  collection: Collection,
  migration: MigrationObject
) => Promise<void>;
export declare const deleteMigration: (
  collection: Collection,
  migration: MigrationObject
) => Promise<void>;
export declare const getAppliedMigrations: (
  collection: Collection
) => Promise<MigrationModel[]>;
export declare const getLastAppliedMigration: (
  collection: Collection
) => Promise<MigrationModel>;
