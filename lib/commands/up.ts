import ora from 'ora';
import { Config, processConfig } from '../config';
import {
  getAppliedMigrations,
  MigrationModel,
  insertMigration,
  mongoConnect,
  DatabaseConnection,
} from '../database';
import { MigrationObject, loadMigrations } from '../migrations';
import { ExecuteMigrationError, DbConnectionError } from '../errors';

interface CommandUpOptions {
  config: Config;
}

export const up = async (opts: CommandUpOptions): Promise<void> => {
  const {
    uri,
    database,
    options,
    migrationsCollection,
    migrationsDir,
    fileExt,
  } = processConfig(opts.config);
  let connection: DatabaseConnection;
  try {
    connection = await mongoConnect(uri, database, options);
  } catch (e) {
    throw new DbConnectionError(e);
  }
  const spinner = ora('Migrations up').start();

  try {
    const collection = connection.getMigrationsCollection(migrationsCollection);
    const appliedMigrations = await getAppliedMigrations(collection);
    const migrations = (await loadMigrations(migrationsDir, fileExt)).filter(
      (migration: MigrationObject) =>
        appliedMigrations.find(
          (m: MigrationModel) => m.className === migration.className
        ) === undefined
    );

    if (migrations.length === 0) {
      spinner.warn('No migrations found').stop();
      return;
    }

    for await (const migration of migrations) {
      const localSpinner = ora(
        `Applying migration ${migration.className}`
      ).start();
      try {
        await migration.instance.up(connection.db, connection.client);
        await insertMigration(collection, migration);
        localSpinner.succeed(`Migration ${migration.className} up`).stop();
      } catch (e) {
        localSpinner.fail(`Error executing migration ${migration.className}`);
        throw new ExecuteMigrationError(e);
      }
    }
    spinner.succeed(`${migrations.length} migrations up`).stop();
  } catch (e) {
    spinner.fail('Error executing migrations');
    await connection.client.close(true);
    throw e;
  } finally {
    await connection.client.close(true);
  }
};
