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
});
