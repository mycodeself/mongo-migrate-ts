jest.mock('../lib/database');
jest.mock('../lib/migrations');

import { oraMock } from './__mocks__/ora.mock';
jest.mock('ora', () => {
  return jest.fn().mockImplementation(oraMock);
});

import { up } from '../lib/commands/up';
import {
  getAppliedMigrations,
  MigrationModel,
  insertMigration,
  mongoConnect,
} from '../lib/database';
import { MigrationInterface } from '../lib/MigrationInterface';
import { MigrationObject, loadMigrations } from '../lib/migrations';
import { ExecuteMigrationError } from '../lib/errors';
import { configMock } from './__mocks__/config.mock';
import { connectionMock } from './__mocks__/connection.mock';

describe('up command', () => {
  const numberOfMigrations = 10;
  const fakeMigrationInstance: MigrationInterface = {
    up: jest.fn(),
    down: jest.fn(),
  };
  const fakeMigrations: MigrationObject[] = Array(numberOfMigrations)
    .fill(undefined)
    .map((v: MigrationObject, index: number) => ({
      className: `MigrationTest${index}`,
      file: `migrations/MigrationTest${index}.ts`,
      instance: fakeMigrationInstance,
    }));

  (mongoConnect as jest.Mock).mockReturnValue(
    new Promise((resolve) => resolve(connectionMock))
  );
  (loadMigrations as jest.Mock).mockReturnValue(
    new Promise((resolve) => resolve(Promise.all(fakeMigrations)))
  );

  beforeEach(() => {
    (fakeMigrationInstance.up as jest.Mock).mockReset();
    (insertMigration as jest.Mock).mockReset();
    (connectionMock.client.close as jest.Mock).mockReset();
  });

  it('should apply all migrations when there are no applied migrations', async () => {
    (getAppliedMigrations as jest.Mock).mockReturnValue(
      new Promise((resolve) => resolve([]))
    );

    await up({ config: configMock });

    expect(fakeMigrationInstance.up).toBeCalledTimes(fakeMigrations.length);
    expect(insertMigration).toBeCalledTimes(fakeMigrations.length);
    expect(connectionMock.client.close).toBeCalled();
  });

  it('should apply only the migrations that are not applied jet', async () => {
    const appliedMigrations = Array(4)
      .fill(undefined)
      .map((v: MigrationModel, index: number) => ({
        id: index,
        file: `migrations/MigrationTest${index}.ts`,
        className: `MigrationTest${index}`,
        timestamp: +new Date(),
      }));

    (getAppliedMigrations as jest.Mock).mockReturnValue(
      new Promise((resolve) => resolve(appliedMigrations))
    );

    const migrationsToApply = fakeMigrations.length - appliedMigrations.length;

    await up({ config: configMock });

    expect(fakeMigrationInstance.up).toBeCalledTimes(migrationsToApply);
    expect(insertMigration).toBeCalledTimes(migrationsToApply);
    expect(connectionMock.client.close());
  });

  it('should fail when migrations rejects', async () => {
    (fakeMigrationInstance.up as jest.Mock).mockReturnValue(
      new Promise((_, reject) => reject('Error'))
    );

    const upOperation = () => up({ config: configMock });

    expect(upOperation()).rejects.toBeInstanceOf(ExecuteMigrationError);
    expect(insertMigration).toBeCalledTimes(0);
    expect(connectionMock.client.close());
  });
});
