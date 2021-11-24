import { MigrationInterface } from './MigrationInterface';
export interface MigrationObject {
  file: string;
  className: string;
  instance: MigrationInterface;
}
export declare const loadMigrationFile: (
  filePath: string
) => Promise<MigrationObject[]>;
export declare const loadMigrations: (
  migrationsDir: string
) => Promise<MigrationObject[]>;
