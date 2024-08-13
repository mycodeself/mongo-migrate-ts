import { Db, MongoClient } from 'mongodb';

export interface MigrationInterface {
  up(db: Db, client: MongoClient): Promise<void | never>;
  down(db: Db, client: MongoClient): Promise<void | never>;
}
