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
exports.processConfig =
  exports.getDefaultMigrationsDir =
  exports.getDefaultConfigPath =
  exports.getCurrentWorkingDirectory =
  exports.readConfigFromFile =
    void 0;
const fs = __importStar(require('fs'));
const getDbFromUri_1 = require('./utils/getDbFromUri');
const path = __importStar(require('path'));
const DEFAULT_MIGRATIONS_COLLECTION = 'migrations_changelog';
const DEFAULT_MIGRATIONS_DIR = 'migrations';
const DEFAULT_CONFIG_FILENAME = 'migrations.json';
const DEFAULT_ENV_VAR_URI = 'MONGO_MIGRATE_URI';
const DEFAULT_ENV_VAR_DB = 'MONGO_MIGRATE_DB';
const readConfigFromFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Config file ${filePath} not found.`);
  }
  const rawConfig = fs.readFileSync(filePath).toString();
  const config = JSON.parse(rawConfig);
  return config;
};
exports.readConfigFromFile = readConfigFromFile;
const getCurrentWorkingDirectory = () => process.env.PWD || process.cwd();
exports.getCurrentWorkingDirectory = getCurrentWorkingDirectory;
const getDefaultConfigPath = () =>
  path.join(exports.getCurrentWorkingDirectory(), DEFAULT_CONFIG_FILENAME);
exports.getDefaultConfigPath = getDefaultConfigPath;
const getDefaultMigrationsDir = () =>
  path.join(exports.getCurrentWorkingDirectory(), DEFAULT_MIGRATIONS_DIR);
exports.getDefaultMigrationsDir = getDefaultMigrationsDir;
const getConfigFromEnv = (config) => {
  const uriVarName =
    (config.environment && config.environment.uriVar) || DEFAULT_ENV_VAR_URI;
  const dbVarName =
    (config.environment && config.environment.databaseVar) ||
    DEFAULT_ENV_VAR_DB;
  const uri = process.env[uriVarName] || '';
  const database = process.env[dbVarName] || '';
  return {
    uri,
    database,
  };
};
const processConfig = (config) => {
  const dbConfig = config.useEnv
    ? getConfigFromEnv(config)
    : {
        uri: config.uri,
        database: config.database,
      };
  if (!dbConfig.uri) {
    throw new Error(`Invalid configuration, uri is empty.`);
  }
  if (!dbConfig.database) {
    dbConfig.database = getDbFromUri_1.getDbFromUri(dbConfig.uri);
    if (!dbConfig.database) {
      throw new Error(`Invalid configuration, database is empty.`);
    }
  }
  return {
    ...dbConfig,
    migrationsDir: config.migrationsDir,
    migrationsCollection:
      config.migrationsCollection || DEFAULT_MIGRATIONS_COLLECTION,
    options: config.options,
  };
};
exports.processConfig = processConfig;
//# sourceMappingURL=config.js.map
