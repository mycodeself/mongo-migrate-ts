import ora from 'ora';
import { Config, processConfig } from '../config';
import {
  getAppliedMigrations,
  MigrationModel,
  insertMigration,
  mongoConnect,
} from '../database';
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
  } = processConfig(opts.config);
  const connection = await mongoConnect(uri, database, options);
  const spinner = ora('Migrations up').start();

  try {
    const collection = connection.db.collection(migrationsCollection);
    const appliedMigrations = await getAppliedMigrations(collection);
    const migrations = (await loadMigrations(migrationsDir)).filter(
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
      await migration.instance.up(connection.db);
      await insertMigration(collection, migration);
      localSpinner.succeed(`Migration ${migration.className} up`).stop();
    }

    spinner.succeed(`${migrations.length} migrations up`).stop();
  } finally {
    connection.client.close();
  }
};
