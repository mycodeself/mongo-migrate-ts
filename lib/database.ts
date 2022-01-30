import { Collection, Db, MongoClient, MongoClientOptions } from 'mongodb';
import { MigrationObject } from './migrations';

export interface DatabaseConnection {
  client: MongoClient;
  db: Db;
  getMigrationsCollection: (
    collectionName: string
  ) => Collection<MigrationModel>;
}

export interface MigrationModel {
  file: string;
  className: string;
  timestamp: number;
}

export const mongoConnect = async (
  uri: string,
  database: string,
  options?: MongoClientOptions
): Promise<DatabaseConnection> => {
  const client = options
    ? await MongoClient.connect(uri, options)
    : await MongoClient.connect(uri);
  const db = client.db(database);

  return {
    client,
    db,
    getMigrationsCollection: (collectionName: string) => {
      return db.collection<MigrationModel>(collectionName);
    },
  };
};

export const insertMigration = async (
  collection: Collection<MigrationModel>,
  migration: MigrationObject
) => {
  await collection.insertOne({
    file: migration.file,
    className: migration.className,
    timestamp: +new Date(),
  });
};

export const deleteMigration = async (
  collection: Collection<MigrationModel>,
  migration: MigrationObject
) => {
  await collection.deleteOne({
    className: migration.className,
  });
};

export const getAppliedMigrations = (
  collection: Collection<MigrationModel>
): Promise<MigrationModel[]> => {
  return collection.find().sort({ timestamp: -1 }).toArray();
};

export const getLastAppliedMigration = (
  collection: Collection<MigrationModel>
): Promise<MigrationModel | null> => {
  return collection.find({}).sort({ timestamp: -1 }).limit(1).next();
};
