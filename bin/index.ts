#!/usr/bin/env node

import { getDefaultConfigPath, readConfigFromFile } from '../lib/config';
import { mongoMigrateCli } from '../lib/mongoMigrate';

const config = readConfigFromFile(getDefaultConfigPath());
mongoMigrateCli(config);
