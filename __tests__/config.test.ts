jest.mock('fs');

import * as fs from 'fs';
import { getConfig } from '../lib/config';

describe('config', () => {
  it('should read a configuration from file', () => {
    const readFileSyncSpy = jest.spyOn(fs, 'readFileSync');

    const baseConfig = {
      uri: 'mongodb://user:pass@localhost:27017',
      database: 'test',
      migrationsDir: 'migrations',
      migrationsCollection: 'migrations_changelog'
    };
    const readFileSyncMock = jest.fn(() => JSON.stringify(baseConfig));

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockImplementation(readFileSyncMock);

    const config = getConfig();

    expect(readFileSyncSpy).toBeCalled();
    expect(config).toMatchObject({
      ...baseConfig,
      migrationsDir: `${process.env.PWD}/${baseConfig.migrationsDir}`
    });
  });

  it('should read a configuration from env if useEnv option is true', () => {
    const mongoUri = 'mongodb://user:pass@localhost:27017';
    const mongoDb = 'db';
    const readFileSyncMock = jest.fn(() => JSON.stringify({ useEnv: true }));

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockImplementation(readFileSyncMock);

    process.env.MONGO_MIGRATE_URI = mongoUri;
    process.env.MONGO_MIGRATE_DB = mongoDb;

    const config = getConfig();

    expect(config).toMatchObject({
      uri: mongoUri,
      database: mongoDb
    });
  });

  it('should throw error if no configuration file is present', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    expect(getConfig).toThrowError();
  });
});
