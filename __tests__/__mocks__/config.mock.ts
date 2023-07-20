import { Config } from '../../lib/config';

export const configMock: Config = {
  uri: 'mongodb://username:password@host:27017',
  database: 'db',
  options: {},
  migrationsDir: 'migrations',
  migrationsCollection: 'migrations_changelog',
  fileExt: '.migration.ts',
};
