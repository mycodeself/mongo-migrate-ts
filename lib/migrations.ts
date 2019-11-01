import * as fs from 'fs';
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
  const migrations = Promise.all(
    fs
      .readdirSync(migrationsDir)
      .filter((file: string) => fileExt.test(file))
      .map((file: string) => loadMigrationFile(`${migrationsDir}/${file}`))
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

  const classes = await import(`${process.env.PWD}/${filePath}`);

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
