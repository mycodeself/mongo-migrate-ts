#!/usr/bin/env node

import { Command } from 'commander';
import { down } from '../lib/commands/down';
import { init } from '../lib/commands/init';
import { newCommand } from '../lib/commands/new';
import { status } from '../lib/commands/status';
import { up } from '../lib/commands/up';

const program = new Command();

program
  .command('init')
  .description('Creates the migrations directory and configuration file')
  .action((cmd: Command) => {
    init();
  });

program
  .command('new')
  .description('Create a new migration file under migrations directory')
  .option('--name <name>', 'the migration name')
  .action((cmd: Command) => {
    const { name } = cmd.opts();

    if (typeof name !== 'string') {
      cmd.help();
    }

    newCommand({ migrationName: name });
  });

program
  .command('up')
  .description('Run all pending migrations')
  .action((cmd: Command) => {
    up();
  });

program
  .command('down')
  .description('Undo migrations')
  .option('-l, --last', 'Undo the last applied migration')
  .option('-a, --all', 'Undo all applied migrations')
  .action((cmd: Command) => {
    const opts = cmd.opts();
    if (!opts.last && !opts.all) {
      cmd.outputHelp();
      process.exit(-1);
    }

    down({
      mode: opts.last ? 'last' : 'all'
    });
  });

program
  .command('status')
  .description('Show the status of the migrations')
  .action((cmd: Command) => {
    status();
  });

program.parse(process.argv);

if (Object.keys(program.opts()).length === 0) {
  program.outputHelp();
}
