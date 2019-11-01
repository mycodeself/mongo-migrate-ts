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
  } = opts.config; // processConfig(opts.config);
  const connection = await mongoConnect(uri!, database!, options);
  const collection = connection.db.collection(migrationsCollection);
  const appliedMigrations = await getAppliedMigrations(collection);
  const migrations = (await loadMigrations(migrationsDir)).filter(
    (migration: IMigration) =>
      appliedMigrations.find(
        (m: IMigrationModel) => m.className === migration.className
      ) === undefined
  );

  await Promise.all(
    migrations.map(async (migration: IMigration) => {
      const spinner = ora('Applying migrations').start();
      await migration.instance.up(connection.db);
      await insertMigration(collection, migration);
      spinner.succeed(`Migration ${migration.className} applied`).stop();
    })
  );

  connection.client.close();
};
