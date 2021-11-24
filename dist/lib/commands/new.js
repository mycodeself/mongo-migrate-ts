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
exports.newCommand = exports.migrationTemplate = void 0;
const fs = __importStar(require('fs'));
const migrationTemplate = (className) => {
  return `import { Db } from 'mongodb'
import { MigrationInterface } from 'mongo-migrate-ts';

export class ${className} implements MigrationInterface {
  public async up(db: Db): Promise<any> {
  }

  public async down(db: Db): Promise<any> {
  }
}
`;
};
exports.migrationTemplate = migrationTemplate;
const newCommand = (opts) => {
  const { migrationName, migrationsDir } = opts;
  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir);
  }
  const fileName = `${+new Date()}_${migrationName || 'Migration'}`;
  const className = `${migrationName || 'Migration'}${+new Date()}`;
  const template = exports.migrationTemplate(className);
  const migrationPath = `${migrationsDir}/${fileName}.ts`;
  fs.writeFileSync(migrationPath, template);
  return migrationPath;
};
exports.newCommand = newCommand;
//# sourceMappingURL=new.js.map
