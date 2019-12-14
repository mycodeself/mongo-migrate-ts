import { Collection } from 'mongodb';
import ora from 'ora';
import * as path from 'path';
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
  const { uri, database, options, migrationsCollection } = processConfig(
    config
  );
  const connection = await mongoConnect(uri, database, options);
  const collection = connection.db.collection(migrationsCollection);
  try {
    switch (mode) {
      case 'all':
        await downAll(connection, collection);
        break;
      case 'last':
        await downLastAppliedMigration(connection, collection);
        break;
    }
  } finally {
    connection.client.close();
  }
};

const downAll = async (connection: IConnection, collection: Collection) => {
  const spinner = ora(`Undoing all migrations`).start();
  const appliedMigrations = await getAppliedMigrations(collection);

  if (appliedMigrations.length === 0) {
    spinner.warn(`No migrations found`).stop();
    return;
  }

  const migrationsToUndo = await Promise.all(
    appliedMigrations.map(async (migration: IMigrationModel) => {
      const m = await loadMigrationFile(migration.file);
      if (m && m.length === 0) {
        throw new Error(
          `Can undo migration ${migration.className}, no class found`
        );
      }

      return m;
    })
  );

  for await (const migration of flatArray(migrationsToUndo)) {
    const localSpinner = ora(
      `Undoing migration ${migration.className}`
    ).start();
    await migration.instance.down(connection.db);
    await deleteMigration(collection, migration);
    localSpinner.succeed(`Migration ${migration.className} down`).stop();
  }

  spinner.succeed('All migrations down').stop();
};

const downLastAppliedMigration = async (
  connection: IConnection,
  collection: Collection
) => {
  const spinner = ora(`Undoing last migration`).start();
  const lastApplied = await getLastAppliedMigration(collection);

  if (!lastApplied) {
    spinner.warn(`No migrations found`).stop();
    return;
  }

  spinner.text = `Undoing migration ${lastApplied.className}`;
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
