import { Collection } from 'mongodb';
import ora from 'ora';
import { IConfig, processConfig } from '../config';
import {
  deleteMigration,
  getAppliedMigrations,
  getLastAppliedMigration,
  IConnection,
  IMigrationModel,
  mongoConnect
} from '../database';
import { IMigration, loadMigrationFile } from '../migrations';
import { flatArray } from '../utils/flatArray';

interface IOptions {
  config: IConfig;
  mode: 'all' | 'last';
}

export const down = async ({ mode, config }: IOptions) => {
  const {
    uri,
    database,
    options,
    migrationsCollection,
    migrationsDir
  } = processConfig(config);

  const connection = await mongoConnect(uri, database, options);
  const collection = connection.db.collection(migrationsCollection);
  // down all migrations
  try {
    if (mode === 'all') {
      downAll(connection, collection);
    }

    // down last applied migration
    if (mode === 'last') {
      downLastAppliedMigration(connection, collection);
    }
  } finally {
    connection.client.close();
  }
};

const downAll = async (connection: IConnection, collection: Collection) => {
  const appliedMigrations = await getAppliedMigrations(collection);

  const migrationsToUndo = await Promise.all(
    appliedMigrations.map(async (migration: IMigrationModel) => {
      const m = await loadMigrationFile(`${migration.file}`);
      if (m && m.length === 0) {
        throw new Error(
          `Can undo migration ${migration.className}, no class found`
        );
      }

      return m;
    })
  );

  await Promise.all(
    flatArray(migrationsToUndo).map(async (migration: IMigration) => {
      const spinner = ora('Undoing migrations').start();
      await migration.instance.down(connection.db);
      await deleteMigration(collection, migration);
      spinner.succeed(`Migration ${migration.className} down`).stop();
    })
  );
};

const downLastAppliedMigration = async (
  connection: IConnection,
  collection: Collection
) => {
  const lastApplied = await getLastAppliedMigration(collection);
  const spinner = ora(`Undoing migration ${lastApplied.className}`).start();
  const migrationFile = await loadMigrationFile(lastApplied.file);
  const migration = migrationFile.find(
    (m: IMigration) => m.className === lastApplied.className
  );

  if (!migration) {
    throw new Error(`Migration (${lastApplied.className}) not found`);
  }

  await migration.instance.down(connection.db);
  await deleteMigration(collection, migration);
  spinner.succeed(`Migration ${lastApplied.className} down`).stop();
};
