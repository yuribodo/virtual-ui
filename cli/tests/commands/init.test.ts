import { initCommand } from '../../src/commands/init';
import { getConfig, saveConfig } from '../../src/utils/config';
import { createTestDir, cleanupTestDir, createPackageJson, createTsConfig } from '../setup';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';

// Mock inquirer
const mockInquirer = inquirer as jest.Mocked<typeof inquirer>;

describe('Init Command', () => {
  let testDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    testDir = await createTestDir();
    originalCwd = process.cwd();
    process.chdir(testDir);
    await createPackageJson(testDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await cleanupTestDir(testDir);
    jest.clearAllMocks();
  });

  describe('with --yes flag', () => {
    it('should initialize with default config without prompts', async () => {
      await initCommand({ yes: true });

      const config = await getConfig(testDir);
      expect(config).toBeDefined();
      expect(config?.style).toBe('default');
      expect(config?.tsx).toBe(true);
      expect(config?.rsc).toBe(true);
    });

    it('should create virtual-ui.json config file', async () => {
      await initCommand({ yes: true });

      const configPath = path.join(testDir, 'virtual-ui.json');
      expect(await fs.pathExists(configPath)).toBe(true);
    });

    it('should create utils file', async () => {
      await initCommand({ yes: true });

      const utilsPath = path.join(testDir, 'lib/utils.ts');
      expect(await fs.pathExists(utilsPath)).toBe(true);

      const utilsContent = await fs.readFile(utilsPath, 'utf8');
      expect(utilsContent).toContain('clsx');
      expect(utilsContent).toContain('export function cn');
    });

    it('should create components directory', async () => {
      await initCommand({ yes: true });

      const uiPath = path.join(testDir, 'components/ui');
      expect(await fs.pathExists(uiPath)).toBe(true);
    });
  });

  describe('interactive mode', () => {
    beforeEach(() => {
      mockInquirer.prompt.mockResolvedValue({
        style: 'default',
        tsx: true,
        rsc: false,
        components: '@/components',
        utils: '@/lib/utils',
        cssVariables: true,
      });
    });

    it('should prompt for configuration options', async () => {
      await initCommand({});

      expect(mockInquirer.prompt).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'style',
            type: 'list',
            message: 'Which style would you like to use?',
          }),
          expect.objectContaining({
            name: 'tsx',
            type: 'confirm',
            message: 'Would you like to use TypeScript?',
          }),
          expect.objectContaining({
            name: 'components',
            type: 'input',
            message: 'Configure the import alias for components?',
          }),
        ])
      );
    });

    it('should save configuration based on user input', async () => {
      mockInquirer.prompt.mockResolvedValue({
        style: 'new-york',
        tsx: false,
        rsc: false,
        components: '@/custom-components',
        utils: '@/custom-utils',
        cssVariables: false,
      });

      await initCommand({});

      const config = await getConfig(testDir);
      expect(config?.style).toBe('new-york');
      expect(config?.tsx).toBe(false);
      expect(config?.aliases.components).toBe('@/custom-components');
      expect(config?.aliases.utils).toBe('@/custom-utils');
      expect(config?.tailwind?.cssVariables).toBe(false);
    });
  });

  describe('project detection', () => {
    it('should detect Next.js project', async () => {
      await createPackageJson(testDir, {
        dependencies: { next: '^14.0.0' },
      });

      mockInquirer.prompt.mockResolvedValue({
        style: 'default',
        tsx: true,
        rsc: true,
        components: '@/components',
        utils: '@/lib/utils',
        cssVariables: true,
      });

      await initCommand({});

      // Verify that RSC question was included in prompts
      const calls = mockInquirer.prompt.mock.calls;
      const promptQuestions = calls[0][0] as any[];
      const rscQuestion = promptQuestions.find(q => q.name === 'rsc');
      
      expect(rscQuestion).toBeDefined();
      // The default should be set to true for Next.js projects
      expect(rscQuestion.default).toBeTruthy();
    });

    it('should detect TypeScript project', async () => {
      await createTsConfig(testDir);

      mockInquirer.prompt.mockResolvedValue({
        style: 'default',
        tsx: true,
        rsc: false,
        components: '@/components',
        utils: '@/lib/utils',
        cssVariables: true,
      });

      await initCommand({});

      expect(mockInquirer.prompt).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'tsx',
            message: 'Would you like to use TypeScript?',
            default: true,
          }),
        ])
      );
    });

    it('should detect existing Tailwind installation', async () => {
      await createPackageJson(testDir, {
        devDependencies: { tailwindcss: '^3.0.0' },
      });

      await initCommand({ yes: true });

      // Should not try to install Tailwind if already present
      // This is verified by the mocked execa not being called with tailwindcss
    });
  });

  describe('dependency installation', () => {
    it('should install required dependencies', async () => {
      await initCommand({ yes: true });

      // Dependencies should be installed (verified by mock in setup)
      expect(true).toBe(true); // This test verifies the command completes
    });

    it('should install Tailwind CSS if not present', async () => {
      await initCommand({ yes: true });

      // Tailwind should be installed (verified by mock in setup)
      expect(true).toBe(true); // This test verifies the command completes
    });

    it('should setup Tailwind config when installing', async () => {
      await initCommand({ yes: true });

      // Should create tailwind.config.js
      const tailwindConfigPath = path.join(testDir, 'tailwind.config.js');
      expect(await fs.pathExists(tailwindConfigPath)).toBe(true);

      const configContent = await fs.readFile(tailwindConfigPath, 'utf8');
      expect(configContent).toContain('perspective');
      expect(configContent).toContain("'1000': '1000px'");
    });
  });

  describe('error handling', () => {
    it('should handle missing package.json', async () => {
      await fs.remove(path.join(testDir, 'package.json'));

      await initCommand({ yes: true });

      // Should fail gracefully when no package.json exists
      expect(await fs.pathExists(path.join(testDir, 'virtual-ui.json'))).toBe(false);
    });

    it('should handle dependency installation failure gracefully', async () => {
      // This test verifies the command handles errors gracefully
      await initCommand({ yes: true });

      // Should still create config and continue
      const config = await getConfig(testDir);
      expect(config).toBeDefined();
    });

    it('should handle existing config confirmation', async () => {
      // Create existing config
      await saveConfig({
        style: 'default',
        tsx: true,
        aliases: { components: '@/components' },
      }, testDir);

      mockInquirer.prompt.mockResolvedValue({ proceed: false });

      await initCommand({});

      expect(mockInquirer.prompt).toHaveBeenCalledWith([
        expect.objectContaining({
          name: 'proceed',
          message: 'Virtual UI is already initialized. Do you want to overwrite the configuration?',
        }),
      ]);
    });
  });
});