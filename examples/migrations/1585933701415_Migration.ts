import { Db, MongoClient } from 'mongodb';
import { MigrationInterface } from '../../lib';

export class Migration1585933701415 implements MigrationInterface {
  public async up(db: Db, _client: MongoClient): Promise<void | never> {
    await db.createCollection('mycol');
  }

  public async down(db: Db, _client: MongoClient): Promise<void | never> {
    await db.dropCollection('mycol');
  }
}
