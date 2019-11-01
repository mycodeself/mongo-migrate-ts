import * as fs from 'fs';

interface IOptions {
  migrationsDir: string;
  migrationName: string;
}

export const newCommand = (opts: IOptions): string => {
  const { migrationName, migrationsDir } = opts;

  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir);
  }

  const className = `M${+new Date()}_${migrationName}`;
  const template = migrationTemplate(className);
  const migrationPath = `${migrationsDir}/${className}.ts`;

  fs.writeFileSync(migrationPath, template);

  return migrationPath;
};

export const migrationTemplate = (className: string) => {
  return `import { MigrationInterface } from "mongo-migrate-ts";
import { Db } from 'mongodb';

export class ${className} implements MigrationInterface {

  public async up(db: Db): Promise<any> {
  }

  public async down(db: Db): Promise<any> {
  }

}
`;
};
