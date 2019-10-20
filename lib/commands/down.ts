import { getConfig } from '../config';
import {
  connectDatabase,
  getAppliedMigrations,
  MigrationModel,
  deleteMigration
} from '../database';
import ora from 'ora';
import { Migration, loadMigrations } from '../migrations';

interface Options {}

export const down = async (options?: Options) => {
  const { migrationsDir } = getConfig();
  const connection = await connectDatabase();
  const appliedMigrations = await getAppliedMigrations(connection);
  const migrations = (await loadMigrations(migrationsDir)).filter(
    (migration: Migration) =>
      appliedMigrations.find(
        (m: MigrationModel) => m.className === migration.className
      ) !== undefined
  );

  await Promise.all(
    migrations.map(async (migration: Migration) => {
      const spinner = ora('Undoing migrations').start();
      await migration.instance.down(connection.db);
      await deleteMigration(connection, migration);
      spinner.succeed(`Migration ${migration.className} down`).stop();
    })
  );

  connection.client.close();
};
