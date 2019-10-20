import * as fs from 'fs';
import { MigrationInterface } from './MigrationInterface';

export interface Migration {
  file: string;
  className: string;
  instance: MigrationInterface;
}

export const loadMigrations = async (
  migrationsDir: string
): Promise<Migration[]> => {
  const fileExt = new RegExp(/\.(ts|js)$/i);
  const migrationsObj = Promise.all(
    fs
      .readdirSync(migrationsDir)
      .filter((file: string) => fileExt.test(file))
      .map((file: string) => loadMigrationFile(`${migrationsDir}/${file}`))
  );

  const flatMigrations = [].concat(...((await migrationsObj) as Array<[]>));
  const migrations = flatMigrations.filter((m: any) => isMigration(m.instance));

  return migrations;
};

export const loadMigrationFile = async (
  filePath: string
): Promise<Migration[]> => {
  const classes = await import(filePath);

  return Object.keys(classes).map((key: string) => ({
    file: filePath,
    className: key,
    instance: new classes[key]()
  }));
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
