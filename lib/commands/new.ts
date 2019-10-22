import * as fs from 'fs';
import { getConfig } from '../config';

interface IOptions {
  migrationName: string;
}

export const newCommand = (options: IOptions): string => {
  const { migrationName } = options;
  const { migrationsDir } = getConfig();

  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir);
  }

  const className = `M${+new Date()}_${migrationName}`;
  const template = migrationTemplate(className);
  const migrationPath = `${migrationsDir}/${className}.ts`;

  fs.writeFileSync(migrationPath, template);

  return migrationPath;
};

const migrationTemplate = (className: string) => {
  return `import { MigrationInterface, Db } from "mongo-migrate-ts";

    export class ${className} implements MigrationInterface {

        public async up(db: Db): Promise<any> {
        }

        public async down(db: Db): Promise<any> {
        }

    }
    `;
};
