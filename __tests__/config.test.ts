jest.mock('fs');

import * as fs from 'fs';
import { processConfig, readConfigFromFile } from '../lib/config';
import { configMock } from './__mocks__/config.mock';

describe('config', () => {
  it('should read a configuration from file', () => {
    const readFileSyncSpy = jest.spyOn(fs, 'readFileSync');

    const readFileSyncMock = jest.fn(() => JSON.stringify(configMock));

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockImplementation(readFileSyncMock);

    const config = readConfigFromFile('config.json');

    expect(readFileSyncSpy).toBeCalled();
    expect(config).toMatchObject(configMock);
  });

  it('should throw error if no configuration file is present', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    expect(readConfigFromFile).toThrowError();
  });
  it('should process a config successfully', () => {
    const processedConfig = processConfig(configMock);

    expect(processedConfig).toMatchObject(configMock);
  });
  it('should throw error if no uri is provided when process config', () => {
    expect(() => {
      processConfig({ ...configMock, uri: undefined });
    }).toThrowError();
  });

  it('should throw error if no database is provided when process config', () => {
    expect(() => {
      processConfig({ ...configMock, database: undefined });
    }).toThrowError();
  });
  it('should process config successfully when provide the database on the uri', () => {
    const uri = `${configMock.uri}/mydatabase?authSource=admin`;
    const processedConfig = processConfig({
      ...configMock,
      uri,
      database: undefined,
    });

    expect(processedConfig).toMatchObject({
      ...configMock,
      uri,
      database: 'mydatabase',
    });
  });
  it('should read the db config from the env vars', () => {
    process.env.MONGO_MIGRATE_URI = configMock.uri;
    process.env.MONGO_MIGRATE_DB = configMock.database;

    const processedConfig = processConfig({
      ...configMock,
      uri: undefined,
      database: undefined,
      useEnv: true,
    });

    expect(processedConfig).toMatchObject(configMock);
  });
  it('should read the db config from custom env vars', () => {
    process.env.MIGRATIONS_URI = configMock.uri;
    process.env.MIGRATIONS_DB = configMock.database;

    const processedConfig = processConfig({
      ...configMock,
      uri: undefined,
      database: undefined,
      useEnv: true,
      environment: {
        uriVar: 'MIGRATIONS_URI',
        databaseVar: 'MIGRATIONS_DB',
      },
    });

    expect(processedConfig).toMatchObject(configMock);
  });
});
