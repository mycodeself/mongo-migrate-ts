import * as fs from 'fs';
import { TemplateFileNotFoundError } from '../errors';

interface CommandNewOptions {
  migrationsDir: string;
  migrationName?: string;
  templateFile?: string;
  fileExt?: string;
}

export const defaultMigrationTemplate = (className: string) => {
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
  const { migrationName, migrationsDir, templateFile, fileExt } = opts;

  if (!fs.existsSync(migrationsDir)) {
    fs.mkdirSync(migrationsDir);
  }
  const fileName = `${+new Date()}_${migrationName || 'Migration'}`;
  const className = `${migrationName || 'Migration'}${+new Date()}`;

  const template = getMigrationTemplate(className, templateFile);

  const ext = fileExt ?? '.ts';
  const migrationPath = `${migrationsDir}/${fileName}${ext}`;

  fs.writeFileSync(migrationPath, template);

  return migrationPath;
};
