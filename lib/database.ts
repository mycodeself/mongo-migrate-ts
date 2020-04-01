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

export const mongoConnect = async (
  uri: string,
  database: string,
  options?: MongosOptions
): Promise<DatabaseConnection> => {
  const client = await MongoClient.connect(uri, options);
  const db = client.db(database);

  return {
    client,
    db,
  };
};

export const insertMigration = async (
  collection: Collection,
  migration: MigrationObject
) => {
  await collection.insertOne({
    file: migration.file,
    className: migration.className,
    timestamp: +new Date(),
  });
};

export const deleteMigration = async (
  collection: Collection,
  migration: MigrationObject
) => {
  await collection.deleteOne({
    className: migration.className,
  });
};

export const getAppliedMigrations = (
  collection: Collection
): Promise<MigrationModel[]> => {
  return collection.find().sort({ timestamp: -1 }).toArray();
};

export const getLastAppliedMigration = (
  collection: Collection
): Promise<MigrationModel> => {
  return collection.find({}).sort({ timestamp: -1 }).limit(1).next();
};
