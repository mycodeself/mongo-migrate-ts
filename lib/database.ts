import { Collection, Db, MongoClient } from 'mongodb';
import { getConfig } from './config';
import { IMigration } from './migrations';

export interface IConnection {
  client: MongoClient;
  db: Db;
}

export interface IMigrationModel {
  id: string;
  file: string;
  className: string;
  timestamp: number;
}

export const connectDatabase = async (): Promise<IConnection> => {
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
  migration: IMigration
) => {
  await collection.insertOne({
    file: migration.file,
    className: migration.className,
    timestamp: +new Date()
  });
};

export const deleteMigration = async (
  collection: Collection,
  migration: IMigration
) => {
  await collection.deleteOne({
    className: migration.className
  });
};

export const getAppliedMigrations = (
  collection: Collection
): Promise<IMigrationModel[]> => {
  return collection
    .find()
    .sort({ timestamp: -1 })
    .toArray();
};

export const getLastAppliedMigration = (
  collection: Collection
): Promise<IMigrationModel> => {
  return collection
    .find({})
    .sort({ timestamp: -1 })
    .limit(1)
    .next();
};
