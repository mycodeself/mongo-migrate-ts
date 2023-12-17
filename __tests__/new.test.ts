jest.mock('fs');
jest.mock('../lib/config');

import * as fs from 'fs';
import * as newModule from '../lib/commands/new';
import { configMock } from './__mocks__/config.mock';

describe('new command', () => {
  const mkdirSyncSpy = jest.spyOn(fs, 'mkdirSync');
  const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');
  const defaultTemplateSpy = jest.spyOn(newModule, 'defaultMigrationTemplate');
  const timestampFormat = 'T';

  beforeAll(() => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date('2022-01-01 00:00:00.000').getTime());
  });

  beforeEach(() => {
    mkdirSyncSpy.mockReset();
    writeFileSyncSpy.mockReset();
    defaultTemplateSpy.mockReset();
  });

  it('should create a new migration file', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    const migrationName = {
      title: 'TestMigration',
      timestampFormat,
    };
    newModule.newCommand({
      migrationName,
      migrationsDir: configMock.migrationsDir,
    });
    expect(writeFileSyncSpy).toHaveBeenCalledTimes(1);
    expect(writeFileSyncSpy).toHaveBeenCalled();
  });

  it('should create the migration folder if not exists', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    const migrationName = {
      title: 'TestMigration',
      timestampFormat,
    };
    newModule.newCommand({
      migrationName,
      migrationsDir: configMock.migrationsDir,
    });

    expect(mkdirSyncSpy).toHaveBeenCalledTimes(1);
    expect(mkdirSyncSpy).toHaveBeenCalledWith(configMock.migrationsDir);
    expect(writeFileSyncSpy).toHaveBeenCalledTimes(1);
    expect(writeFileSyncSpy).toHaveBeenCalled();
  });

  it('should create the migration using a template if the provided file exists and replace the class name', () => {
    const templateFileText = 'class custom template file contents';

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(templateFileText);

    const newDate = +new Date();
    const templateFile = 'testFile.ts';
    newModule.newCommand({
      migrationsDir: configMock.migrationsDir,
      templateFile: templateFile,
      migrationName: {
        timestampFormat,
      },
    });
    const fileName = `${newDate}_Migration`;
    const expectedMigrationsPath = `${configMock.migrationsDir}/${fileName}.ts`;
    const expectedTemplateFileText = `class Migration${newDate} template file contents`;
    expect(writeFileSyncSpy).toHaveBeenCalledTimes(1);
    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      expectedMigrationsPath,
      expectedTemplateFileText
    );
  });

  it('should throw error if provided template file does not exist', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    expect(newModule.newCommand).toThrowError();

    expect(defaultTemplateSpy).not.toHaveBeenCalled();
    expect(writeFileSyncSpy).not.toHaveBeenCalled();
  });

  it('should use the default template text if no template file provided', () => {
    const defaultTemplateText = 'default template file contents';

    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (newModule.defaultMigrationTemplate as jest.Mock).mockReturnValue(
      defaultTemplateText
    );

    newModule.newCommand({
      migrationsDir: configMock.migrationsDir,
      migrationName: {
        timestampFormat,
      },
    });

    const fileName = `${+new Date()}_Migration`;

    const expectedMigrationsPath = `${configMock.migrationsDir}/${fileName}.ts`;

    expect(defaultTemplateSpy).toHaveBeenCalledTimes(1);
    expect(defaultTemplateSpy).toHaveBeenCalledWith(`Migration${+new Date()}`);
    expect(writeFileSyncSpy).toHaveBeenCalledTimes(1);
    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      expectedMigrationsPath,
      defaultTemplateText
    );
  });

  it('should create a new migration file with custom timestamp format if format provided', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (newModule.defaultMigrationTemplate as jest.Mock).mockReturnValue(expect.any(String));
    const migrationName = {
      timestampFormat: 'yyyyMMddHHmmss',
    };
    newModule.newCommand({
      migrationName,
      migrationsDir: configMock.migrationsDir,
    });
    const expectedMigrationsPath = `${configMock.migrationsDir}/20220101000000_Migration.ts`;
    expect(writeFileSyncSpy).toHaveBeenCalledTimes(1);
    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      expectedMigrationsPath,
      expect.any(String)
    );
  });
});
