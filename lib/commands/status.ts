import cliTable from 'cli-table';
import { getConfig } from '../config';
import {
  connectDatabase,
  getAppliedMigrations,
  IMigrationModel
} from '../database';
import { IMigration, loadMigrations } from '../migrations';

export const status = async () => {
  const { migrationsDir, migrationsCollection } = getConfig();
  const connection = await connectDatabase();
  const collection = connection.db.collection(migrationsCollection);
  const appliedMigrations = await getAppliedMigrations(collection);

  const notAppliedMigrations = (await loadMigrations(migrationsDir)).filter(
    (migration: IMigration) =>
      appliedMigrations.find(
        (m: IMigrationModel) => m.className === migration.className
      ) === undefined
  );

  const table = new cliTable({
    head: ['Migration', 'Status', 'Timestamp']
  });

  appliedMigrations.map((migration: IMigrationModel) => {
    table.push([migration.className, 'up', migration.timestamp]);
  });

  notAppliedMigrations.map((migration: IMigration) => {
    table.push([migration.className, 'pending', '-']);
  });

  console.log(table.toString());

  connection.client.close();
};
