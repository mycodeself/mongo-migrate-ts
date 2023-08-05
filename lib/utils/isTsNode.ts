/* eslint-disable @typescript-eslint/no-explicit-any */
export const isTsNode = (): boolean => {
  const symbol = Symbol.for('ts-node.register.instance');

  return Boolean((process as any)[symbol] || process.env.TS_NODE_DEV);
};
