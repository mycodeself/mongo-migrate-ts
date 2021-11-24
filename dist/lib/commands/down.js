'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.down = void 0;
const ora_1 = __importDefault(require('ora'));
const config_1 = require('../config');
const database_1 = require('../database');
const migrations_1 = require('../migrations');
const flatArray_1 = require('../utils/flatArray');
const downLastAppliedMigration = async (connection, collection) => {
  const spinner = ora_1.default(`Undoing last migration`).start();
  const lastApplied = await database_1.getLastAppliedMigration(collection);
  if (!lastApplied) {
    spinner.warn(`No migrations found`).stop();
    return;
  }
  spinner.text = `Undoing migration ${lastApplied.className}`;
  const migrationFile = await migrations_1.loadMigrationFile(lastApplied.file);
  const migration = migrationFile.find(
    (m) => m.className === lastApplied.className
  );
  if (!migration) {
    throw new Error(`Migration (${lastApplied.className}) not found`);
  }
  await migration.instance.down(connection.db);
  await database_1.deleteMigration(collection, migration);
  spinner.succeed(`Migration ${lastApplied.className} down`).stop();
};
const downAll = async (connection, collection) => {
  const spinner = ora_1.default(`Undoing all migrations`).start();
  const appliedMigrations = await database_1.getAppliedMigrations(collection);
  if (appliedMigrations.length === 0) {
    spinner.warn(`No migrations found`).stop();
    return;
  }
  const migrationsToUndo = await Promise.all(
    appliedMigrations.map(async (migration) => {
      const m = await migrations_1.loadMigrationFile(migration.file);
      if (m && m.length === 0) {
        throw new Error(
          `Can undo migration ${migration.className}, no class found`
        );
      }
      return m;
    })
  );
  for await (const migration of flatArray_1.flatArray(migrationsToUndo)) {
    const localSpinner = ora_1
      .default(`Undoing migration ${migration.className}`)
      .start();
    await migration.instance.down(connection.db);
    await database_1.deleteMigration(collection, migration);
    localSpinner.succeed(`Migration ${migration.className} down`).stop();
  }
  spinner.succeed('All migrations down').stop();
};
const down = async ({ mode, config }) => {
  const { uri, database, options, migrationsCollection } =
    config_1.processConfig(config);
  const connection = await database_1.mongoConnect(uri, database, options);
  const collection = connection.db.collection(migrationsCollection);
  try {
    switch (mode) {
      case 'all':
        await downAll(connection, collection);
        break;
      case 'last':
        await downLastAppliedMigration(connection, collection);
        break;
    }
  } finally {
    connection.client.close();
  }
};
exports.down = down;
//# sourceMappingURL=down.js.map
