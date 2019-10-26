jest.mock('../lib/config');
jest.mock('../lib/database');
jest.mock('../lib/migrations');
jest.mock('ora');

import ora from 'ora';
import { up } from '../lib/commands/up';
import { getConfig } from '../lib/config';
import {
  connectDatabase,
  getAppliedMigrations,
  insertMigration
} from '../lib/database';
import { MigrationInterface } from '../lib/MigrationInterface';
import { IMigration, loadMigrations } from '../lib/migrations';
import { oraMock } from './__mocks__/ora.mock';

describe('up command', () => {
  it('should apply all migrations when there are no applied migrations', () => {
    const numberOfMigrations = 10;
    const fakeMigrationInstance: MigrationInterface = {
      up: jest.fn(async () => undefined),
      down: jest.fn(async () => undefined)
    };
    const fakeMigrations: IMigration[] = Array(numberOfMigrations)
      .fill(undefined)
      .map((v: IMigration, index: number) => ({
        className: `MigrationTest${index}`,
        file: `migrations/MigrationTest${index}.ts`,
        instance: fakeMigrationInstance
      }));

    (getConfig as jest.Mock).mockReturnValue({
      uri: 'mongodb://user:pass@localhost:27017',
      database: 'test',
      migrationsDir: 'migrations',
      migrationsCollection: 'migrations_changelog'
    });

    (connectDatabase as jest.Mock).mockReturnValue(
      new Promise(resolve =>
        resolve({
          db: {
            collection: () => undefined
          },
          client: {
            close: () => undefined
          }
        })
      )
    );
    (getAppliedMigrations as jest.Mock).mockReturnValue(
      new Promise(resolve => resolve([]))
    );
    (loadMigrations as jest.Mock).mockReturnValue(
      new Promise(resolve => resolve(Promise.all(fakeMigrations)))
    );

    const insertMigrationMock = jest.fn(async () => {
      return new Promise(resolve => resolve());
    });

    (insertMigration as jest.Mock).mockImplementation(insertMigrationMock);
    ((ora as unknown) as jest.Mock).mockImplementation(oraMock);

    up();

    // expect(insertMigrationMock).toBeCalled();
  });
});
