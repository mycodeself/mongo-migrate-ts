import { getDbFromUri } from '../lib/utils/getDbFromUri';

describe('getDbFormUri', () => {
  it('should get the db from the uri successfully', () => {
    const uri =
      'mongodb://username:P%40ssw0rd@mongodb0.example.com:27017/mydatabase?authSource=admin';

    const db = getDbFromUri(uri);

    expect(db).toBe('mydatabase');
  });
  it('should return undefined when no db is present', () => {
    const uri = 'mongodb://username:P%40ssw0rd@mongodb0.example.com:27017';
    const db = getDbFromUri(uri);

    expect(db).toBe(undefined);
  });
  it('should return undefined when no db is present and there is a backslash', () => {
    const uri =
      'mongodb://username:P%40ssw0rd@mongodb0.example.com:27017/?authSource=admin';
    const db = getDbFromUri(uri);

    expect(db).toBe(undefined);
  });
  it('should parse uri with replica set', () => {
    const uri = 'mongodb://mongo1:27017,mongo2:27017,mongo3:27017/mydb?replicaSet=replset0';
    const db = getDbFromUri(uri);

    expect(db).toBe('mydb');
  })
  it('should parse uri with replica set in mongo srv format', () => {
    const uri = 'mongodb+srv://mongo1:27017,mongo2:27017,mongo3:27017/mydb?replicaSet=replset0';
    const db = getDbFromUri(uri);

    expect(db).toBe('mydb');    
  })
});
