#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const cli_1 = require('../lib/cli');
const config_1 = require('../lib/config');
const config = config_1.readConfigFromFile(config_1.getDefaultConfigPath());
cli_1.cli(config);
//# sourceMappingURL=index.js.map
