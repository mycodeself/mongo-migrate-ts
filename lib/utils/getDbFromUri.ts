import { ConnectionString } from 'connection-string';

export const getDbFromUri = (uri: string): string | undefined => {
  const parseUri = new ConnectionString(uri);

  if (!parseUri.path || parseUri.path.length < 1) {
    return;
  }

  const db = parseUri.path[0];

  return db;
};
