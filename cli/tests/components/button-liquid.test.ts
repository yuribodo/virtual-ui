import { addCommand } from '../../src/commands/add';
import { saveConfig, getDefaultConfig } from '../../src/utils/config';
import { getComponent } from '../../src/utils/registry';
import { createTestDir, cleanupTestDir, createPackageJson } from '../setup';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';

// Mock inquirer
const mockInquirer = inquirer as jest.Mocked<typeof inquirer>;

describe('Button Liquid Component', () => {
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

  describe('Component Registry', () => {
    it('should be available in registry', () => {
      const component = getComponent('button-liquid');
      
      expect(component).toBeDefined();
      expect(component?.name).toBe('button-liquid');
      expect(component?.description).toBe('Interactive button component with liquid ripple effects');
      expect(component?.dependencies).toEqual(['motion', 'clsx']);
      expect(component?.files).toHaveLength(1);
      expect(component?.files[0].name).toBe('button-liquid.tsx');
      expect(component?.files[0].type).toBe('component');
    });

    it('should have valid component structure', () => {
      const component = getComponent('button-liquid');
      
      expect(component?.files[0].content).toContain('ButtonLiquid');
      expect(component?.files[0].content).toContain('export { ButtonLiquid }');
      expect(component?.files[0].content).toContain('motion');
      expect(component?.files[0].content).toContain('clsx');
      expect(component?.files[0].content).toContain('RippleEffect');
      expect(component?.files[0].content).toContain('ButtonLiquidProps');
    });

    it('should include all required props', () => {
      const component = getComponent('button-liquid');
      const content = component?.files[0].content || '';
      
      // Check for all the props interface
      expect(content).toContain('variant?: \'solid\' | \'outline\' | \'ghost\' | \'gradient\'');
      expect(content).toContain('size?: \'sm\' | \'md\' | \'lg\' | \'xl\'');
      expect(content).toContain('disabled?: boolean');
      expect(content).toContain('loading?: boolean');
      expect(content).toContain('rippleColor?: string');
      expect(content).toContain('rippleDuration?: number');
    });
  });

  describe('Component Installation', () => {
    it('should install button-liquid component successfully', async () => {
      await addCommand(['button-liquid'], { cwd: testDir });

      // Check that component file was created
      const componentPath = path.join(testDir, 'components/ui/button-liquid.tsx');
      expect(await fs.pathExists(componentPath)).toBe(true);

      const componentContent = await fs.readFile(componentPath, 'utf8');
      expect(componentContent).toContain('ButtonLiquid');
      expect(componentContent).toContain('motion');
      expect(componentContent).toContain('clsx');
      expect(componentContent).toContain('RippleEffect');
    });

    it('should create correct file structure', async () => {
      await addCommand(['button-liquid'], { cwd: testDir });

      // Check directory structure
      const uiPath = path.join(testDir, 'components/ui');
      expect(await fs.pathExists(uiPath)).toBe(true);

      const componentPath = path.join(testDir, 'components/ui/button-liquid.tsx');
      expect(await fs.pathExists(componentPath)).toBe(true);

      // Check that the file is a valid TypeScript/React component
      const content = await fs.readFile(componentPath, 'utf8');
      expect(content).toMatch(/^'use client';/);
      expect(content).toContain('export function ButtonLiquid');
      expect(content).toContain('export { ButtonLiquid }');
    });

    it('should include all variant styles', async () => {
      await addCommand(['button-liquid'], { cwd: testDir });

      const componentPath = path.join(testDir, 'components/ui/button-liquid.tsx');
      const content = await fs.readFile(componentPath, 'utf8');

      // Check for all variants
      expect(content).toContain('solid:');
      expect(content).toContain('outline:');
      expect(content).toContain('ghost:');
      expect(content).toContain('gradient:');

      // Check for size classes
      expect(content).toContain('sm:');
      expect(content).toContain('md:');
      expect(content).toContain('lg:');
      expect(content).toContain('xl:');
    });

    it('should include ripple animation logic', async () => {
      await addCommand(['button-liquid'], { cwd: testDir });

      const componentPath = path.join(testDir, 'components/ui/button-liquid.tsx');
      const content = await fs.readFile(componentPath, 'utf8');

      // Check for ripple-specific functionality
      expect(content).toContain('createRipple');
      expect(content).toContain('RippleEffect[]');
      expect(content).toContain('AnimatePresence');
      expect(content).toContain('getBoundingClientRect');
      expect(content).toContain('clientX - rect.left');
      expect(content).toContain('clientY - rect.top');
    });
  });

  describe('Auto-initialization with button-liquid', () => {
    it('should auto-initialize and install button-liquid in one command', async () => {
      // Remove config to test auto-init
      await fs.remove(path.join(testDir, 'virtual-ui.json'));

      mockInquirer.prompt.mockResolvedValue({ shouldInit: true });

      await addCommand(['button-liquid'], { cwd: testDir });

      // Should auto-initialize and create component
      expect(await fs.pathExists(path.join(testDir, 'virtual-ui.json'))).toBe(true);
      expect(await fs.pathExists(path.join(testDir, 'components/ui/button-liquid.tsx'))).toBe(true);
      expect(await fs.pathExists(path.join(testDir, 'lib/utils.ts'))).toBe(true);

      // Check component content
      const componentPath = path.join(testDir, 'components/ui/button-liquid.tsx');
      const content = await fs.readFile(componentPath, 'utf8');
      expect(content).toContain('ButtonLiquid');
      expect(content).toContain('createRipple');
    });
  });

  describe('Component Dependencies', () => {
    it('should list correct dependencies', () => {
      const component = getComponent('button-liquid');
      
      expect(component?.dependencies).toEqual(['motion', 'clsx']);
      expect(component?.devDependencies).toBeUndefined();
    });
  });
});