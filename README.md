# mongo-migrate-ts

[![CircleCI](https://circleci.com/gh/mycodeself/mongo-migrate-ts.svg?style=svg)](https://circleci.com/gh/mycodeself/mongo-migrate-ts)

A library for easy run migrations on mongodb with TypeScript.

Based on migrate-mongo (https://github.com/seppevs/migrate-mongo/), but with TypeScript support.

## Installation

Install using your favourite package manager, example using npm

```
npm install mongo-migrate-ts
```

You can install it globally for the CLI usage

```
npm install -g mongo-migrate-ts
```

## Usage

### CLI options

```
Usage: mongo-migrate [options] [command]

Options:
  -h, --help      output usage information

Commands:
  init            Creates the migrations directory and configuration file
  new [options]   Create a new migration file under migrations directory
  up              Run all pending migrations
  down [options]  Undo migrations
  status          Show the status of the migrations
```

Create a directory for your migrations and instantiate a CLI

```typescript
import { mongoMigrateCli } from 'mongo-migrate-ts';

mongoMigrateCli({
  uri: 'mongodb://username:password@0.0.0.0:27017',
  database: 'db',
  migrationsDir: __dirname,
  migrationsCollection: 'migrations_collection',
});
```

Create a migration file in the configured migrations folder...

```typescript
import { MigrationInterface } from 'mongo-migrate-ts';
import { Db } from 'mongodb';

export class MyMigration implements MigrationInterface {
  async up(db: Db): Promise<any> {
    await db.createCollection('my_collection');
  }

  async down(db: Db): Promise<any> {
    await db.dropCollection('my_collection');
  }
}
```

Compile and up all migrations

```
tsc migrations/index.js && node build/migrations/index.js up
```

or run directly with ts-node

```
ts-node migrations/index.ts up
```

## Configuration

```typescript
{
  // The path where the migrations are stored
  migrationsDir: string;
  // The name of the collection to store the applied migrations
  // (Default: "migrations_changelog")
  migrationsCollection?: string;
  // The connection uri, it can be empty if useEnv is true
  // (Example: mongodb://user:password@127.0.0.1:27017/db?authSource=admin)
  uri?: string;
  // The database where run the migrations
  // it can be empty if the database is on the uri or useEnv is true
  database?: string;
  // If true, will load the configuration from environment variables.
  useEnv?: boolean;
  // Options related to environment configuration
  environment?: {
    // The name of the environment variable with the uri connection
    // (Default: MONGO_MIGRATE_URI)
    uriVar?: string;
    // The name of the environment variable with the db name
    // (Default: MONGO_MIGRATE_DB)
    databaseVar?: string;
  };
  // Specific configuration of mongodb client
  // (see https://mongodb.github.io/node-mongodb-native/4.3/interfaces/MongoClientOptions.html)
  options?: MongoClientOptions;
}
```

Example configuration in json

```json
{
  "uri": "mongodb://admin:admin@127.0.0.1:27017/mydb?authSource=admin",
  "migrationsDir": "migrations"
}
```
