import { getConfig } from '../config';
import {
  connectDatabase,
  getAppliedMigrations,
  MigrationModel,
  deleteMigration,
  getLastAppliedMigration
} from '../database';
import ora from 'ora';
import { Migration, loadMigrations, loadMigrationFile } from '../migrations';
import { flatArray } from '../utils/flatArray';

interface Options {
  mode: 'all' | 'last';
}

export const down = async ({ mode }: Options) => {
  const { migrationsDir, migrationsCollection } = getConfig();
  const connection = await connectDatabase();
  const collection = connection.db.collection(migrationsCollection);
  // down all migrations
  if (mode === 'all') {
    const appliedMigrations = await getAppliedMigrations(collection);

    const migrationsToUndo = await Promise.all(
      appliedMigrations.map(async (migration: MigrationModel) => {
        const m = await loadMigrationFile(`${migration.file}`);
        if (m && m.length === 0) {
          throw new Error(
            `Can undo migration ${migration.className}, no class found`
          );
        }

        return m;
      })
    );

    await Promise.all(
      flatArray(migrationsToUndo).map(async (migration: Migration) => {
        const spinner = ora('Undoing migrations').start();
        await migration.instance.down(connection.db);
        await deleteMigration(collection, migration);
        spinner.succeed(`Migration ${migration.className} down`).stop();
      })
    );
  }

  // down last applied migration
  if (mode === 'last') {
    const lastApplied = await getLastAppliedMigration(collection);
    const spinner = ora(`Undoing migration ${lastApplied.className}`).start();
    const migrationFile = await loadMigrationFile(lastApplied.file);
    const migration = migrationFile.find(
      (migration: Migration) => migration.className === lastApplied.className
    );

    if (!migration) {
      throw new Error(`Migration (${lastApplied.className}) not found`);
    }

    await migration.instance.down(connection.db);
    await deleteMigration(collection, migration);
    spinner.succeed(`Migration ${lastApplied.className} down`).stop();
  }

  connection.client.close();
};
