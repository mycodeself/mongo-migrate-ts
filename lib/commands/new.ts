import * as fs from 'fs';

interface CommandNewOptions {
  migrationsDir: string;
  migrationName?: string;
}

export const migrationTemplate = (className: string) => {
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

export const newCommand = (opts: CommandNewOptions): string => {
  const { migrationName, migrationsDir } = opts;

  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir);
  }

  const fileName = `${+new Date()}_${migrationName || 'Migration'}`;
  const className = `${migrationName || 'Migration'}${+new Date()}`;
  const template = migrationTemplate(className);
  const migrationPath = `${migrationsDir}/${fileName}.ts`;

  fs.writeFileSync(migrationPath, template);

  return migrationPath;
};
