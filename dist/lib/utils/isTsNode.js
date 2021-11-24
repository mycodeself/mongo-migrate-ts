'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.isTsNode = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const isTsNode = () => {
  const symbol = Symbol.for('ts-node.register.instance');
  return !!process[symbol];
};
exports.isTsNode = isTsNode;
//# sourceMappingURL=isTsNode.js.map
