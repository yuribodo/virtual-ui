"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCommand = initCommand;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const inquirer_1 = __importDefault(require("inquirer"));
const execa = require("execa");
const config_1 = require("../utils/config");
async function initCommand(options) {
    const cwd = process.cwd();
    console.log(chalk_1.default.blue('Welcome to Virtual UI!'));
    console.log(chalk_1.default.gray('This will initialize Virtual UI in your project.\n'));
    // Check if already initialized
    const existingConfig = await (0, config_1.getConfig)(cwd);
    if (existingConfig && !options.yes) {
        const { proceed } = await inquirer_1.default.prompt([
            {
                type: 'confirm',
                name: 'proceed',
                message: 'Virtual UI is already initialized. Do you want to overwrite the configuration?',
                default: false,
            },
        ]);
        if (!proceed) {
            console.log(chalk_1.default.gray('Initialization cancelled.'));
            return;
        }
    }
    const spinner = (0, ora_1.default)('Initializing...').start();
    try {
        // Detect project type
        const packageJsonPath = path_1.default.resolve(cwd, 'package.json');
        const packageJson = await fs_extra_1.default.readJSON(packageJsonPath).catch(() => null);
        if (!packageJson) {
            spinner.fail(chalk_1.default.red('No package.json found. Please run this command in a Node.js project.'));
            return;
        }
        const isNextJs = packageJson.dependencies?.next || packageJson.devDependencies?.next;
        const hasTypeScript = await fs_extra_1.default.pathExists(path_1.default.resolve(cwd, 'tsconfig.json'));
        const hasTailwind = packageJson.dependencies?.tailwindcss || packageJson.devDependencies?.tailwindcss;
        spinner.stop();
        let config;
        if (options.yes) {
            config = (0, config_1.getDefaultConfig)();
        }
        else {
            // Interactive setup
            const answers = await inquirer_1.default.prompt([
                {
                    type: 'list',
                    name: 'style',
                    message: 'Which style would you like to use?',
                    choices: [
                        { name: 'Default', value: 'default' },
                        { name: 'New York', value: 'new-york' },
                    ],
                    default: 'default',
                },
                {
                    type: 'confirm',
                    name: 'tsx',
                    message: 'Would you like to use TypeScript?',
                    default: hasTypeScript,
                },
                {
                    type: 'confirm',
                    name: 'rsc',
                    message: 'Would you like to use React Server Components?',
                    default: isNextJs,
                    when: () => isNextJs,
                },
                {
                    type: 'input',
                    name: 'components',
                    message: 'Configure the import alias for components?',
                    default: '@/components',
                    validate: (input) => {
                        if (!input.trim()) {
                            return 'Please enter a valid import alias.';
                        }
                        return true;
                    },
                },
                {
                    type: 'input',
                    name: 'utils',
                    message: 'Configure the import alias for utils?',
                    default: '@/lib/utils',
                    validate: (input) => {
                        if (!input.trim()) {
                            return 'Please enter a valid import alias.';
                        }
                        return true;
                    },
                },
                {
                    type: 'confirm',
                    name: 'cssVariables',
                    message: 'Would you like to use CSS variables for colors?',
                    default: true,
                },
            ]);
            config = {
                style: answers.style,
                rsc: answers.rsc ?? false,
                tsx: answers.tsx,
                tailwind: {
                    config: 'tailwind.config.js',
                    css: isNextJs ? 'app/globals.css' : 'src/index.css',
                    cssVariables: answers.cssVariables,
                    baseColor: 'slate',
                },
                aliases: {
                    components: answers.components,
                    utils: answers.utils,
                    ui: `${answers.components}/ui`,
                },
            };
        }
        spinner.start('Setting up configuration...');
        // Save configuration
        await (0, config_1.saveConfig)(config, cwd);
        spinner.succeed(chalk_1.default.green('Configuration saved'));
        // Check and install dependencies
        spinner.start('Checking dependencies...');
        const requiredDeps = ['clsx'];
        const requiredDevDeps = [];
        if (!hasTailwind) {
            requiredDevDeps.push('tailwindcss', 'postcss', 'autoprefixer');
        }
        const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]);
        const missingDevDeps = requiredDevDeps.filter(dep => !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]);
        if (missingDeps.length > 0 || missingDevDeps.length > 0) {
            spinner.text = 'Installing dependencies...';
            try {
                if (missingDeps.length > 0) {
                    await execa('npm', ['install', ...missingDeps], { cwd });
                }
                if (missingDevDeps.length > 0) {
                    await execa('npm', ['install', '--save-dev', ...missingDevDeps], { cwd });
                }
                spinner.succeed(chalk_1.default.green('Dependencies installed'));
            }
            catch (error) {
                spinner.warn(chalk_1.default.yellow('Failed to install some dependencies'));
                console.log(chalk_1.default.gray('Please install them manually:'));
                if (missingDeps.length > 0) {
                    console.log(chalk_1.default.gray(`npm install ${missingDeps.join(' ')}`));
                }
                if (missingDevDeps.length > 0) {
                    console.log(chalk_1.default.gray(`npm install --save-dev ${missingDevDeps.join(' ')}`));
                }
            }
        }
        else {
            spinner.succeed(chalk_1.default.green('All dependencies are already installed'));
        }
        // Create utils file if it doesn't exist
        spinner.start('Setting up utils...');
        const utilsPath = (config.aliases.utils ?? '@/lib/utils').replace(/^@\//, '');
        const fullUtilsPath = path_1.default.resolve(cwd, utilsPath + (config.tsx ? '.ts' : '.js'));
        if (!await fs_extra_1.default.pathExists(fullUtilsPath)) {
            await fs_extra_1.default.ensureDir(path_1.default.dirname(fullUtilsPath));
            const utilsContent = `import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
`;
            await fs_extra_1.default.writeFile(fullUtilsPath, utilsContent);
            spinner.succeed(chalk_1.default.green('Utils file created'));
        }
        else {
            spinner.succeed(chalk_1.default.green('Utils file already exists'));
        }
        // Create components directory
        const componentsPath = config.aliases.components.replace(/^@\//, '');
        const uiPath = path_1.default.resolve(cwd, componentsPath, 'ui');
        await fs_extra_1.default.ensureDir(uiPath);
        // Setup Tailwind CSS if needed
        if (!hasTailwind) {
            spinner.start('Setting up Tailwind CSS...');
            try {
                await execa('npx', ['tailwindcss', 'init', '-p'], { cwd });
                // Update tailwind.config.js
                const tailwindConfigPath = path_1.default.resolve(cwd, 'tailwind.config.js');
                const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      perspective: {
        '1000': '1000px',
      },
    },
  },
  plugins: [],
}
`;
                await fs_extra_1.default.writeFile(tailwindConfigPath, tailwindConfig);
                spinner.succeed(chalk_1.default.green('Tailwind CSS configured'));
            }
            catch (error) {
                spinner.warn(chalk_1.default.yellow('Failed to setup Tailwind CSS automatically'));
                console.log(chalk_1.default.gray('Please set up Tailwind CSS manually: https://tailwindcss.com/docs/installation'));
            }
        }
        console.log(chalk_1.default.green('\n✅ Virtual UI has been initialized successfully!'));
        console.log(chalk_1.default.gray('\nNext steps:'));
        console.log(chalk_1.default.gray('1. Add components: `npx virtual-ui add parallax-card`'));
        console.log(chalk_1.default.gray('2. Import and use in your React app'));
        console.log(chalk_1.default.gray('3. Customize as needed'));
        console.log(chalk_1.default.gray('\nFor more information, visit: https://github.com/yourusername/virtual-ui'));
    }
    catch (error) {
        spinner.fail(chalk_1.default.red('Failed to initialize Virtual UI'));
        console.error(error);
    }
}
