import { Db } from 'mongodb';

export interface MigrationInterface {
  up(db: Db): Promise<any>;
  down(db: Db): Promise<any>;
}
