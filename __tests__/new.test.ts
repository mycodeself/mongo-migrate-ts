jest.mock('fs');
jest.mock('../lib/config');

import * as fs from 'fs';
import { newCommand } from '../lib/commands/new';
import { getConfig } from '../lib/config';

describe('new command', () => {
  const mkdirSyncSpy = jest.spyOn(fs, 'mkdirSync');
  const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');

  beforeEach(() => {
    mkdirSyncSpy.mockReset();
    writeFileSyncSpy.mockReset();
  });

  it('should create a new migration file', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (getConfig as jest.Mock).mockReturnValue({ migrationsDir: '' });
    const migrationName = 'TestMigration';
    newCommand({ migrationName });

    expect(writeFileSyncSpy).toHaveBeenCalled();
  });

  it('should create the migration folder if not exists', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (getConfig as jest.Mock).mockReturnValue({ migrationsDir: 'dir' });
    const migrationName = 'TestMigration';
    newCommand({ migrationName });

    expect(mkdirSyncSpy).toHaveBeenCalledWith('dir');
    expect(writeFileSyncSpy).toHaveBeenCalled();
  });
});
