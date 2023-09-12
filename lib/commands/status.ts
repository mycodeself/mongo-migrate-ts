import CliTable from 'cli-table';
import { Config, processConfig } from '../config';
import {
  MigrationModel,
  getAppliedMigrations,
  mongoConnect,
} from '../database';
import { MigrationObject, loadMigrationsGlob } from '../migrations';

interface CommandStatusOptions {
  config: Config;
}

export const status = async (opts: CommandStatusOptions): Promise<void> => {
  const {
    uri,
    database,
    options,
    migrationsCollection,
    globPattern,
    globOptions,
    migrationsDir,
  } = processConfig(opts.config);
  const connection = await mongoConnect(uri, database, options);
  try {
    const collection = connection.getMigrationsCollection(migrationsCollection);

    const appliedMigrations = await getAppliedMigrations(collection);

    const notAppliedMigrations = (
      await loadMigrationsGlob(migrationsDir, globPattern, globOptions)
    ).filter(
      (migration: MigrationObject) =>
        appliedMigrations.find(
          (m: MigrationModel) => m.className === migration.className
        ) === undefined
    );

    const table = new CliTable({
      head: ['Migration', 'Status', 'Timestamp'],
      colWidths: [48, 14, 18],
    });

    appliedMigrations.map((migration: MigrationModel) => {
      table.push([migration.className, 'up', String(migration.timestamp)]);
    });

    notAppliedMigrations.map((migration: MigrationObject) => {
      table.push([migration.className, 'pending', '-']);
    });

    console.log(table.toString());
  } finally {
    await connection.client.close();
  }
};
