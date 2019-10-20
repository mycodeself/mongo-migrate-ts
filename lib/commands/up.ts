import { getConfig } from '../config';
import {
  connectDatabase,
  insertMigration,
  getAppliedMigrations,
  MigrationModel
} from '../database';
import ora from 'ora';
import { loadMigrations, Migration } from '../migrations';

export const up = async () => {
  const { migrationsDir } = getConfig();
  const connection = await connectDatabase();
  const appliedMigrations = await getAppliedMigrations(connection);
  const migrations = (await loadMigrations(migrationsDir)).filter(
    (migration: Migration) =>
      appliedMigrations.find(
        (m: MigrationModel) => m.className === migration.className
      ) === undefined
  );

  await Promise.all(
    migrations.map(async (migration: Migration) => {
      const spinner = ora('Applying migrations').start();
      await migration.instance.up(connection.db);
      await insertMigration(connection, migration);
      spinner.succeed(`Migration ${migration.className} applied`).stop();
    })
  );

  connection.client.close();
};
