import path from 'path';
import fs from 'fs-extra';
import { cosmiconfig } from 'cosmiconfig';
import { z } from 'zod';
import chalk from 'chalk';

const configSchema = z.object({
  style: z.enum(['default', 'new-york']).optional(),
  rsc: z.boolean().optional(),
  tsx: z.boolean().optional(),
  tailwind: z.object({
    config: z.string(),
    css: z.string(),
    baseColor: z.string().optional(),
    cssVariables: z.boolean().optional(),
    prefix: z.string().optional(),
  }).optional(),
  aliases: z.object({
    components: z.string(),
    utils: z.string().optional(),
    ui: z.string().optional(),
  }),
});

export type Config = z.infer<typeof configSchema>;

const DEFAULT_CONFIG: Config = {
  style: 'default',
  rsc: true,
  tsx: true,
  tailwind: {
    config: 'tailwind.config.js',
    css: 'app/globals.css',
    baseColor: 'slate',
    cssVariables: true,
  },
  aliases: {
    components: '@/components',
    utils: '@/lib/utils',
    ui: '@/components/ui',
  },
};

export async function getConfig(cwd: string): Promise<Config | null> {
  const explorer = cosmiconfig('virtual-ui', {
    searchPlaces: [
      'virtual-ui.json',
      'virtual-ui.config.json',
      'virtual-ui.config.js',
      'virtual-ui.config.ts',
      'package.json',
    ],
  });

  try {
    const result = await explorer.search(cwd);
    if (!result) return null;

    const config = configSchema.parse(result.config);
    return config;
  } catch (error) {
    console.error(chalk.red('Error reading config:'), error);
    return null;
  }
}

export async function saveConfig(config: Config, cwd: string): Promise<void> {
  const configPath = path.resolve(cwd, 'virtual-ui.json');
  await fs.writeJSON(configPath, config, { spaces: 2 });
}

export function getDefaultConfig(): Config {
  return DEFAULT_CONFIG;
}

export function resolveConfigPaths(cwd: string, config: Config) {
  const tailwindConfigPath = path.resolve(cwd, config.tailwind?.config || 'tailwind.config.js');
  const tailwindCssPath = path.resolve(cwd, config.tailwind?.css || 'app/globals.css');
  
  // Convert aliases to actual paths
  const componentsPath = config.aliases.components.replace(/^@\//, '');
  const utilsPath = config.aliases.utils?.replace(/^@\//, '') || 'lib/utils';
  const uiPath = config.aliases.ui?.replace(/^@\//, '') || 'components/ui';

  return {
    tailwindConfig: tailwindConfigPath,
    tailwindCSS: tailwindCssPath,
    components: path.resolve(cwd, componentsPath),
    utils: path.resolve(cwd, utilsPath),
    ui: path.resolve(cwd, uiPath),
  };
} 