import { getConfig, saveConfig, getDefaultConfig, resolveConfigPaths } from '../../src/utils/config';
import { createTestDir, cleanupTestDir, createPackageJson } from '../setup';
import fs from 'fs-extra';
import path from 'path';

describe('Config Utils', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = await createTestDir();
    await createPackageJson(testDir);
  });

  afterEach(async () => {
    await cleanupTestDir(testDir);
  });

  describe('getDefaultConfig', () => {
    it('should return default configuration', () => {
      const config = getDefaultConfig();
      
      expect(config).toEqual({
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
      });
    });
  });

  describe('saveConfig', () => {
    it('should save config to virtual-ui.json', async () => {
      const config = getDefaultConfig();
      
      await saveConfig(config, testDir);
      
      const configPath = path.join(testDir, 'virtual-ui.json');
      expect(await fs.pathExists(configPath)).toBe(true);
      
      const savedConfig = await fs.readJSON(configPath);
      expect(savedConfig).toEqual(config);
    });
  });

  describe('getConfig', () => {
    it('should return null when no config exists', async () => {
      const config = await getConfig(testDir);
      expect(config).toBeNull();
    });

    it('should load config from virtual-ui.json', async () => {
      const expectedConfig = getDefaultConfig();
      await saveConfig(expectedConfig, testDir);
      
      const config = await getConfig(testDir);
      expect(config).toEqual(expectedConfig);
    });

    it('should load config from package.json', async () => {
      const packageJsonConfig = {
        'virtual-ui': {
          style: 'new-york',
          aliases: {
            components: '@/custom-components',
            utils: '@/custom-utils',
          },
        },
      };
      
      await createPackageJson(testDir, packageJsonConfig);
      
      const config = await getConfig(testDir);
      expect(config?.style).toBe('new-york');
      expect(config?.aliases.components).toBe('@/custom-components');
    });
  });

  describe('resolveConfigPaths', () => {
    it('should resolve paths correctly', () => {
      const config = getDefaultConfig();
      const paths = resolveConfigPaths(testDir, config);
      
      expect(paths.tailwindConfig).toBe(path.resolve(testDir, 'tailwind.config.js'));
      expect(paths.tailwindCSS).toBe(path.resolve(testDir, 'app/globals.css'));
      expect(paths.components).toBe(path.resolve(testDir, 'components'));
      expect(paths.utils).toBe(path.resolve(testDir, 'lib/utils'));
      expect(paths.ui).toBe(path.resolve(testDir, 'components/ui'));
    });

    it('should handle custom aliases', () => {
      const config = {
        ...getDefaultConfig(),
        aliases: {
          components: '@/src/components',
          utils: '@/src/lib/utils',
          ui: '@/src/components/ui',
        },
      };
      
      const paths = resolveConfigPaths(testDir, config);
      
      expect(paths.components).toBe(path.resolve(testDir, 'src/components'));
      expect(paths.utils).toBe(path.resolve(testDir, 'src/lib/utils'));
      expect(paths.ui).toBe(path.resolve(testDir, 'src/components/ui'));
    });
  });
});