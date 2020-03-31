import { isTsNode } from './utils/isTsNode';

export { MigrationInterface } from './MigrationInterface';
export { cli as mongoMigrateCli } from './cli';

if (isTsNode()) {
  console.log('is ts node');
} else {
  console.log('NOT ts node');
}
