#!/usr/bin/env node

import { getDefaultConfigPath, readConfigFromFile } from '../lib/config';
import { run } from '../lib/run';

const config = readConfigFromFile(getDefaultConfigPath());
run(config);
