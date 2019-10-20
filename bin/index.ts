import { Command } from 'commander';
import { newCommand } from '../lib/commands/new';
import { up } from '../lib/commands/up';
import { init } from '../lib/commands/init';
import { status } from '../lib/commands/status';
import { down } from '../lib/commands/down';

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
  .description('Undo all applied migrations')
  .action((cmd: Command) => {
    down();
  });

program
  .command('status')
  .description('Show the status of the migrations')
  .action((cmd: Command) => {
    status();
  });

program.parse(process.argv);
