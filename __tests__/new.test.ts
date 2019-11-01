jest.mock('fs');
jest.mock('../lib/config');

import * as fs from 'fs';
import { newCommand } from '../lib/commands/new';
import { configMock } from './__mocks__/config.mock';

describe('new command', () => {
  const mkdirSyncSpy = jest.spyOn(fs, 'mkdirSync');
  const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');

  beforeEach(() => {
    mkdirSyncSpy.mockReset();
    writeFileSyncSpy.mockReset();
  });

  it('should create a new migration file', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    const migrationName = 'TestMigration';
    newCommand({ migrationName, migrationsDir: configMock.migrationsDir });

    expect(writeFileSyncSpy).toHaveBeenCalled();
  });

  it('should create the migration folder if not exists', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const migrationName = 'TestMigration';
    newCommand({ migrationName, migrationsDir: configMock.migrationsDir });

    expect(mkdirSyncSpy).toHaveBeenCalledWith(configMock.migrationsDir);
    expect(writeFileSyncSpy).toHaveBeenCalled();
  });
});
