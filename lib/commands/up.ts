import ora from 'ora';
import { Config, processConfig } from '../config';
import {
  DatabaseConnection,
  MigrationModel,
  getAppliedMigrations,
  insertMigration,
  mongoConnect,
} from '../database';
import { DbConnectionError, ExecuteMigrationError } from '../errors';
import { MigrationObject, loadMigrations } from '../migrations';

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
    globPattern,
    globOptions,
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
    const migrationObjs = await loadMigrations(
      migrationsDir,
      globPattern,
      globOptions
    );
    const migrations = migrationObjs
      .filter(
        (migration: MigrationObject) =>
          appliedMigrations.find(
            (m: MigrationModel) => m.className === migration.className
          ) === undefined
      )
      .sort((a, b): number => {
        // sort migrations by timestamp before applying
        const aTimestamp = Number(
          a.className.substring(a.className.length - 13)
        );
        const bTimestamp = Number(
          b.className.substring(a.className.length - 13)
        );
        return aTimestamp > bTimestamp ? 1 : -1;
      });

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
