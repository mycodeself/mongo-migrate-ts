#!/usr/bin/env node

import { cli } from '../lib/cli';
import { getDefaultConfigPath, readConfigFromFile } from '../lib/config';

try {
  const config = readConfigFromFile(getDefaultConfigPath());
  cli(config);
} catch {
  cli();
}
