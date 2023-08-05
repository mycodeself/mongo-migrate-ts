import { Db, MongoClient } from 'mongodb';

export interface MigrationInterface {
  up(db: Db, client: MongoClient): Promise<any>;
  down(db: Db, client: MongoClient): Promise<any>;
}
