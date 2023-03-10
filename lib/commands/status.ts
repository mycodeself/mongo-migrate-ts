import cliTable from 'cli-table';
import { Config, processConfig } from '../config';
import {
  getAppliedMigrations,
  MigrationModel,
  mongoConnect,
} from '../database';
import { MigrationObject, loadMigrations } from '../migrations';

interface CommandStatusOptions {
  config: Config;
}

export const status = async (opts: CommandStatusOptions) => {
  const { uri, database, options, migrationsCollection, migrationsDir } =
    processConfig(opts.config);
  const connection = await mongoConnect(uri, database, options);
  try {
    const collection = connection.getMigrationsCollection(migrationsCollection);

    const appliedMigrations = await getAppliedMigrations(collection);

    const notAppliedMigrations = (await loadMigrations(migrationsDir)).filter(
      (migration: MigrationObject) =>
        appliedMigrations.find(
          (m: MigrationModel) => m.className === migration.className
        ) === undefined
    );

    const table = new cliTable({
      head: ['Migration', 'Status', 'Timestamp'],
      colWidths: [100, 200],
    });

    appliedMigrations.map((migration: MigrationModel) => {
      table.push([migration.className, 'up', migration.timestamp.toString()]);
    });

    notAppliedMigrations.map((migration: MigrationObject) => {
      table.push([migration.className, 'pending', '-']);
    });

    console.log(table.toString());
  } finally {
    connection.client.close();
  }
};
