jest.mock('../lib/database');
jest.mock('../lib/migrations');

import { oraMock } from './__mocks__/ora.mock';
jest.mock('ora', () => {
  return jest.fn().mockImplementation(oraMock);
});

import { down } from '../lib/commands/down';
import {
  deleteMigration,
  getAppliedMigrations,
  getLastAppliedMigration,
  MigrationModel,
  mongoConnect,
} from '../lib/database';
import { MigrationInterface } from '../lib/MigrationInterface';
import { loadMigrationFile } from '../lib/migrations';
import { configMock } from './__mocks__/config.mock';
import { connectionMock } from './__mocks__/connection.mock';

describe('down command', () => {
  const numberOfMigrations = 10;
  const fakeMigrationInstance: MigrationInterface = {
    up: jest.fn(),
    down: jest.fn(),
  };
  const fakeMigrations: MigrationModel[] = Array(numberOfMigrations)
    .fill(undefined)
    .map((v: MigrationModel, index: number) => ({
      _id: `${index}`,
      className: `MigrationTest${index}`,
      file: `MigrationTest${index}.ts`,
      timestamp: +new Date(),
    }));

  (mongoConnect as jest.Mock).mockReturnValue(
    new Promise((resolve) => resolve(connectionMock))
  );

  (getAppliedMigrations as jest.Mock).mockReturnValue(
    new Promise((resolve) => resolve(fakeMigrations))
  );

  (loadMigrationFile as jest.Mock).mockImplementation((file: string) => [
    {
      ...fakeMigrations.find((m: MigrationModel) => m.file === file),
      instance: fakeMigrationInstance,
    },
  ]);

  (getLastAppliedMigration as jest.Mock).mockReturnValue(
    new Promise((resolve) => resolve(fakeMigrations[numberOfMigrations - 1]))
  );

  beforeEach(() => {
    (fakeMigrationInstance.down as jest.Mock).mockReset();
    (deleteMigration as jest.Mock).mockReset();
    (connectionMock.client.close as jest.Mock).mockReset();
  });

  it('should down all migrations that are applied', async () => {
    await down({ mode: 'all', config: configMock });

    expect(fakeMigrationInstance.down).toBeCalledTimes(fakeMigrations.length);
    expect(connectionMock.client.close).toBeCalled();
    expect(deleteMigration).toBeCalledTimes(fakeMigrations.length);
  });

  it('should only down the last applied migration', async () => {
    await down({ mode: 'last', config: configMock });

    expect(fakeMigrationInstance.down).toBeCalledTimes(1);
    expect(deleteMigration).toBeCalledTimes(1);
    expect(connectionMock.client.close).toBeCalled();
  });
});
