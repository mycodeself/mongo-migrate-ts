import { Db, MongoClient } from 'mongodb';
import { MigrationInterface } from '../../lib';

export class Transaction1691171075957 implements MigrationInterface {
  public async up(db: Db, client: MongoClient): Promise<any> {
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        await db.collection('mycol1').insertOne({ foo: 'one' });
        await db.collection('mycol2').insertOne({ foo: 'two' });
        await db.collection('mycol3').insertOne({ foo: 'three' });
      });
    } finally {
      await session.endSession();
    }
  }

  public async down(db: Db, client: MongoClient): Promise<any> {
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        await db.collection('mycol1').deleteOne({ foo: 'one' });
        await db.collection('mycol2').deleteOne({ foo: 'two' });
        await db.collection('mycol3').deleteOne({ foo: 'three' });
      });
    } finally {
      await session.endSession();
    }
  }
}
