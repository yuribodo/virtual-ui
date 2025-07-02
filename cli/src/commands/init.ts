import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import execa from 'execa';
import { getConfig, saveConfig, getDefaultConfig, type Config } from '../utils/config';

interface InitOptions {
  yes?: boolean;
}

export async function initCommand(options: InitOptions) {
  const cwd = process.cwd();
  
  console.log(chalk.blue('Welcome to Virtual UI!'));
  console.log(chalk.gray('This will initialize Virtual UI in your project.\n'));

  // Check if already initialized
  const existingConfig = await getConfig(cwd);
  if (existingConfig && !options.yes) {
    const { proceed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: 'Virtual UI is already initialized. Do you want to overwrite the configuration?',
        default: false,
      },
    ]);

    if (!proceed) {
      console.log(chalk.gray('Initialization cancelled.'));
      return;
    }
  }

  const spinner = ora('Initializing...').start();

  try {
    // Detect project type
    const packageJsonPath = path.resolve(cwd, 'package.json');
    const packageJson = await fs.readJSON(packageJsonPath).catch(() => null);
    
    if (!packageJson) {
      spinner.fail(chalk.red('No package.json found. Please run this command in a Node.js project.'));
      return;
    }

    const isNextJs = packageJson.dependencies?.next || packageJson.devDependencies?.next;
    const hasTypeScript = await fs.pathExists(path.resolve(cwd, 'tsconfig.json'));
    const hasTailwind = packageJson.dependencies?.tailwindcss || packageJson.devDependencies?.tailwindcss;

    spinner.stop();

    let config: Config;

    if (options.yes) {
      config = getDefaultConfig();
    } else {
      // Interactive setup
      const answers = await inquirer.prompt([
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
    await saveConfig(config, cwd);
    spinner.succeed(chalk.green('Configuration saved'));

    // Check and install dependencies
    spinner.start('Checking dependencies...');
    
    const requiredDeps = ['clsx'];
    const requiredDevDeps = [];

    if (!hasTailwind) {
      requiredDevDeps.push('tailwindcss', 'postcss', 'autoprefixer');
    }

    const missingDeps = requiredDeps.filter(dep => 
      !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
    );

    const missingDevDeps = requiredDevDeps.filter(dep => 
      !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
    );

    if (missingDeps.length > 0 || missingDevDeps.length > 0) {
      spinner.text = 'Installing dependencies...';
      
      try {
        if (missingDeps.length > 0) {
          await execa('npm', ['install', ...missingDeps], { cwd });
        }
        
        if (missingDevDeps.length > 0) {
          await execa('npm', ['install', '--save-dev', ...missingDevDeps], { cwd });
        }
        
        spinner.succeed(chalk.green('Dependencies installed'));
      } catch (error) {
        spinner.warn(chalk.yellow('Failed to install some dependencies'));
        console.log(chalk.gray('Please install them manually:'));
        if (missingDeps.length > 0) {
          console.log(chalk.gray(`npm install ${missingDeps.join(' ')}`));
        }
        if (missingDevDeps.length > 0) {
          console.log(chalk.gray(`npm install --save-dev ${missingDevDeps.join(' ')}`));
        }
      }
    } else {
      spinner.succeed(chalk.green('All dependencies are already installed'));
    }

    // Create utils file if it doesn't exist
    spinner.start('Setting up utils...');
    
    const utilsPath = (config.aliases.utils ?? '@/lib/utils').replace(/^@\//, '');
    const fullUtilsPath = path.resolve(cwd, utilsPath + (config.tsx ? '.ts' : '.js'));
    
    if (!await fs.pathExists(fullUtilsPath)) {
      await fs.ensureDir(path.dirname(fullUtilsPath));
      const utilsContent = `import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
`;
      await fs.writeFile(fullUtilsPath, utilsContent);
      spinner.succeed(chalk.green('Utils file created'));
    } else {
      spinner.succeed(chalk.green('Utils file already exists'));
    }

    // Create components directory
    const componentsPath = config.aliases.components.replace(/^@\//, '');
    const uiPath = path.resolve(cwd, componentsPath, 'ui');
    await fs.ensureDir(uiPath);

    // Setup Tailwind CSS if needed
    if (!hasTailwind) {
      spinner.start('Setting up Tailwind CSS...');
      
      try {
        await execa('npx', ['tailwindcss', 'init', '-p'], { cwd });
        
        // Update tailwind.config.js
        const tailwindConfigPath = path.resolve(cwd, 'tailwind.config.js');
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
        await fs.writeFile(tailwindConfigPath, tailwindConfig);
        
        spinner.succeed(chalk.green('Tailwind CSS configured'));
      } catch (error) {
        spinner.warn(chalk.yellow('Failed to setup Tailwind CSS automatically'));
        console.log(chalk.gray('Please set up Tailwind CSS manually: https://tailwindcss.com/docs/installation'));
      }
    }

    console.log(chalk.green('\n✅ Virtual UI has been initialized successfully!'));
    console.log(chalk.gray('\nNext steps:'));
    console.log(chalk.gray('1. Add components: `npx virtual-ui add parallax-card`'));
    console.log(chalk.gray('2. Import and use in your React app'));
    console.log(chalk.gray('3. Customize as needed'));
    console.log(chalk.gray('\nFor more information, visit: https://github.com/yourusername/virtual-ui'));

  } catch (error) {
    spinner.fail(chalk.red('Failed to initialize Virtual UI'));
    console.error(error);
  }
} 