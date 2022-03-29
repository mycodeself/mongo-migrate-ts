jest.mock('fs');
jest.mock('../lib/config');

import * as fs from 'fs';
import * as newModule from '../lib/commands/new';
import { configMock } from './__mocks__/config.mock';

describe('new command', () => {
  const mkdirSyncSpy = jest.spyOn(fs, 'mkdirSync');
  const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');
  const defaultTemplateSpy = jest.spyOn(newModule, 'defaultMigrationTemplate');

  beforeAll(() => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date('2022-01-01 00:00:00.000').getTime());
  });

  beforeEach(() => {
    mkdirSyncSpy.mockReset();
    writeFileSyncSpy.mockReset();
  });

  it('should create a new migration file', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    const migrationName = 'TestMigration';
    newModule.newCommand({
      migrationName,
      migrationsDir: configMock.migrationsDir,
    });

    expect(writeFileSyncSpy).toHaveBeenCalled();
  });

  it('should create the migration folder if not exists', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const migrationName = 'TestMigration';
    newModule.newCommand({
      migrationName,
      migrationsDir: configMock.migrationsDir,
    });

    expect(mkdirSyncSpy).toHaveBeenCalledWith(configMock.migrationsDir);
    expect(writeFileSyncSpy).toHaveBeenCalled();
  });

  it('should create the migration using a template if the provided file exists', () => {
    const templateFileText = 'custom template file contents';

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(templateFileText);

    const templateFile = 'testFile.ts';
    newModule.newCommand({
      migrationsDir: configMock.migrationsDir,
      templateFile: templateFile,
    });
    const fileName = `${+new Date()}_Migration`;
    const expectedMigrationsPath = `${configMock.migrationsDir}/${fileName}.ts`;

    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      expectedMigrationsPath,
      templateFileText
    );
  });

  it('should use the default template text if template file does not exist', () => {
    const defaultTemplateText = 'default template file contents';

    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (newModule.defaultMigrationTemplate as jest.Mock).mockReturnValue(
      defaultTemplateText
    );

    newModule.newCommand({
      migrationsDir: configMock.migrationsDir,
      templateFile: 'doesNotExist.ts',
    });

    const fileName = `${+new Date()}_Migration`;

    const expectedMigrationsPath = `${configMock.migrationsDir}/${fileName}.ts`;

    expect(defaultTemplateSpy).toHaveBeenCalled();
    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      expectedMigrationsPath,
      defaultTemplateText
    );
  });

  it('should use the default template text if no template file provided', () => {
    const defaultTemplateText = 'default template file contents';

    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (newModule.defaultMigrationTemplate as jest.Mock).mockReturnValue(
      defaultTemplateText
    );

    newModule.newCommand({
      migrationsDir: configMock.migrationsDir,
    });

    const fileName = `${+new Date()}_Migration`;

    const expectedMigrationsPath = `${configMock.migrationsDir}/${fileName}.ts`;

    expect(defaultTemplateSpy).toHaveBeenCalled();
    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      expectedMigrationsPath,
      defaultTemplateText
    );
  });
});
