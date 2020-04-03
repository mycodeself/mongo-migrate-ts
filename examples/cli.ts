import { mongoMigrateCli } from '../lib';

mongoMigrateCli({
  uri: 'mongodb://admin:admin@0.0.0.0:27017',
  database: 'db',
  migrationsDir: `${__dirname}/migrations`,
  migrationsCollection: 'migrations_collection',
  options: {
    useUnifiedTopology: true,
  },
});
