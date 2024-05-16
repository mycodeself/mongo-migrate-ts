import * as fs from 'fs';
import { TemplateFileNotFoundError } from '../errors';
import { timestamp } from '../utils/timestamp';

interface CommandNewOptions {
  migrationsDir: string;
  migrationName?: string;
  migrationNameTimestampFormat: string;
  templateFile?: string;
}

export const defaultMigrationTemplate = (className: string) => {
  return `import { Db, MongoClient } from 'mongodb';
import { MigrationInterface } from 'mongo-migrate-ts';

export class ${className} implements MigrationInterface {
  public async up(db: Db, client: MongoClient): Promise<void | never> { {
  }

  public async down(db: Db, client: MongoClient): Promise<void | never> {
  }
}
`;
};

export const getMigrationTemplate = (
  className: string,
  templateFile?: string
): string => {
  if (!templateFile) {
    return defaultMigrationTemplate(className);
  }

  if (fs.existsSync(templateFile)) {
    const template: string = fs.readFileSync(templateFile).toString();
    return template.replace(/class (\S*) /, `class ${className} `);
  }

  throw new TemplateFileNotFoundError(
    `Template file ${templateFile} not found`
  );
};

export const newCommand = (opts: CommandNewOptions): string => {
  const {
    migrationName = 'Migration',
    migrationNameTimestampFormat,
    migrationsDir,
    templateFile,
  } = opts;

  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir);
  }
  const migrationNameTimestamp = timestamp(migrationNameTimestampFormat);
  const fileName = `${migrationNameTimestamp}_${migrationName}`;
  const className = `${migrationName}${migrationNameTimestamp}`;

  const template = getMigrationTemplate(className, templateFile);

  const migrationPath = `${migrationsDir}/${fileName}.ts`;

  fs.writeFileSync(migrationPath, template);

  return migrationPath;
};
