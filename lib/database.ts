import { Collection, Db, MongoClient, MongosOptions } from 'mongodb';
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

export const mongoConnect = async (
  uri: string,
  database: string,
  options?: MongosOptions
): Promise<IConnection> => {
  const client = await MongoClient.connect(uri, options);
  const db = client.db(database);

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
