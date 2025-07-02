#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const add_1 = require("./commands/add");
const init_1 = require("./commands/init");
const list_1 = require("./commands/list");
const program = new commander_1.Command();
program
    .name('virtual-ui')
    .description('Add beautiful components to your React project')
    .version('1.0.0');
program
    .command('init')
    .description('Initialize Virtual UI in your project')
    .option('-y, --yes', 'Skip confirmation prompts')
    .action(init_1.initCommand);
program
    .command('add')
    .description('Add a component to your project')
    .argument('[components...]', 'Components to add')
    .option('-y, --yes', 'Skip confirmation prompts')
    .option('-o, --overwrite', 'Overwrite existing files')
    .option('-c, --cwd <cwd>', 'The working directory', process.cwd())
    .option('-p, --path <path>', 'The path to add the component to')
    .action(add_1.addCommand);
program
    .command('list')
    .description('List all available components')
    .action(list_1.listCommand);
program.parse();
// Handle errors
process.on('uncaughtException', (error) => {
    console.error(chalk_1.default.red('Unexpected error:'), error.message);
    process.exit(1);
});
process.on('unhandledRejection', (error) => {
    console.error(chalk_1.default.red('Unexpected error:'), error);
    process.exit(1);
});
