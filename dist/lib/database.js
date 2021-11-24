'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getLastAppliedMigration =
  exports.getAppliedMigrations =
  exports.deleteMigration =
  exports.insertMigration =
  exports.mongoConnect =
    void 0;
const mongodb_1 = require('mongodb');
const mongoConnect = async (uri, database, options) => {
  const client = await mongodb_1.MongoClient.connect(uri, options);
  const db = client.db(database);
  return {
    client,
    db,
  };
};
exports.mongoConnect = mongoConnect;
const insertMigration = async (collection, migration) => {
  await collection.insertOne({
    file: migration.file,
    className: migration.className,
    timestamp: +new Date(),
  });
};
exports.insertMigration = insertMigration;
const deleteMigration = async (collection, migration) => {
  await collection.deleteOne({
    className: migration.className,
  });
};
exports.deleteMigration = deleteMigration;
const getAppliedMigrations = (collection) => {
  return collection.find().sort({ timestamp: -1 }).toArray();
};
exports.getAppliedMigrations = getAppliedMigrations;
const getLastAppliedMigration = (collection) => {
  return collection.find({}).sort({ timestamp: -1 }).limit(1).next();
};
exports.getLastAppliedMigration = getLastAppliedMigration;
//# sourceMappingURL=database.js.map
