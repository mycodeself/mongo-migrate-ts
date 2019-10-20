import * as fs from 'fs';
import { init } from '../lib/commands/init';
import { getConfig, getDefaultConfigPath } from '../lib/config';
import { clearConfig } from '../lib/utils/testUtils';

beforeAll(() => {
  clearConfig();
});

afterAll(() => {
  clearConfig();
});

describe('init command', () => {
  it('should create default migration folder and configuration file', () => {
    init();
    const configPath = getDefaultConfigPath();
    const config = getConfig();

    expect(fs.existsSync(configPath)).toBeTruthy();
    expect(fs.existsSync(config.migrationsDir)).toBeTruthy();
  });
});
