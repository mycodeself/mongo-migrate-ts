import ora from 'ora';
import { getConfig } from '../config';
import {
  connectDatabase,
  getAppliedMigrations,
  IMigrationModel,
  insertMigration
} from '../database';
import { IMigration, loadMigrations } from '../migrations';

export const up = async () => {
  const { migrationsDir, migrationsCollection } = getConfig();
  const connection = await connectDatabase();
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
