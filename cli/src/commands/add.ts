import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import * as execaModule from 'execa';
import { getConfig, resolveConfigPaths } from '../utils/config';
import { getComponent, getComponentNames } from '../utils/registry';

// Work around type issues between ESM-only `execa` and TypeScript
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
const execa: any = (execaModule as any).execa;

interface AddOptions {
  yes?: boolean;
  overwrite?: boolean;
  cwd?: string;
  path?: string;
}

export async function addCommand(components: string[], options: AddOptions) {
  const cwd = options.cwd || process.cwd();
  
  // Check if project is initialized
  const config = await getConfig(cwd);
  if (!config) {
    console.error(chalk.red('✗ Virtual UI is not initialized in this project.'));
    console.log(chalk.gray('Run \`npx virtual-ui init\` to get started.'));
    return;
  }

  // If no components specified, prompt for selection
  if (components.length === 0) {
    const availableComponents = getComponentNames();
    const { selectedComponents } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedComponents',
        message: 'Which components would you like to add?',
        choices: availableComponents.map(name => ({
          name: getComponent(name)?.description || name,
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

  const spinner = ora('Adding components...').start();

  try {
    const paths = resolveConfigPaths(cwd, config);
    
    // Ensure directories exist
    await fs.ensureDir(paths.ui);
    if (paths.utils) {
      await fs.ensureDir(path.dirname(paths.utils));
    }

    const componentsToInstall = [];
    const dependenciesToInstall = new Set<string>();
    const devDependenciesToInstall = new Set<string>();

    // Collect all components and dependencies
    for (const componentName of components) {
      const component = getComponent(componentName);
      if (!component) {
        spinner.fail(chalk.red(`Component "${componentName}" not found.`));
        console.log(chalk.gray('Available components:'), getComponentNames().join(', '));
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
        spinner.succeed(chalk.green(`Installed dependencies: ${deps.join(', ')}`));
      } catch (error) {
        spinner.warn(chalk.yellow(`Failed to install dependencies: ${deps.join(', ')}`));
        console.log(chalk.gray('Please install them manually:'), `npm install ${deps.join(' ')}`);
      }
    }

    if (devDependenciesToInstall.size > 0) {
      const devDeps = Array.from(devDependenciesToInstall);
      try {
        await execa('npm', ['install', '--save-dev', ...devDeps], { cwd });
        spinner.succeed(chalk.green(`Installed dev dependencies: ${devDeps.join(', ')}`));
      } catch (error) {
        spinner.warn(chalk.yellow(`Failed to install dev dependencies: ${devDeps.join(', ')}`));
        console.log(chalk.gray('Please install them manually:'), `npm install --save-dev ${devDeps.join(' ')}`);
      }
    }

    spinner.text = 'Adding components...';

    // Add components
    for (const component of componentsToInstall) {
      for (const file of component.files) {
        let targetPath: string;
        
        if (file.target) {
          targetPath = path.resolve(cwd, file.target);
        } else if (file.type === 'component') {
          targetPath = path.resolve(paths.ui, file.name);
        } else if (file.type === 'utils') {
          targetPath = path.resolve(path.dirname(paths.utils), file.name);
        } else {
          targetPath = path.resolve(paths.ui, file.name);
        }

        // Check if file exists
        if (await fs.pathExists(targetPath) && !options.overwrite) {
          if (!options.yes) {
            const { overwrite } = await inquirer.prompt([
              {
                type: 'confirm',
                name: 'overwrite',
                message: `${path.relative(cwd, targetPath)} already exists. Overwrite?`,
                default: false,
              },
            ]);
            
            if (!overwrite) {
              continue;
            }
          } else {
            console.log(chalk.yellow(`Skipping ${path.relative(cwd, targetPath)} (already exists)`));
            continue;
          }
        }

        await fs.ensureDir(path.dirname(targetPath));
        await fs.writeFile(targetPath, file.content);
        
        spinner.succeed(chalk.green(`Added ${path.relative(cwd, targetPath)}`));
      }

      // Update Tailwind config if needed
      if (component.tailwindConfig) {
        await updateTailwindConfig(paths.tailwindConfig, component.tailwindConfig);
        spinner.succeed(chalk.green('Updated Tailwind CSS configuration'));
      }

      // Add global CSS if needed
      if (component.globalCSS) {
        await updateGlobalCSS(paths.tailwindCSS, component.globalCSS);
        spinner.succeed(chalk.green('Updated global CSS'));
      }
    }

    spinner.succeed(chalk.green(`Successfully added ${components.length} component(s)!`));
    
    console.log(chalk.gray('\nNext steps:'));
    console.log(chalk.gray('1. Import the component in your React app'));
    console.log(chalk.gray('2. Use it in your JSX'));
    console.log(chalk.gray('3. Customize as needed'));

  } catch (error) {
    spinner.fail(chalk.red('Failed to add components'));
    console.error(error);
  }
}

async function updateTailwindConfig(configPath: string, config: any) {
  if (!await fs.pathExists(configPath)) {
    return;
  }

  // This is a simplified version - in production, you'd want to parse and merge properly
  const currentConfig = await fs.readFile(configPath, 'utf8');
  console.log(chalk.yellow('Tailwind config updates may be needed. Please check the documentation.'));
}

async function updateGlobalCSS(cssPath: string, cssRules: string[]) {
  if (!await fs.pathExists(cssPath)) {
    return;
  }

  const currentCSS = await fs.readFile(cssPath, 'utf8');
  const newRules = cssRules.filter(rule => !currentCSS.includes(rule));
  
  if (newRules.length > 0) {
    const updatedCSS = currentCSS + '\n\n' + newRules.join('\n');
    await fs.writeFile(cssPath, updatedCSS);
  }
} 