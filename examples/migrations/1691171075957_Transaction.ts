import { Db, MongoClient } from 'mongodb';
import { MigrationInterface } from '../../lib';

export class Transaction1691171075957 implements MigrationInterface {
  public async up(db: Db, client: MongoClient): Promise<void> {
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        await db.collection('mycol').insertOne({ foo: 'one' });
        await db.collection('mycol').insertOne({ foo: 'two' });
        await db.collection('mycol').insertOne({ foo: 'three' });
      });
    } finally {
      await session.endSession();
    }
  }

  public async down(db: Db, client: MongoClient): Promise<void> {
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        await db.collection('mycol').deleteOne({ foo: 'one' });
        await db.collection('mycol').deleteOne({ foo: 'two' });
        await db.collection('mycol').deleteOne({ foo: 'three' });
      });
    } finally {
      await session.endSession();
    }
  }
}
