export const isTsNode = (): boolean => {
  const path = process.env._;
  if (!path) {
    return false;
  }

  const parts = path.split('/');

  if (parts.length === 0) {
    return false;
  }

  const regex = new RegExp('(ts-node|tsnd)');

  return regex.test(parts[parts.length - 1]);
};
