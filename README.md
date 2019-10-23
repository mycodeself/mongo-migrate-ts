# WIP

# mongo-migrate-ts
[![CircleCI](https://circleci.com/gh/mycodeself/mongo-migrate-ts.svg?style=svg)](https://circleci.com/gh/mycodeself/mongo-migrate-ts)


A library for easy run migrations on mongodb with TypeScript.

Based on migrate-mongo (https://github.com/seppevs/migrate-mongo/), but with TypeScript support.

## CLI
```
Usage: index.ts [options] [command]

Options:
  -h, --help      output usage information

Commands:
  init            Creates the migrations directory and configuration file
  new [options]   Create a new migration file under migrations directory
  up              Run all pending migrations
  down [options]  Undo migrations
  status          Show the status of the migrations
```

## Configuration example
migrations.json
```
{
  "uri": "mongodb://username:password@host:port",
  "database": "db",
  "options": {
    "useNewUrlParser": true,
    "useUnifiedTopology": true
  },
  "migrationsDir": "migrations",
  "migrationsCollection": "migrations_changelog"
}
```