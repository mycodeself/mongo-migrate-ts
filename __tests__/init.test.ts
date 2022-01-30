jest.mock('fs');

import { oraMock } from './__mocks__/ora.mock';
jest.mock('ora', () => {
  return jest.fn().mockImplementation(oraMock);
});

import * as fs from 'fs';
import { init } from '../lib/commands/init';

describe('init command', () => {
  const mkdirSyncSpy = jest.spyOn(fs, 'mkdirSync');
  const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');

  it('should create default migration folder and configuration file if none exists', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    init();

    expect(mkdirSyncSpy).toHaveBeenCalled();
    expect(writeFileSyncSpy).toHaveBeenCalled();
  });
  it('should NOT create the default migration folder and configuratio nfile if already exists', () => {
    mkdirSyncSpy.mockReset();
    writeFileSyncSpy.mockReset();
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    init();

    expect(mkdirSyncSpy).toHaveBeenCalledTimes(0);
    expect(writeFileSyncSpy).toHaveBeenCalledTimes(0);
  });
});
