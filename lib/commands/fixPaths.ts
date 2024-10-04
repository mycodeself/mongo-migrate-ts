import * as path from 'path';
import { Config, processConfig } from '../config';
import { mongoConnect } from '../database';

interface CommandFixPathsOptions {
  config: Config;
  basePath?: string;
  dryRun?: boolean;
}

export const fixPaths = async ({
  basePath,
  config,
  dryRun,
}: CommandFixPathsOptions): Promise<void> => {
  const { uri, database, options, migrationsCollection, migrationsDir } =
    processConfig(config);
  const connection = await mongoConnect(uri, database, options);
  const collection = connection.getMigrationsCollection(migrationsCollection);

  const basePathWithMigrationsDirDefault =
    basePath ?? path.resolve(migrationsDir);


  try {
    const cursor = collection.find({
      file: new RegExp(`^${basePathWithMigrationsDirDefault}.*`),
    });

    while (await cursor.hasNext()) {
      const migration = await cursor.next();
      if (!migration) break;

      const newFilePath = path.relative(
        basePathWithMigrationsDirDefault,
        migration.file
      );

      console.log(
        `Updating migration path "${migration.file}" to "${newFilePath}"`
      );

      if (!dryRun) {
        await collection.updateOne(
          { _id: migration._id },
          { $set: { file: newFilePath } }
        );
      }
    }
  } finally {
    await connection.client.close();
  }
};
