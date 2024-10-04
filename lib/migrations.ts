import * as fs from 'fs';
import { GlobOptions, glob } from 'glob';
import * as path from 'path';
import { MigrationInterface } from './MigrationInterface';
import { flatArray } from './utils/flatArray';

export interface MigrationObject {
  file: string;
  className: string;
  instance: MigrationInterface;
}

const isMigration = (obj: any): boolean => {
  return (
    obj &&
    obj.up &&
    obj.down &&
    typeof obj.up === 'function' &&
    typeof obj.down === 'function'
  );
};

export const loadMigrationFile = async (
  migrationsDir: string,
  filePath: string,
): Promise<MigrationObject[]> => {

  const absoluteFilePath = path.resolve(migrationsDir, filePath);

  if (!fs.existsSync(absoluteFilePath)) {
    throw new Error(`File ${absoluteFilePath} does not exist.`);
  }

  const classes = await import(path.resolve(absoluteFilePath));

  return Object.keys(classes)
    .filter((key: string) => typeof classes[key] === 'function')
    .map((key: string) => {
      return {
        file: filePath,
        className: key,
        instance: new classes[key](),
      };
    })
    .filter((migration: MigrationObject) => isMigration(migration.instance));
};

export const loadMigrations = async (
  migrationsDir: string,
  globPattern: string,
  globOptions: GlobOptions
): Promise<MigrationObject[]> => {
  const paths = await glob(globPattern, globOptions);

  const migrations = await Promise.all(
    paths
      .map((path) => (typeof path === 'string' ? path : path.fullpath()))
      .map((path) => loadMigrationFile(migrationsDir, path))
  );

  // flat migrations because in one file can be more than one migration
  const flatMigrations = flatArray(migrations);

  return flatMigrations;
};
