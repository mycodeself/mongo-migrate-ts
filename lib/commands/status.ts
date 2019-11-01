import cliTable from 'cli-table';
import { IConfig, processConfig } from '../config';
import {
  getAppliedMigrations,
  IMigrationModel,
  mongoConnect
} from '../database';
import { IMigration, loadMigrations } from '../migrations';

interface IOptions {
  config: IConfig;
}

export const status = async (opts: IOptions) => {
  const {
    uri,
    database,
    options,
    migrationsCollection,
    migrationsDir
  } = processConfig(opts.config);
  const connection = await mongoConnect(uri, database, options);
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
