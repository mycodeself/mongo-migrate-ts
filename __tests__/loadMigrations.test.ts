jest.mock('fs');

import * as fs from 'fs';
import { MigrationInterface } from '../lib/MigrationInterface';
import { MigrationModel } from '../lib/database';
import * as migrations from '../lib/migrations';

describe('loadMigrations', () => {
  const fakeMigrationInstance: MigrationInterface = {
    up: jest.fn(),
    down: jest.fn(),
  };
  const fakeFilePaths = [
    // JS files
    'MigrationTest0.js',
    'MigrationTest1.js',

    // TS files
    'MigrationTest2.ts',
    'MigrationTest3.ts',

    // Custom files
    'MigrationTest4.migration',
    'MigrationTest5.migration',
  ];

  const fakeMigrations = fakeFilePaths.map(
    (v: string, index: number) =>
      ({
        _id: `${index}`,
        className: `MigrationTest${index}`,
        file: `migrations/${v}`,
        timestamp: +new Date(),
      } as MigrationModel)
  );

  beforeAll(() => {
    jest
      .spyOn(migrations, 'loadMigrationFile')
      .mockImplementation(async (file: string) => [
        {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ...fakeMigrations.find((m: MigrationModel) => m.file === file)!,
          instance: fakeMigrationInstance,
        },
      ]);
  });

  it('should load all .js files when not using ts-node', () => {
    (fs.readdirSync as jest.Mock).mockReturnValue(fakeFilePaths);

    const expectedFiles = fakeFilePaths
      .filter((file: string) => file.endsWith('.js'))
      .map((file: string) => `migrations/${file}`);

    const expectedMigrations = fakeMigrations
      .filter((m: MigrationModel) => expectedFiles.includes(m.file))
      .map((m: MigrationModel) => ({
        ...m,
        instance: fakeMigrationInstance,
      }));
    expect(migrations.loadMigrations('migrations')).resolves.toEqual(
      expectedMigrations
    );
  });

  it('should load all .ts files when using ts-node', () => {
    process.env.TS_NODE_DEV = 'true';
    (fs.readdirSync as jest.Mock).mockReturnValue(fakeFilePaths);

    const expectedFiles = fakeFilePaths
      .filter((file: string) => file.endsWith('.ts'))
      .map((file: string) => `migrations/${file}`);

    const expectedMigrations = fakeMigrations
      .filter((m: MigrationModel) => expectedFiles.includes(m.file))
      .map((m: MigrationModel) => ({
        ...m,
        instance: fakeMigrationInstance,
      }));
    expect(migrations.loadMigrations('migrations')).resolves.toEqual(
      expectedMigrations
    );
  });

  it('should load all custom files when extension is specified', () => {
    process.env.TS_NODE_DEV = 'true';
    (fs.readdirSync as jest.Mock).mockReturnValue(fakeFilePaths);

    const expectedFiles = fakeFilePaths
      .filter((file: string) => file.endsWith('.migration'))
      .map((file: string) => `migrations/${file}`);

    const expectedMigrations = fakeMigrations
      .filter((m: MigrationModel) => expectedFiles.includes(m.file))
      .map((m: MigrationModel) => ({
        ...m,
        instance: fakeMigrationInstance,
      }));
    expect(
      migrations.loadMigrations('migrations', '.migration')
    ).resolves.toEqual(expectedMigrations);
  });
});
