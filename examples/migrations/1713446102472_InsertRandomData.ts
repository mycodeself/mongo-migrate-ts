import { Db } from 'mongodb';
import { MigrationInterface } from '../../lib';

export class InsertRandomData1713446102472 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    const col = db.collection('mycol');
    await col.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }]);
  }

  public async down(db: Db): Promise<void | never> {
    const col = db.collection('mycol');
    await col.deleteMany({ a: { $in: [1, 2, 3] } });
  }
}
