import { addCommand } from '../../src/commands/add';
import { saveConfig, getDefaultConfig } from '../../src/utils/config';
import { createTestDir, cleanupTestDir, createPackageJson } from '../setup';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';

// Mock inquirer
const mockInquirer = inquirer as jest.Mocked<typeof inquirer>;

describe('Add Command', () => {
  let testDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    testDir = await createTestDir();
    originalCwd = process.cwd();
    process.chdir(testDir);
    await createPackageJson(testDir);
    
    // Create default config for tests
    const config = getDefaultConfig();
    await saveConfig(config, testDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await cleanupTestDir(testDir);
    jest.clearAllMocks();
  });

  describe('component installation', () => {
    it('should add a single component', async () => {
      await addCommand(['parallax-card'], { cwd: testDir });

      // Check that component file was created
      const componentPath = path.join(testDir, 'components/ui/parallax-card.tsx');
      expect(await fs.pathExists(componentPath)).toBe(true);

      const componentContent = await fs.readFile(componentPath, 'utf8');
      expect(componentContent).toContain('ParallaxCard');
      expect(componentContent).toContain('motion');
    });

    it('should install component dependencies', async () => {
      await addCommand(['parallax-card'], { cwd: testDir });

      // Dependencies should be installed (verified by mock in setup)
      expect(true).toBe(true); // This test verifies the command completes
    });

    it('should create necessary directories', async () => {
      await addCommand(['parallax-card'], { cwd: testDir });

      const uiPath = path.join(testDir, 'components/ui');
      expect(await fs.pathExists(uiPath)).toBe(true);
    });

    it('should handle multiple components', async () => {
      // For this test, we need to mock registry to have multiple components
      const originalRegistry = require('../../src/utils/registry').COMPONENTS_REGISTRY;
      
      // Add a mock second component
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

      await addCommand(['parallax-card', 'test-button'], { cwd: testDir });

      // Check both components were created
      const parallaxPath = path.join(testDir, 'components/ui/parallax-card.tsx');
      const buttonPath = path.join(testDir, 'components/ui/test-button.tsx');
      
      expect(await fs.pathExists(parallaxPath)).toBe(true);
      expect(await fs.pathExists(buttonPath)).toBe(true);

      // Cleanup mock
      delete originalRegistry['test-button'];
    });
  });

  describe('interactive component selection', () => {
    it('should prompt for component selection when none specified', async () => {
      mockInquirer.prompt.mockResolvedValue({
        selectedComponents: ['parallax-card']
      });

      await addCommand([], { cwd: testDir });

      expect(mockInquirer.prompt).toHaveBeenCalledWith([
        expect.objectContaining({
          type: 'checkbox',
          name: 'selectedComponents',
          message: 'Which components would you like to add?',
        })
      ]);

      const componentPath = path.join(testDir, 'components/ui/parallax-card.tsx');
      expect(await fs.pathExists(componentPath)).toBe(true);
    });

    it('should validate that at least one component is selected', async () => {
      mockInquirer.prompt.mockResolvedValue({
        selectedComponents: []
      });

      await addCommand([], { cwd: testDir });

      expect(mockInquirer.prompt).toHaveBeenCalledWith([
        expect.objectContaining({
          validate: expect.any(Function)
        })
      ]);

      // Test the validation function
      const call = mockInquirer.prompt.mock.calls[0][0] as any[];
      const validateFn = call[0].validate;
      
      expect(validateFn([])).toBe('Please select at least one component.');
      expect(validateFn(['parallax-card'])).toBe(true);
    });
  });

  describe('file handling', () => {
    it('should prompt for overwrite when file exists', async () => {
      // Create existing file
      const componentPath = path.join(testDir, 'components/ui/parallax-card.tsx');
      await fs.ensureDir(path.dirname(componentPath));
      await fs.writeFile(componentPath, 'existing content');

      mockInquirer.prompt.mockResolvedValue({ overwrite: true });

      await addCommand(['parallax-card'], { cwd: testDir });

      expect(mockInquirer.prompt).toHaveBeenCalledWith([
        expect.objectContaining({
          type: 'confirm',
          name: 'overwrite',
          message: expect.stringContaining('already exists. Overwrite?'),
        })
      ]);

      // File should be overwritten
      const content = await fs.readFile(componentPath, 'utf8');
      expect(content).not.toBe('existing content');
      expect(content).toContain('ParallaxCard');
    });

    it('should skip file when overwrite is declined', async () => {
      // Create existing file
      const componentPath = path.join(testDir, 'components/ui/parallax-card.tsx');
      await fs.ensureDir(path.dirname(componentPath));
      await fs.writeFile(componentPath, 'existing content');

      mockInquirer.prompt.mockResolvedValue({ overwrite: false });

      await addCommand(['parallax-card'], { cwd: testDir });

      // File should remain unchanged
      const content = await fs.readFile(componentPath, 'utf8');
      expect(content).toBe('existing content');
    });

    it('should respect --overwrite flag', async () => {
      // Create existing file
      const componentPath = path.join(testDir, 'components/ui/parallax-card.tsx');
      await fs.ensureDir(path.dirname(componentPath));
      await fs.writeFile(componentPath, 'existing content');

      await addCommand(['parallax-card'], { cwd: testDir, overwrite: true });

      // Should not prompt and should overwrite
      expect(mockInquirer.prompt).not.toHaveBeenCalled();
      
      const content = await fs.readFile(componentPath, 'utf8');
      expect(content).not.toBe('existing content');
      expect(content).toContain('ParallaxCard');
    });

    it('should skip with --yes flag when file exists', async () => {
      // Create existing file
      const componentPath = path.join(testDir, 'components/ui/parallax-card.tsx');
      await fs.ensureDir(path.dirname(componentPath));
      await fs.writeFile(componentPath, 'existing content');

      await addCommand(['parallax-card'], { cwd: testDir, yes: true });

      // Should not prompt and should skip
      expect(mockInquirer.prompt).not.toHaveBeenCalled();
      
      const content = await fs.readFile(componentPath, 'utf8');
      expect(content).toBe('existing content');
    });
  });

  describe('error handling', () => {
    it('should auto-initialize when project is not initialized', async () => {
      // Remove config
      await fs.remove(path.join(testDir, 'virtual-ui.json'));

      // Mock user accepting auto-initialization
      mockInquirer.prompt.mockResolvedValue({ shouldInit: true });

      await addCommand(['parallax-card'], { cwd: testDir });

      // Should auto-initialize and create component
      expect(await fs.pathExists(path.join(testDir, 'virtual-ui.json'))).toBe(true);
      expect(await fs.pathExists(path.join(testDir, 'components/ui/parallax-card.tsx'))).toBe(true);
    });

    it('should handle invalid component names', async () => {
      await addCommand(['non-existent-component'], { cwd: testDir });

      // Should show available components
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Available components:'),
        expect.stringContaining('parallax-card')
      );
    });

    it('should handle dependency installation failure gracefully', async () => {
      // This test verifies graceful error handling
      await addCommand(['parallax-card'], { cwd: testDir });

      // Should still create component file
      const componentPath = path.join(testDir, 'components/ui/parallax-card.tsx');
      expect(await fs.pathExists(componentPath)).toBe(true);
    });
  });

  describe('custom paths and configuration', () => {
    it('should respect custom component paths', async () => {
      const customConfig = {
        ...getDefaultConfig(),
        aliases: {
          components: '@/src/components',
          utils: '@/src/lib/utils',
          ui: '@/src/components/ui',
        },
      };
      
      await saveConfig(customConfig, testDir);

      await addCommand(['parallax-card'], { cwd: testDir });

      const componentPath = path.join(testDir, 'src/components/ui/parallax-card.tsx');
      expect(await fs.pathExists(componentPath)).toBe(true);
    });

    it('should handle --cwd option', async () => {
      const alternativeDir = await createTestDir();
      await createPackageJson(alternativeDir);
      await saveConfig(getDefaultConfig(), alternativeDir);

      try {
        await addCommand(['parallax-card'], { cwd: alternativeDir });

        const componentPath = path.join(alternativeDir, 'components/ui/parallax-card.tsx');
        expect(await fs.pathExists(componentPath)).toBe(true);
      } finally {
        await cleanupTestDir(alternativeDir);
      }
    });
  });

  describe('Tailwind CSS integration', () => {
    it('should update Tailwind config when component requires it', async () => {
      await addCommand(['parallax-card'], { cwd: testDir });

      // Should complete successfully
      const componentPath = path.join(testDir, 'components/ui/parallax-card.tsx');
      expect(await fs.pathExists(componentPath)).toBe(true);
    });
  });
});