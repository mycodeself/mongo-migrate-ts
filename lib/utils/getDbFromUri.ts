import { URL } from 'url';

export const getDbFromUri = (uri: string): string | undefined => {
  const parseUri = new URL(uri);

  if (!parseUri.pathname || parseUri.pathname.length < 2) {
    return;
  }

  const db = parseUri.pathname.slice(1);

  return db;
};
