#!/usr/bin/env node

import { cli } from '../lib/cli';
import { getDefaultConfigPath, readConfigFromFile } from '../lib/config';

const config = readConfigFromFile(getDefaultConfigPath());
cli(config);
