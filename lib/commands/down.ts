import { Collection } from 'mongodb';
import ora from 'ora';
import { Config, processConfig } from '../config';
import {
  deleteMigration,
  getAppliedMigrations,
  getLastAppliedMigration,
  DatabaseConnection,
  MigrationModel,
  mongoConnect,
} from '../database';
import { ExecuteMigrationError } from '../errors';
import { MigrationObject, loadMigrationFile } from '../migrations';
import { flatArray } from '../utils/flatArray';

interface CommandDownOptions {
  config: Config;
  mode: 'all' | 'last';
}

const downLastAppliedMigration = async (
  connection: DatabaseConnection,
  collection: Collection<MigrationModel>
): Promise<void> => {
  const spinner = ora(`Undoing last migration`).start();
  const lastApplied = await getLastAppliedMigration(collection);

  if (!lastApplied) {
    spinner.warn(`No migrations found`).stop();
    return;
  }

  spinner.text = `Undoing migration ${lastApplied.className}`;
  const migrationFile = await loadMigrationFile(lastApplied.file);
  const migration = migrationFile.find(
    (m: MigrationObject) => m.className === lastApplied.className
  );

  if (!migration) {
    throw new Error(`Migration (${lastApplied.className}) not found`);
  }
  try {
    await migration.instance.down(connection.db);
    await deleteMigration(collection, migration);
    spinner.succeed(`Migration ${lastApplied.className} down`).stop();
  } catch (e) {
    spinner.fail(`Error down migration ${lastApplied.className}`);
    throw new ExecuteMigrationError(e);
  }
};

const downAll = async (
  connection: DatabaseConnection,
  collection: Collection<MigrationModel>
): Promise<void> => {
  const spinner = ora(`Undoing all migrations`).start();
  const appliedMigrations = await getAppliedMigrations(collection);

  if (appliedMigrations.length === 0) {
    spinner.warn(`No migrations found`).stop();
    return;
  }

  const migrationsToUndo = await Promise.all(
    appliedMigrations.map(async (migration: MigrationModel) => {
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
    try {
      await migration.instance.down(connection.db);
      await deleteMigration(collection, migration);
      localSpinner.succeed(`Migration ${migration.className} down`).stop();
    } catch (e) {
      localSpinner.fail(`Error down migration ${migration.className}`);
      throw new ExecuteMigrationError(e);
    }
  }

  spinner.succeed('All migrations down').stop();
};

export const down = async ({
  mode,
  config,
}: CommandDownOptions): Promise<void> => {
  const { uri, database, options, migrationsCollection } =
    processConfig(config);
  const connection = await mongoConnect(uri, database, options);
  const collection = connection.getMigrationsCollection(migrationsCollection);
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
