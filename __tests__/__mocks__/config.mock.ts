export const configMock = {
  uri: 'mongodb://username:password@host:27017',
  database: 'db',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  migrationsDir: 'migrations',
  migrationsCollection: 'migrations_changelog'
};
