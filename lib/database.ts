import { Collection, Db, MongoClient } from 'mongodb';
import { getConfig } from './config';
import { Migration } from './migrations';

export interface Connection {
  client: MongoClient;
  db: Db;
}

export interface MigrationModel {
  id: number;
  file: string;
  className: string;
  timestamp: number;
}

export const connectDatabase = async (): Promise<Connection> => {
  const config = getConfig();
  if (!config.uri) {
    throw new Error(`No "uri" entry found in the config file`);
  }

  if (!config.database) {
    throw new Error(`No "database" entry found in the config file`);
  }

  const client = await MongoClient.connect(config.uri, config.options);
  const db = client.db(config.database);

  return {
    client,
    db
  };
};

export const insertMigration = async (
  collection: Collection,
  migration: Migration
) => {
  await collection.insertOne({
    file: migration.file,
    className: migration.className,
    timestamp: +new Date()
  });
};

export const deleteMigration = async (
  collection: Collection,
  migration: Migration
) => {
  await collection.deleteOne({
    className: migration.className
  });
};

export const getAppliedMigrations = async (
  collection: Collection
): Promise<MigrationModel[]> => {
  return await collection
    .find()
    .sort({ timestamp: -1 })
    .toArray();
};

export const getLastAppliedMigration = async (
  collection: Collection
): Promise<MigrationModel> => {
  return await collection
    .find({})
    .sort({ timestamp: -1 })
    .limit(1)
    .next();
};
