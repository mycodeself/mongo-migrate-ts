jest.mock('glob');

import * as glob from 'glob';
import { MigrationInterface } from '../lib/MigrationInterface';
import * as migrations from '../lib/migrations';

describe('loadMigrations', () => {
  const numberOfMigrations = 10;
  const fakeMigrationInstance: MigrationInterface = {
    up: jest.fn(),
    down: jest.fn(),
  };
  const fakeMigrations: migrations.MigrationObject[] = Array(numberOfMigrations)
    .fill(undefined)
    .map((v: migrations.MigrationObject, index: number) => ({
      className: `MigrationTest${index}`,
      file: `migrations/MigrationTest${index}.ts`,
      instance: fakeMigrationInstance,
    }));

  (glob.globSync as jest.Mock).mockReturnValue(
    fakeMigrations.map((m: migrations.MigrationObject) =>
      m.file.split('/').pop()
    )
  );

  beforeAll(() => {
    jest
      .spyOn(migrations, 'loadMigrationFile')
      .mockImplementation(async (file: string) => {
        return [
          {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            ...fakeMigrations.find(
              (m: migrations.MigrationObject) => m.file === file
            )!,
            instance: fakeMigrationInstance,
          },
        ];
      });
  });

  it('should load all .js files when not using ts-node', async () => {
    const expectedMigrations = fakeMigrations.map(
      (m: migrations.MigrationObject) => ({
        ...m,
        instance: fakeMigrationInstance,
      })
    );
    await expect(migrations.loadMigrations('migrations')).resolves.toEqual(
      expectedMigrations
    );
    await expect(glob.globSync).toHaveBeenCalledWith('**/*.js', {
      cwd: 'migrations',
    });
  });

  it('should load all .ts files when using ts-node', async () => {
    process.env.TS_NODE_DEV = 'true';
    const expectedMigrations = fakeMigrations.map(
      (m: migrations.MigrationObject) => ({
        ...m,
        instance: fakeMigrationInstance,
      })
    );
    await expect(migrations.loadMigrations('migrations')).resolves.toEqual(
      expectedMigrations
    );
    await expect(glob.globSync).toHaveBeenCalledWith('**/*.ts', {
      cwd: 'migrations',
    });
  });

  it('should load all custom glob files', async () => {
    process.env.TS_NODE_DEV = 'true';
    const customGlob = 'custom/**/*.ts';
    const customOptions = {
      ignore: 'ignore/**/*.ts',
      cwd: 'custom',
    };

    const expectedMigrations = fakeMigrations.map(
      (m: migrations.MigrationObject) => ({
        ...m,
        instance: fakeMigrationInstance,
      })
    );
    await expect(
      migrations.loadMigrations('migrations', customGlob, customOptions)
    ).resolves.toEqual(expectedMigrations);
    await expect(glob.globSync).toHaveBeenCalledWith(customGlob, customOptions);
  });
});
