import { Db } from 'mongodb';
import { MigrationInterface } from '../../lib';

export class MigrationExample implements MigrationInterface {
  public async up(db: Db): Promise<any> {
    await db.createCollection('example');
  }

  public async down(db: Db): Promise<any> {
    await db.dropCollection('example');
  }
}
