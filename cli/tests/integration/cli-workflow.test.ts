import { initCommand } from '../../src/commands/init';
import { addCommand } from '../../src/commands/add';
import { listCommand } from '../../src/commands/list';
import { createTestDir, cleanupTestDir, createPackageJson } from '../setup';
import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';

// Mock inquirer
const mockInquirer = inquirer as jest.Mocked<typeof inquirer>;

describe('CLI Integration Tests', () => {
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

  describe('Complete workflow: init -> list -> add', () => {
    it('should complete full workflow successfully', async () => {
      // Step 1: Initialize project
      await initCommand({ yes: true });

      // Verify initialization
      expect(await fs.pathExists(path.join(testDir, 'virtual-ui.json'))).toBe(true);
      expect(await fs.pathExists(path.join(testDir, 'lib/utils.ts'))).toBe(true);
      expect(await fs.pathExists(path.join(testDir, 'components/ui'))).toBe(true);

      // Step 2: List components
      const mockConsoleLog = jest.fn();
      const originalLog = console.log;
      console.log = mockConsoleLog;

      await listCommand();

      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('Available Virtual UI Components:')
      );

      console.log = originalLog;

      // Step 3: Add component
      await addCommand(['parallax-card'], { cwd: testDir });

      // Verify component was added
      const componentPath = path.join(testDir, 'components/ui/parallax-card.tsx');
      expect(await fs.pathExists(componentPath)).toBe(true);

      const componentContent = await fs.readFile(componentPath, 'utf8');
      expect(componentContent).toContain('ParallaxCard');
      expect(componentContent).toContain('motion');
    });

    it('should handle custom configuration workflow', async () => {
      // Initialize with custom config
      mockInquirer.prompt.mockResolvedValue({
        style: 'new-york',
        tsx: true,
        rsc: false,
        components: '@/src/components',
        utils: '@/src/lib/utils',
        cssVariables: true,
      });

      await initCommand({});

      // Add component with custom paths
      await addCommand(['parallax-card'], { cwd: testDir });

      // Verify component was created in custom path
      const componentPath = path.join(testDir, 'src/components/ui/parallax-card.tsx');
      expect(await fs.pathExists(componentPath)).toBe(true);

      // Verify utils in custom path
      const utilsPath = path.join(testDir, 'src/lib/utils.ts');
      expect(await fs.pathExists(utilsPath)).toBe(true);
    });
  });

  describe('Error recovery scenarios', () => {
    it('should handle adding component before initialization', async () => {
      // Mock user accepting auto-initialization
      mockInquirer.prompt.mockResolvedValue({ shouldInit: true });

      // Try to add component without initialization - should auto-initialize
      await addCommand(['parallax-card'], { cwd: testDir });

      // Should auto-initialize and succeed
      const componentPath = path.join(testDir, 'components/ui/parallax-card.tsx');
      expect(await fs.pathExists(componentPath)).toBe(true);
      expect(await fs.pathExists(path.join(testDir, 'virtual-ui.json'))).toBe(true);
    });

    it('should handle re-initialization', async () => {
      // Initialize first time
      await initCommand({ yes: true });
      
      const firstConfig = await fs.readJSON(path.join(testDir, 'virtual-ui.json'));

      // Mock user declining re-initialization
      mockInquirer.prompt.mockResolvedValue({ proceed: false });
      
      await initCommand({});

      // Config should remain unchanged
      const unchangedConfig = await fs.readJSON(path.join(testDir, 'virtual-ui.json'));
      expect(unchangedConfig).toEqual(firstConfig);

      // Mock user accepting re-initialization
      mockInquirer.prompt.mockResolvedValue({ 
        proceed: true,
        style: 'new-york',
        tsx: false,
        rsc: false,
        components: '@/new-components',
        utils: '@/new-utils',
        cssVariables: false,
      });

      await initCommand({});

      // Config should be updated
      const newConfig = await fs.readJSON(path.join(testDir, 'virtual-ui.json'));
      expect(newConfig.style).toBe('new-york');
      expect(newConfig.tsx).toBe(false);
      expect(newConfig.aliases.components).toBe('@/new-components');
    });
  });

  describe('Real-world project scenarios', () => {
    it('should work with Next.js project structure', async () => {
      // Simulate Next.js project
      await createPackageJson(testDir, {
        dependencies: { 
          next: '^14.0.0',
          react: '^18.0.0',
          'react-dom': '^18.0.0'
        }
      });

      // Create Next.js structure
      await fs.ensureDir(path.join(testDir, 'app'));
      await fs.ensureDir(path.join(testDir, 'app/components'));

      await initCommand({ yes: true });

      // Verify Next.js specific settings
      const config = await fs.readJSON(path.join(testDir, 'virtual-ui.json'));
      expect(config.rsc).toBe(true);
      expect(config.tailwind.css).toBe('app/globals.css');

      await addCommand(['parallax-card'], { cwd: testDir });

      const componentPath = path.join(testDir, 'components/ui/parallax-card.tsx');
      expect(await fs.pathExists(componentPath)).toBe(true);
    });

    it('should work with TypeScript project', async () => {
      // Create TypeScript config
      await fs.writeJSON(path.join(testDir, 'tsconfig.json'), {
        compilerOptions: {
          target: 'es5',
          module: 'esnext',
          jsx: 'preserve',
          strict: true
        }
      });

      await initCommand({ yes: true });

      // Should create TypeScript utils
      const utilsPath = path.join(testDir, 'lib/utils.ts');
      expect(await fs.pathExists(utilsPath)).toBe(true);

      const utilsContent = await fs.readFile(utilsPath, 'utf8');
      expect(utilsContent).toContain('ClassValue');
      expect(utilsContent).toContain('type');
    });

    it('should work with existing Tailwind setup', async () => {
      // Create existing Tailwind config
      await fs.writeFile(path.join(testDir, 'tailwind.config.js'), `
        module.exports = {
          content: ['./src/**/*.{js,jsx}'],
          theme: { extend: {} },
          plugins: [],
        }
      `);

      await createPackageJson(testDir, {
        devDependencies: { tailwindcss: '^3.0.0' }
      });

      await initCommand({ yes: true });

      // Should not overwrite existing Tailwind config
      const config = await fs.readFile(path.join(testDir, 'tailwind.config.js'), 'utf8');
      expect(config).toContain('./src/**/*.{js,jsx}');
      expect(config).not.toContain('perspective'); // Our modification shouldn't be there
    });
  });

  describe('Performance and edge cases', () => {
    it('should handle large number of components efficiently', async () => {
      await initCommand({ yes: true });

      // Mock adding multiple components (if we had them)
      const promises = Array(5).fill(0).map(() => 
        addCommand(['parallax-card'], { cwd: testDir, yes: true })
      );

      const startTime = Date.now();
      await Promise.all(promises);
      const endTime = Date.now();

      // Should complete within reasonable time (5 seconds for 5 operations)
      expect(endTime - startTime).toBeLessThan(5000);
    });

    it('should handle network-like delays gracefully', async () => {
      await initCommand({ yes: true });

      // Test should complete within reasonable time
      const startTime = Date.now();
      await addCommand(['parallax-card'], { cwd: testDir });
      const endTime = Date.now();

      // Should complete without hanging
      expect(endTime - startTime).toBeLessThan(10000);
      
      const componentPath = path.join(testDir, 'components/ui/parallax-card.tsx');
      expect(await fs.pathExists(componentPath)).toBe(true);
    });
  });
});