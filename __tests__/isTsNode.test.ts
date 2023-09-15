import { isTsNode } from '../lib/utils/isTsNode';

describe('isTsNode', () => {
  beforeEach(() => {
    delete process.env.TS_NODE_DEV;
  });
  it('should return true when process.env.TS_NODE_DEV is true', () => {
    process.env.TS_NODE_DEV = 'true';
    expect(isTsNode()).toBeTruthy();
  });
  it('should return false when process.env.TS_NODE_DEV is false', () => {
    expect(isTsNode()).toBeFalsy();
  });
});
