'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.up = void 0;
const ora_1 = __importDefault(require('ora'));
const config_1 = require('../config');
const database_1 = require('../database');
const migrations_1 = require('../migrations');
const errors_1 = require('../errors');
const up = async (opts) => {
  const { uri, database, options, migrationsCollection, migrationsDir } =
    config_1.processConfig(opts.config);
  let connection;
  try {
    connection = await database_1.mongoConnect(uri, database, options);
  } catch (e) {
    throw new errors_1.DbConnectionError(e);
  }
  const spinner = ora_1.default('Migrations up').start();
  try {
    const collection = connection.db.collection(migrationsCollection);
    const appliedMigrations = await database_1.getAppliedMigrations(collection);
    const migrations = (
      await migrations_1.loadMigrations(migrationsDir)
    ).filter(
      (migration) =>
        appliedMigrations.find((m) => m.className === migration.className) ===
        undefined
    );
    if (migrations.length === 0) {
      spinner.warn('No migrations found').stop();
      return;
    }
    for await (const migration of migrations) {
      const localSpinner = ora_1
        .default(`Applying migration ${migration.className}`)
        .start();
      try {
        await migration.instance.up(connection.db);
        await database_1.insertMigration(collection, migration);
        localSpinner.succeed(`Migration ${migration.className} up`).stop();
      } catch (e) {
        localSpinner.fail(`Error executing migration ${migration.className}`);
        throw new errors_1.ExecuteMigrationError(e);
      }
    }
    spinner.succeed(`${migrations.length} migrations up`).stop();
  } catch (e) {
    spinner.fail('Error executing migrations');
    await connection.client.close(true);
    throw e;
  } finally {
    await connection.client.close(true);
  }
};
exports.up = up;
//# sourceMappingURL=up.js.map
