import { getConfig } from '../config';
import {
  connectDatabase,
  getAppliedMigrations,
  MigrationModel
} from '../database';
import { loadMigrations, Migration } from '../migrations';
import Table from 'cli-table';

export const status = async () => {
  const { migrationsDir, migrationsCollection } = getConfig();
  const connection = await connectDatabase();
  const collection = connection.db.collection(migrationsCollection);
  const appliedMigrations = await getAppliedMigrations(collection);
  const notAppliedMigrations = (await loadMigrations(migrationsDir)).filter(
    (migration: Migration) =>
      appliedMigrations.find(
        (m: MigrationModel) => m.className === migration.className
      ) === undefined
  );

  const table = new Table({
    head: ['Migration', 'Status', 'Timestamp']
  });

  appliedMigrations.map((migration: MigrationModel) => {
    table.push([migration.className, 'up', migration.timestamp]);
  });

  notAppliedMigrations.map((migration: Migration) => {
    table.push([migration.className, 'pending', '-']);
  });

  console.log(table.toString());

  connection.client.close();
};
