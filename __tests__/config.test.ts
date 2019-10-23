import * as fs from 'fs';
import { getConfig, getDefaultConfigPath } from '../lib/config';
import { clearConfig } from '../lib/utils/testUtils';

beforeEach(() => {
  clearConfig();
});

afterEach(() => {
  clearConfig();
});

describe('config', () => {
  it('should read a configuration from file', () => {
    const filePath = getDefaultConfigPath();
    const baseOptions = {
      uri: 'mongodb://user:pass@localhost:27017',
      database: 'test',
      migrationsDir: 'migrations',
      migrationsCollection: 'migrations_changelog'
    };

    fs.writeFileSync(filePath, JSON.stringify(baseOptions));

    const config = getConfig();

    expect(config).toMatchObject({
      ...baseOptions,
      migrationsDir: `${process.env.PWD}/${baseOptions.migrationsDir}`
    });
  });

  it('should read a configuration from env if useEnv option is true', () => {
    const filePath = `${__dirname}/../migrations.json`;
    const baseOptions = {
      useEnv: true,
      migrationsDir: 'migrations',
      migrationsCollection: 'migrations_changelog'
    };

    fs.writeFileSync(filePath, JSON.stringify(baseOptions));

    process.env.MONGO_MIGRATE_URI = 'mongodb://user:pass@localhost:27017';
    process.env.MONGO_MIGRATE_DB = 'test';

    const config = getConfig();

    expect(config).toMatchObject({
      ...baseOptions,
      migrationsDir: `${process.env.PWD}/${baseOptions.migrationsDir}`,
      uri: 'mongodb://user:pass@localhost:27017',
      database: 'test'
    });
  });

  it('should throw error if no configuration file is present', () => {
    expect(getConfig).toThrowError();
  });
});
