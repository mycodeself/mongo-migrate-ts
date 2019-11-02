import * as fs from 'fs';
import * as path from 'path';
import { MigrationInterface } from './MigrationInterface';
import { flatArray } from './utils/flatArray';

export interface IMigration {
  file: string;
  className: string;
  instance: MigrationInterface;
}

export const loadMigrations = async (
  migrationsDir: string
): Promise<IMigration[]> => {
  const fileExt = new RegExp(/\.(ts|js)$/i);
  const dir = path.resolve(migrationsDir);
  const migrations = Promise.all(
    fs
      .readdirSync(dir)
      .filter((file: string) => fileExt.test(file))
      .map((file: string) => loadMigrationFile(`${dir}/${file}`))
  );

  // flat migrations because in one file can be more than one migration
  const flatMigrations = flatArray(await migrations);

  return flatMigrations;
};

export const loadMigrationFile = async (
  filePath: string
): Promise<IMigration[]> => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File ${filePath} not exists.`);
  }

  const classes = await import(`${filePath}`);

  return Object.keys(classes)
    .filter((key: string) => typeof classes[key] === 'function')
    .map((key: string) => {
      return {
        file: filePath,
        className: key,
        instance: new classes[key]()
      };
    })
    .filter((migration: IMigration) => isMigration(migration.instance));
};

const isMigration = (obj: any): boolean => {
  return (
    obj &&
    obj.up &&
    obj.down &&
    typeof obj.up === 'function' &&
    typeof obj.down === 'function'
  );
};
