import { Db } from 'mongodb';
import { MigrationInterface } from '../../lib';

export class Migration1585933701415 implements MigrationInterface {
  public async up(db: Db): Promise<any> {
    db.createCollection('mycol');
    throw new Error('Test error');
  }

  public async down(db: Db): Promise<any> {
    db.dropCollection('mycol');
  }
}
