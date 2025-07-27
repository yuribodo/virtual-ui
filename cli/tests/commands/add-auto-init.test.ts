import { addCommand } from '../../src/commands/add';
import { getConfig } from '../../src/utils/config';
import { createTestDir, cleanupTestDir, createPackageJson } from '../setup';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';

// Mock inquirer
const mockInquirer = inquirer as jest.Mocked<typeof inquirer>;

describe('Add Command Auto-Initialization', () => {
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

  describe('Auto-initialization on first component add', () => {
    it('should auto-initialize when user confirms', async () => {
      // Mock user accepting initialization
      mockInquirer.prompt.mockResolvedValue({ shouldInit: true });

      await addCommand(['parallax-card'], { cwd: testDir });

      // Verify initialization occurred
      expect(await fs.pathExists(path.join(testDir, 'virtual-ui.json'))).toBe(true);
      expect(await fs.pathExists(path.join(testDir, 'lib/utils.ts'))).toBe(true);
      expect(await fs.pathExists(path.join(testDir, 'components/ui'))).toBe(true);

      // Verify component was added
      const componentPath = path.join(testDir, 'components/ui/parallax-card.tsx');
      expect(await fs.pathExists(componentPath)).toBe(true);

      const config = await getConfig(testDir);
      expect(config).toBeDefined();
      expect(config?.style).toBe('default');
    });

    it('should skip initialization when user declines', async () => {
      // Mock user declining initialization
      mockInquirer.prompt.mockResolvedValue({ shouldInit: false });

      await addCommand(['parallax-card'], { cwd: testDir });

      // Verify no initialization occurred
      expect(await fs.pathExists(path.join(testDir, 'virtual-ui.json'))).toBe(false);
      expect(await fs.pathExists(path.join(testDir, 'components/ui/parallax-card.tsx'))).toBe(false);

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Installation cancelled')
      );
    });

    it('should auto-initialize with --yes flag without prompting', async () => {
      await addCommand(['parallax-card'], { cwd: testDir, yes: true });

      // Should not prompt
      expect(mockInquirer.prompt).not.toHaveBeenCalled();

      // Verify initialization occurred
      expect(await fs.pathExists(path.join(testDir, 'virtual-ui.json'))).toBe(true);
      expect(await fs.pathExists(path.join(testDir, 'lib/utils.ts'))).toBe(true);

      // Verify component was added
      const componentPath = path.join(testDir, 'components/ui/parallax-card.tsx');
      expect(await fs.pathExists(componentPath)).toBe(true);
    });

    it('should show appropriate messages during auto-initialization', async () => {
      mockInquirer.prompt.mockResolvedValue({ shouldInit: true });

      await addCommand(['parallax-card'], { cwd: testDir });

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Virtual UI is not initialized')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Initializing Virtual UI...')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Virtual UI initialized successfully!')
      );
    });

    it('should handle initialization failure gracefully', async () => {
      // Mock a scenario where package.json doesn't exist (will cause init to fail)
      await fs.remove(path.join(testDir, 'package.json'));

      mockInquirer.prompt.mockResolvedValue({ shouldInit: true });

      await addCommand(['parallax-card'], { cwd: testDir });

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to initialize Virtual UI')
      );

      // Component should not be added
      const componentPath = path.join(testDir, 'components/ui/parallax-card.tsx');
      expect(await fs.pathExists(componentPath)).toBe(false);
    });
  });

  describe('Seamless user experience', () => {
    it('should complete entire workflow in one command', async () => {
      mockInquirer.prompt.mockResolvedValue({ shouldInit: true });

      const startTime = Date.now();
      await addCommand(['parallax-card'], { cwd: testDir });
      const endTime = Date.now();

      // Should complete quickly (under 5 seconds)
      expect(endTime - startTime).toBeLessThan(5000);

      // Verify everything is set up and working
      const config = await getConfig(testDir);
      expect(config).toBeDefined();

      const componentPath = path.join(testDir, 'components/ui/parallax-card.tsx');
      expect(await fs.pathExists(componentPath)).toBe(true);

      const utilsPath = path.join(testDir, 'lib/utils.ts');
      expect(await fs.pathExists(utilsPath)).toBe(true);

      // Component should be functional
      const componentContent = await fs.readFile(componentPath, 'utf8');
      expect(componentContent).toContain('ParallaxCard');
      expect(componentContent).toContain('motion');
      expect(componentContent).toContain('clsx');
    });

    it('should work with multiple components in one command', async () => {
      // Add mock second component for testing
      const originalRegistry = require('../../src/utils/registry').COMPONENTS_REGISTRY;
      originalRegistry['test-button'] = {
        name: 'test-button',
        description: 'Test button component',
        dependencies: ['clsx'],
        files: [{
          name: 'test-button.tsx',
          type: 'component',
          content: 'export const TestButton = () => <button>Test</button>;'
        }]
      };

      try {
        mockInquirer.prompt.mockResolvedValue({ shouldInit: true });

        await addCommand(['parallax-card', 'test-button'], { cwd: testDir });

        // Both components should be added
        expect(await fs.pathExists(path.join(testDir, 'components/ui/parallax-card.tsx'))).toBe(true);
        expect(await fs.pathExists(path.join(testDir, 'components/ui/test-button.tsx'))).toBe(true);

        // Only one initialization should occur
        const config = await getConfig(testDir);
        expect(config).toBeDefined();
      } finally {
        // Cleanup mock
        delete originalRegistry['test-button'];
      }
    });

    it('should handle interactive component selection with auto-init', async () => {
      // Mock interactive selection
      mockInquirer.prompt
        .mockResolvedValueOnce({ shouldInit: true }) // Auto-init prompt
        .mockResolvedValueOnce({ selectedComponents: ['parallax-card'] }); // Component selection

      await addCommand([], { cwd: testDir }); // No components specified

      // Should initialize and add selected component
      expect(await fs.pathExists(path.join(testDir, 'virtual-ui.json'))).toBe(true);
      expect(await fs.pathExists(path.join(testDir, 'components/ui/parallax-card.tsx'))).toBe(true);
    });
  });
});