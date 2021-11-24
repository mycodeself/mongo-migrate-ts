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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.init = void 0;
const fs = __importStar(require('fs'));
const path = __importStar(require('path'));
const config_1 = require('../config');
const ora_1 = __importDefault(require('ora'));
const initConfig = {
  uri: 'mongodb://username:password@host:27017',
  database: 'db',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  migrationsDir: 'migrations',
  migrationsCollection: 'migrations_changelog',
};
const init = () => {
  const configPath = config_1.getDefaultConfigPath();
  const spinner = ora_1.default('Initializing config').start();
  const migrationsDir = path.join(
    config_1.getCurrentWorkingDirectory(),
    initConfig.migrationsDir
  );
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir);
  }
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify(initConfig, null, 2));
  }
  spinner.succeed('Config initialized').stop();
};
exports.init = init;
//# sourceMappingURL=init.js.map
