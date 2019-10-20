import * as fs from 'fs';
import { init } from '../lib/commands/init';
import { newCommand } from '../lib/commands/new';
import { clearConfig } from '../lib/utils/testUtils';

beforeAll(() => {
  init();
});

afterAll(() => {
  clearConfig();
});

describe('new command', () => {
  it('should create a new migration file', () => {
    const migrationName = 'TestMigration';
    const migrationPath = newCommand({ migrationName });

    expect(fs.existsSync(migrationPath)).toBeTruthy();
  });
});
