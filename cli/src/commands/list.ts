import chalk from 'chalk';
import { getAllComponents } from '../utils/registry';

export async function listCommand() {
  const components = getAllComponents();

  console.log(chalk.blue('Available Virtual UI Components:\n'));

  if (components.length === 0) {
    console.log(chalk.gray('No components available.'));
    return;
  }

  components.forEach((component, index) => {
    const isLast = index === components.length - 1;
    const prefix = isLast ? '└─' : '├─';
    
    console.log(chalk.gray(prefix), chalk.white(component.name));
    console.log(chalk.gray(isLast ? '   ' : '│  '), chalk.gray(component.description));
    
    if (component.dependencies.length > 0) {
      console.log(chalk.gray(isLast ? '   ' : '│  '), chalk.dim(`Dependencies: ${component.dependencies.join(', ')}`));
    }
    
    if (!isLast) {
      console.log(chalk.gray('│'));
    }
  });

  console.log(chalk.gray('\nUsage:'));
  console.log(chalk.gray('  npx virtual-ui add [component-name]'));
  console.log(chalk.gray('\nExample:'));
  console.log(chalk.gray('  npx virtual-ui add parallax-card'));
} 