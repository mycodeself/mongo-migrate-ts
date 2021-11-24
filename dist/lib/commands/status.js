'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.status = void 0;
const cli_table_1 = __importDefault(require('cli-table'));
const config_1 = require('../config');
const database_1 = require('../database');
const migrations_1 = require('../migrations');
const status = async (opts) => {
  const { uri, database, options, migrationsCollection, migrationsDir } =
    config_1.processConfig(opts.config);
  const connection = await database_1.mongoConnect(uri, database, options);
  try {
    const collection = connection.db.collection(migrationsCollection);
    const appliedMigrations = await database_1.getAppliedMigrations(collection);
    const notAppliedMigrations = (
      await migrations_1.loadMigrations(migrationsDir)
    ).filter(
      (migration) =>
        appliedMigrations.find((m) => m.className === migration.className) ===
        undefined
    );
    const table = new cli_table_1.default({
      head: ['Migration', 'Status', 'Timestamp'],
    });
    appliedMigrations.map((migration) => {
      table.push([migration.className, 'up', migration.timestamp]);
    });
    notAppliedMigrations.map((migration) => {
      table.push([migration.className, 'pending', '-']);
    });
    console.log(table.toString());
  } finally {
    connection.client.close();
  }
};
exports.status = status;
//# sourceMappingURL=status.js.map
