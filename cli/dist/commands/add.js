"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCommand = addCommand;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const inquirer_1 = __importDefault(require("inquirer"));
const execaModule = __importStar(require("execa"));
const config_1 = require("../utils/config");
const registry_1 = require("../utils/registry");
// Work around type issues between ESM-only `execa` and TypeScript
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
const execa = execaModule.execa;
async function addCommand(components, options) {
    const cwd = options.cwd || process.cwd();
    // Check if project is initialized
    let config = await (0, config_1.getConfig)(cwd);
    if (!config) {
        console.log(chalk_1.default.yellow('⚠ Virtual UI is not initialized in this project.'));
        if (!options.yes) {
            const { shouldInit } = await inquirer_1.default.prompt([
                {
                    type: 'confirm',
                    name: 'shouldInit',
                    message: 'Would you like to initialize Virtual UI now?',
                    default: true,
                },
            ]);
            if (!shouldInit) {
                console.log(chalk_1.default.gray('Installation cancelled. Run \`npx virtual-ui init\` to get started.'));
                return;
            }
        }
        console.log(chalk_1.default.blue('🚀 Initializing Virtual UI...'));
        // Auto-initialize with sensible defaults
        const { initCommand } = await Promise.resolve().then(() => __importStar(require('./init')));
        await initCommand({ yes: true });
        // Re-fetch config after initialization
        config = await (0, config_1.getConfig)(cwd);
        if (!config) {
            console.error(chalk_1.default.red('✗ Failed to initialize Virtual UI.'));
            return;
        }
        console.log(chalk_1.default.green('✅ Virtual UI initialized successfully!'));
    }
    // If no components specified, prompt for selection
    if (components.length === 0) {
        const availableComponents = (0, registry_1.getComponentNames)();
        const { selectedComponents } = await inquirer_1.default.prompt([
            {
                type: 'checkbox',
                name: 'selectedComponents',
                message: 'Which components would you like to add?',
                choices: availableComponents.map(name => ({
                    name: (0, registry_1.getComponent)(name)?.description || name,
                    value: name,
                })),
                validate: (input) => {
                    if (input.length === 0) {
                        return 'Please select at least one component.';
                    }
                    return true;
                },
            },
        ]);
        components = selectedComponents;
    }
    const spinner = (0, ora_1.default)('Adding components...').start();
    try {
        const paths = (0, config_1.resolveConfigPaths)(cwd, config);
        // Ensure directories exist
        await fs_extra_1.default.ensureDir(paths.ui);
        if (paths.utils) {
            await fs_extra_1.default.ensureDir(path_1.default.dirname(paths.utils));
        }
        const componentsToInstall = [];
        const dependenciesToInstall = new Set();
        const devDependenciesToInstall = new Set();
        // Collect all components and dependencies
        for (const componentName of components) {
            const component = (0, registry_1.getComponent)(componentName);
            if (!component) {
                spinner.fail(chalk_1.default.red(`Component "${componentName}" not found.`));
                console.log(chalk_1.default.gray('Available components:'), (0, registry_1.getComponentNames)().join(', '));
                return;
            }
            componentsToInstall.push(component);
            // Collect dependencies
            component.dependencies.forEach(dep => dependenciesToInstall.add(dep));
            component.devDependencies?.forEach(dep => devDependenciesToInstall.add(dep));
        }
        spinner.text = 'Installing dependencies...';
        // Install dependencies
        if (dependenciesToInstall.size > 0) {
            const deps = Array.from(dependenciesToInstall);
            try {
                await execa('npm', ['install', ...deps], { cwd });
                spinner.succeed(chalk_1.default.green(`Installed dependencies: ${deps.join(', ')}`));
            }
            catch (error) {
                spinner.warn(chalk_1.default.yellow(`Failed to install dependencies: ${deps.join(', ')}`));
                console.log(chalk_1.default.gray('Please install them manually:'), `npm install ${deps.join(' ')}`);
            }
        }
        if (devDependenciesToInstall.size > 0) {
            const devDeps = Array.from(devDependenciesToInstall);
            try {
                await execa('npm', ['install', '--save-dev', ...devDeps], { cwd });
                spinner.succeed(chalk_1.default.green(`Installed dev dependencies: ${devDeps.join(', ')}`));
            }
            catch (error) {
                spinner.warn(chalk_1.default.yellow(`Failed to install dev dependencies: ${devDeps.join(', ')}`));
                console.log(chalk_1.default.gray('Please install them manually:'), `npm install --save-dev ${devDeps.join(' ')}`);
            }
        }
        spinner.text = 'Adding components...';
        // Add components
        for (const component of componentsToInstall) {
            for (const file of component.files) {
                let targetPath;
                if (file.target) {
                    targetPath = path_1.default.resolve(cwd, file.target);
                }
                else if (file.type === 'component') {
                    targetPath = path_1.default.resolve(paths.ui, file.name);
                }
                else if (file.type === 'utils') {
                    targetPath = path_1.default.resolve(path_1.default.dirname(paths.utils), file.name);
                }
                else {
                    targetPath = path_1.default.resolve(paths.ui, file.name);
                }
                // Check if file exists
                if (await fs_extra_1.default.pathExists(targetPath) && !options.overwrite) {
                    if (!options.yes) {
                        const { overwrite } = await inquirer_1.default.prompt([
                            {
                                type: 'confirm',
                                name: 'overwrite',
                                message: `${path_1.default.relative(cwd, targetPath)} already exists. Overwrite?`,
                                default: false,
                            },
                        ]);
                        if (!overwrite) {
                            continue;
                        }
                    }
                    else {
                        console.log(chalk_1.default.yellow(`Skipping ${path_1.default.relative(cwd, targetPath)} (already exists)`));
                        continue;
                    }
                }
                await fs_extra_1.default.ensureDir(path_1.default.dirname(targetPath));
                await fs_extra_1.default.writeFile(targetPath, file.content);
                spinner.succeed(chalk_1.default.green(`Added ${path_1.default.relative(cwd, targetPath)}`));
            }
            // Update Tailwind config if needed
            if (component.tailwindConfig) {
                await updateTailwindConfig(paths.tailwindConfig, component.tailwindConfig);
                spinner.succeed(chalk_1.default.green('Updated Tailwind CSS configuration'));
            }
            // Add global CSS if needed
            if (component.globalCSS) {
                await updateGlobalCSS(paths.tailwindCSS, component.globalCSS);
                spinner.succeed(chalk_1.default.green('Updated global CSS'));
            }
        }
        spinner.succeed(chalk_1.default.green(`Successfully added ${components.length} component(s)!`));
        console.log(chalk_1.default.gray('\nNext steps:'));
        console.log(chalk_1.default.gray('1. Import the component in your React app'));
        console.log(chalk_1.default.gray('2. Use it in your JSX'));
        console.log(chalk_1.default.gray('3. Customize as needed'));
    }
    catch (error) {
        spinner.fail(chalk_1.default.red('Failed to add components'));
        console.error(error);
    }
}
async function updateTailwindConfig(configPath, componentConfig) {
    if (!await fs_extra_1.default.pathExists(configPath)) {
        return;
    }
    try {
        const currentConfig = await fs_extra_1.default.readFile(configPath, 'utf8');
        // Check if perspective config already exists
        if (currentConfig.includes('perspective') && currentConfig.includes('1000px')) {
            return; // Already configured
        }
        // Simple string-based merging for perspective config
        if (componentConfig.theme?.extend?.perspective) {
            const perspectiveConfig = `
      perspective: {
        '1000': '1000px',
      },`;
            // Find the extend section and add perspective
            if (currentConfig.includes('extend: {')) {
                const updatedConfig = currentConfig.replace('extend: {', `extend: {${perspectiveConfig}`);
                await fs_extra_1.default.writeFile(configPath, updatedConfig);
                console.log(chalk_1.default.green('📝 Updated Tailwind config with perspective utilities'));
            }
            else {
                console.log(chalk_1.default.yellow('⚠ Please manually add perspective utilities to your Tailwind config:'));
                console.log(chalk_1.default.gray('theme: { extend: { perspective: { "1000": "1000px" } } }'));
            }
        }
    }
    catch (error) {
        console.log(chalk_1.default.yellow('⚠ Could not automatically update Tailwind config. Please check the documentation.'));
    }
}
async function updateGlobalCSS(cssPath, cssRules) {
    if (!await fs_extra_1.default.pathExists(cssPath)) {
        return;
    }
    const currentCSS = await fs_extra_1.default.readFile(cssPath, 'utf8');
    const newRules = cssRules.filter(rule => !currentCSS.includes(rule));
    if (newRules.length > 0) {
        const updatedCSS = currentCSS + '\n\n' + newRules.join('\n');
        await fs_extra_1.default.writeFile(cssPath, updatedCSS);
    }
}
