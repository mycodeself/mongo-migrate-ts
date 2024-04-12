import { Db } from 'mongodb';
import { MigrationInterface } from '../../lib';

export class Migration1585933701415 implements MigrationInterface {
  public async up(db: Db): Promise<void> {
    db.createCollection('mycol');
  }

  public async down(db: Db): Promise<void> {
    db.dropCollection('mycol');
  }
}
