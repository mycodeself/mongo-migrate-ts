#!/usr/bin/env node

import { cli } from '../lib/cli';
import { getDefaultConfigPath, readConfigFromFile } from '../lib/config';
import { ConfigFileNotFoundError } from '../lib/errors';

try {
  const config = readConfigFromFile(getDefaultConfigPath());
  cli(config);
} catch (e) {
  if (e instanceof ConfigFileNotFoundError) {
    console.warn(`${e.message} Initializing CLI without config.`);
    cli();
  } else {
    throw e;
  }
}
