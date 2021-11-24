'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getDbFromUri = void 0;
const connection_string_1 = require('connection-string');
const getDbFromUri = (uri) => {
  const parseUri = new connection_string_1.ConnectionString(uri);
  if (!parseUri.path || !parseUri.path.length) {
    return;
  }
  const db = parseUri.path[0];
  return db;
};
exports.getDbFromUri = getDbFromUri;
//# sourceMappingURL=getDbFromUri.js.map
