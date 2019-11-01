import ora from 'ora';
import { IConfig, processConfig } from '../config';
import {
  getAppliedMigrations,
  IMigrationModel,
  insertMigration,
  mongoConnect
} from '../database';
import { IMigration, loadMigrations } from '../migrations';

interface IOptions {
  config: IConfig;
}

export const up = async (opts: IOptions) => {
  const {
    uri,
    database,
    options,
    migrationsCollection,
    migrationsDir
  } = processConfig(opts.config);
  const connection = await mongoConnect(uri, database, options);
  const spinner = ora('Migrations up').start();

  try {
    const collection = connection.db.collection(migrationsCollection);
    const appliedMigrations = await getAppliedMigrations(collection);
    const migrations = (await loadMigrations(migrationsDir)).filter(
      (migration: IMigration) =>
        appliedMigrations.find(
          (m: IMigrationModel) => m.className === migration.className
        ) === undefined
    );

    if (migrations.length === 0) {
      spinner.warn('No migrations found').stop();
      return;
    }

    await Promise.all(
      migrations.map(async (migration: IMigration) => {
        const localSpinner = ora(
          `Applying migration ${migration.className}`
        ).start();
        await migration.instance.up(connection.db);
        await insertMigration(collection, migration);
        localSpinner.succeed(`Migration ${migration.className} up`).stop();
      })
    );

    spinner.succeed(`${migrations.length} migrations up`).stop();
  } finally {
    connection.client.close();
  }
};
