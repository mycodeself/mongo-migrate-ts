/* eslint-disable @typescript-eslint/no-explicit-any */
export const isTsNode = (): boolean => {
  const symbol = Symbol.for('ts-node.register.instance');

  return (process as any)[symbol] !== undefined;
};
