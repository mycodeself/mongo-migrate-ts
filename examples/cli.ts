import { mongoMigrateCli } from '../lib';

mongoMigrateCli({
  uri: 'mongodb://admin:admin@127.0.0.1:27017',
  database: 'db',
  migrationsDir: `${__dirname}/migrations`,
  migrationsCollection: 'migrations_collection',
});
