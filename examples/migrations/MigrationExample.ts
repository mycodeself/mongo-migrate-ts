import { MigrationInterface, Db } from '../../lib';

export class MigrationExample implements MigrationInterface {
  public async up(db: Db): Promise<any> {
    await db.createCollection('mycol');
    await db.collection('mycol').insertOne({ name: 'hola' });
  }

  public async down(db: Db): Promise<any> {
    await db.dropCollection('mycol');
  }
}
