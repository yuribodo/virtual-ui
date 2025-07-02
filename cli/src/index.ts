#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { addCommand } from './commands/add';
import { initCommand } from './commands/init';
import { listCommand } from './commands/list';

const program = new Command();

program
  .name('virtual-ui')
  .description('Add beautiful components to your React project')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize Virtual UI in your project')
  .option('-y, --yes', 'Skip confirmation prompts')
  .action(initCommand);

program
  .command('add')
  .description('Add a component to your project')
  .argument('[components...]', 'Components to add')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('-o, --overwrite', 'Overwrite existing files')
  .option('-c, --cwd <cwd>', 'The working directory', process.cwd())
  .option('-p, --path <path>', 'The path to add the component to')
  .action(addCommand);

program
  .command('list')
  .description('List all available components')
  .action(listCommand);

program.parse();

// Handle errors
process.on('uncaughtException', (error) => {
  console.error(chalk.red('Unexpected error:'), error.message);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error(chalk.red('Unexpected error:'), error);
  process.exit(1);
}); 