jest.mock('../lib/database');
jest.mock('../lib/migrations');

import { oraMock } from './__mocks__/ora.mock';
jest.mock('ora', () => {
  return jest.fn().mockImplementation(oraMock);
});

import { MigrationModel, mongoConnect } from '../lib/database';
import { configMock } from './__mocks__/config.mock';
import { connectionMock } from './__mocks__/connection.mock';
import { fixPaths } from '../lib/commands/fixPaths';

describe('fixPaths command', () => {
  const numberOfMigrations = 10;
  const fakeMigrations: MigrationModel[] = Array(numberOfMigrations)
    .fill(undefined)
    .map((v: MigrationModel, index: number) => ({
      _id: `${index}`,
      className: `MigrationTest${index}`,
      file: `${
        index % 3 === 0 ? '/home/runner/migrations/' : '/home/user/project/'
      }MigrationTest${index}.ts`,
      timestamp: +new Date(),
    }));

  (mongoConnect as jest.Mock).mockReturnValue(
    new Promise((resolve) => resolve(connectionMock))
  );

  const createMockCursor = () => {
    let i = 0;
    return {
      hasNext: () => i < fakeMigrations.length,
      next: () => {
        const item = fakeMigrations[i];
        i += 1;
        return item ?? null;
      },
    };
  };

  const mockUpdateOne = jest.fn();

  beforeEach(() => {
    (connectionMock.client.close as jest.Mock).mockReset();
    connectionMock.getMigrationsCollection.mockReset();
    mockUpdateOne.mockReset();

    connectionMock.getMigrationsCollection.mockReturnValue({
      updateOne: mockUpdateOne,
      find: jest.fn().mockImplementation(createMockCursor),
    });
  });

  it('should convert absolute paths only of matching migrations', async () => {
    const basePath = '/home/runner/migrations';
    await fixPaths({ config: configMock, basePath });

    fakeMigrations.forEach((fakeMigration, index) => {
      (fakeMigration.file.startsWith(basePath)
        ? expect(mockUpdateOne)
        : expect(mockUpdateOne).not
      ).toHaveBeenCalledWith(
        { _id: `${index}` },
        { $set: { file: `MigrationTest${index}.ts` } }
      );
    });

    expect(connectionMock.client.close).toBeCalled();
  });

  it('should not alter the database in dry run mode', async () => {
    await fixPaths({
      config: configMock,
      dryRun: true,
      basePath: '/home/runner/migrations',
    });

    expect(mockUpdateOne).not.toHaveBeenCalled();
    expect(connectionMock.client.close).toBeCalled();
  });
});
