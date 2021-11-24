'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.loadMigrations = exports.loadMigrationFile = void 0;
const fs = __importStar(require('fs'));
const path = __importStar(require('path'));
const flatArray_1 = require('./utils/flatArray');
const isTsNode_1 = require('./utils/isTsNode');
const isMigration = (obj) => {
  return (
    obj &&
    obj.up &&
    obj.down &&
    typeof obj.up === 'function' &&
    typeof obj.down === 'function'
  );
};
const loadMigrationFile = async (filePath) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File ${filePath} not exists.`);
  }
  const classes = await Promise.resolve().then(() =>
    __importStar(require(path.resolve(filePath)))
  );
  return Object.keys(classes)
    .filter((key) => typeof classes[key] === 'function')
    .map((key) => {
      return {
        file: filePath,
        className: key,
        instance: new classes[key](),
      };
    })
    .filter((migration) => isMigration(migration.instance));
};
exports.loadMigrationFile = loadMigrationFile;
const loadMigrations = async (migrationsDir) => {
  const fileExt = isTsNode_1.isTsNode()
    ? new RegExp(/\.ts$/i)
    : new RegExp(/\.js$/i);
  const migrations = Promise.all(
    fs
      .readdirSync(migrationsDir)
      .filter((file) => fileExt.test(file))
      .map((file) => exports.loadMigrationFile(`${migrationsDir}/${file}`))
  );
  // flat migrations because in one file can be more than one migration
  const flatMigrations = flatArray_1.flatArray(await migrations);
  return flatMigrations;
};
exports.loadMigrations = loadMigrations;
//# sourceMappingURL=migrations.js.map
