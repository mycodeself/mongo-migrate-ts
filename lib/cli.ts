import { Command } from 'commander';
import { down } from './commands/down';
import { init } from './commands/init';
import { newCommand } from './commands/new';
import { status } from './commands/status';
import { up } from './commands/up';
import { Config } from './config';

export const cli = (config: Config): void => {
  const program = new Command();

  program
    .command('init')
    .description('Creates the migrations directory and configuration file')
    .action(() => {
      init();
    });

  program
    .command('new')
    .description('Create a new migration file under migrations directory')
    .option('--name <name>', 'the migration name')
    .action((cmd: Command) => {
      const opts = cmd.opts();
      let name = opts.name;

      if (typeof opts.name !== 'string' || opts.name.length === 0) {
        name = undefined;
      }

      newCommand({ migrationName: name, migrationsDir: config.migrationsDir });
    });

  program
    .command('up')
    .description('Run all pending migrations')
    .action(() => {
      up({ config });
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
        config,
        mode: opts.last ? 'last' : 'all',
      });
    });

  program
    .command('status')
    .description('Show the status of the migrations')
    .action(() => {
      status({ config });
    });

  program.parse(process.argv);
};
