# WIP

# mongo-migrate-ts
[![CircleCI](https://circleci.com/gh/mycodeself/mongo-migrate-ts.svg?style=svg)](https://circleci.com/gh/mycodeself/mongo-migrate-ts)


A library for easy run migrations on mongodb with TypeScript.

Based on migrate-mongo (https://github.com/seppevs/migrate-mongo/), but with TypeScript support.

## Installation

Its simple
```
npm install mongo-migrate
```

You can install it globally for the CLI usage
```
npm install -g mongo-migrate
```


## Usage

Create a directory for your migrations and add this content
```typescript
import { mongoMigrateCli } from "mongo-migrate-ts";

mongoMigrateCli({
  uri: "mongodb://username:password@0.0.0.0:27017",
  database: "db",
  migrationsDir: __dirname,
  migrationsCollection: "migrations_collection",
  options: {
    useUnifiedTopology: true
  }
});
```

Create a migration file in this folder...
```typescript
import { MigrationInterface } from "mongo-migrate-ts";
import { Db } from "mongodb";

export class MyMigration implements MigrationInterface {
  async up(db: Db): Promise<any> {
    await db.createCollection("my_collection");
  }

  async down(db: Db): Promise<any> {
    await db.dropCollection("my_collection");
  }
}
```

```
tsc migrations/index.js && node build/migrations/index.js
```

## Configuration

```typescript
{
  uri?: string;
  database?: string;
  useEnv?: boolean;
  environment?: {
    uriVar?: string;
    databaseVar?: string;
  };
  options?: MongoClientOptions;
  migrationsDir: string;
  migrationsCollection: string;
}
```

Example configuration in json
```json
{
  "uri": "mongodb://admin:admin@127.0.0.1:27017/mydb?authSource=admin",
  "migrationsDir": "migrations",
  "migrationsCollection": "migrations_changelog",
  "options": {
    "useUnifiedTopology": true
  }
}
```



## CLI
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