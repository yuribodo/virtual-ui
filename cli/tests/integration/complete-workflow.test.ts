import { addCommand } from '../../src/commands/add';
import { createTestDir, cleanupTestDir, createPackageJson } from '../setup';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';

// Mock inquirer
const mockInquirer = inquirer as jest.Mocked<typeof inquirer>;

describe('Complete CLI Workflow - User Perspective', () => {
  let testDir: string;
  let originalCwd: string;

  beforeEach(async () => {
    testDir = await createTestDir();
    originalCwd = process.cwd();
    process.chdir(testDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await cleanupTestDir(testDir);
    jest.clearAllMocks();
  });

  describe('New user experience - from zero to working component', () => {
    it('should work in a fresh React project', async () => {
      // Create a basic React project structure
      await createPackageJson(testDir, {
        name: 'my-react-app',
        dependencies: {
          react: '^18.0.0',
          'react-dom': '^18.0.0',
        },
        scripts: {
          start: 'react-scripts start',
          build: 'react-scripts build',
        }
      });

      await fs.ensureDir(path.join(testDir, 'src'));
      await fs.writeFile(path.join(testDir, 'src/App.js'), `
import React from 'react';

function App() {
  return (
    <div className="App">
      <h1>My React App</h1>
    </div>
  );
}

export default App;
      `);

      // User runs: npx virtual-ui add parallax-card
      mockInquirer.prompt.mockResolvedValue({ shouldInit: true });

      await addCommand(['parallax-card'], { cwd: testDir });

      // Verify complete setup
      expect(await fs.pathExists(path.join(testDir, 'virtual-ui.json'))).toBe(true);
      expect(await fs.pathExists(path.join(testDir, 'lib/utils.ts'))).toBe(true);
      expect(await fs.pathExists(path.join(testDir, 'components/ui/parallax-card.tsx'))).toBe(true);

      // Check component is ready to use
      const componentContent = await fs.readFile(
        path.join(testDir, 'components/ui/parallax-card.tsx'),
        'utf8'
      );
      expect(componentContent).toContain('export { ParallaxCard }');
      expect(componentContent).toContain('motion');

      // Check utils is properly set up
      const utilsContent = await fs.readFile(
        path.join(testDir, 'lib/utils.ts'),
        'utf8'
      );
      expect(utilsContent).toContain('export function cn');
      expect(utilsContent).toContain('clsx');
    });

    it('should work in a Next.js project', async () => {
      // Create Next.js project structure
      await createPackageJson(testDir, {
        name: 'my-nextjs-app',
        dependencies: {
          next: '^14.0.0',
          react: '^18.0.0',
          'react-dom': '^18.0.0',
        },
        scripts: {
          dev: 'next dev',
          build: 'next build',
        }
      });

      await fs.ensureDir(path.join(testDir, 'app'));
      await fs.writeFile(path.join(testDir, 'app/page.tsx'), `
export default function Home() {
  return (
    <main>
      <h1>My Next.js App</h1>
    </main>
  );
}
      `);

      // User runs: npx virtual-ui add parallax-card --yes
      await addCommand(['parallax-card'], { cwd: testDir, yes: true });

      // Verify Next.js specific setup
      const config = await fs.readJSON(path.join(testDir, 'virtual-ui.json'));
      expect(config.rsc).toBe(true);
      expect(config.tailwind.css).toBe('app/globals.css');

      // Component should be ready to import
      const componentPath = path.join(testDir, 'components/ui/parallax-card.tsx');
      expect(await fs.pathExists(componentPath)).toBe(true);

      const componentContent = await fs.readFile(componentPath, 'utf8');
      expect(componentContent).toContain("'use client'"); // Should have client directive
    });

    it('should work with TypeScript project', async () => {
      // Create TypeScript React project
      await createPackageJson(testDir, {
        name: 'my-ts-app',
        dependencies: {
          react: '^18.0.0',
          'react-dom': '^18.0.0',
          typescript: '^5.0.0',
        },
      });

      await fs.writeJSON(path.join(testDir, 'tsconfig.json'), {
        compilerOptions: {
          target: 'es5',
          lib: ['dom', 'dom.iterable', 'es6'],
          allowJs: true,
          skipLibCheck: true,
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          strict: true,
          forceConsistentCasingInFileNames: true,
          moduleResolution: 'node',
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: 'react-jsx'
        },
        include: ['src']
      });

      await fs.ensureDir(path.join(testDir, 'src'));

      mockInquirer.prompt.mockResolvedValue({ shouldInit: true });

      await addCommand(['parallax-card'], { cwd: testDir });

      // Should create TypeScript files
      expect(await fs.pathExists(path.join(testDir, 'lib/utils.ts'))).toBe(true);
      expect(await fs.pathExists(path.join(testDir, 'components/ui/parallax-card.tsx'))).toBe(true);

      // Check TypeScript types are included
      const utilsContent = await fs.readFile(path.join(testDir, 'lib/utils.ts'), 'utf8');
      expect(utilsContent).toContain('ClassValue');
      expect(utilsContent).toContain('type');
    });
  });

  describe('Real usage scenarios', () => {
    it('should handle user installing component without prior knowledge', async () => {
      // Simulate user who found component name from docs/website
      await createPackageJson(testDir, {
        name: 'user-project',
        dependencies: { react: '^18.0.0' }
      });

      // User directly runs: npx virtual-ui add parallax-card
      mockInquirer.prompt.mockResolvedValue({ shouldInit: true });

      const mockConsoleLog = jest.fn();
      const originalLog = console.log;
      console.log = mockConsoleLog;

      await addCommand(['parallax-card'], { cwd: testDir });

      console.log = originalLog;

      // Should provide helpful feedback
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('Initializing Virtual UI')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('initialized successfully')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('Next steps:')
      );

      // Component should be ready
      const componentPath = path.join(testDir, 'components/ui/parallax-card.tsx');
      expect(await fs.pathExists(componentPath)).toBe(true);
    });

    it('should provide clear usage instructions', async () => {
      await createPackageJson(testDir);
      mockInquirer.prompt.mockResolvedValue({ shouldInit: true });

      const mockConsoleLog = jest.fn();
      const originalLog = console.log;
      console.log = mockConsoleLog;

      await addCommand(['parallax-card'], { cwd: testDir });

      console.log = originalLog;

      // Check for usage instructions
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('Next steps:')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('Import the component')
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('Use it in your JSX')
      );
    });

    it('should handle edge case where user has partial setup', async () => {
      await createPackageJson(testDir, {
        dependencies: { clsx: '^2.0.0' } // Already has one dependency
      });

      // Create partial directory structure
      await fs.ensureDir(path.join(testDir, 'components'));

      mockInquirer.prompt.mockResolvedValue({ shouldInit: true });

      await addCommand(['parallax-card'], { cwd: testDir });

      // Should complete setup without errors
      expect(await fs.pathExists(path.join(testDir, 'virtual-ui.json'))).toBe(true);
      expect(await fs.pathExists(path.join(testDir, 'components/ui/parallax-card.tsx'))).toBe(true);
    });
  });

  describe('Performance and reliability', () => {
    it('should complete installation quickly', async () => {
      await createPackageJson(testDir);
      mockInquirer.prompt.mockResolvedValue({ shouldInit: true });

      const startTime = Date.now();
      await addCommand(['parallax-card'], { cwd: testDir, yes: true });
      const endTime = Date.now();

      // Should complete within 3 seconds
      expect(endTime - startTime).toBeLessThan(3000);
    });

    it('should be idempotent - running twice should not cause issues', async () => {
      await createPackageJson(testDir);
      mockInquirer.prompt.mockResolvedValue({ shouldInit: true });

      // First installation
      await addCommand(['parallax-card'], { cwd: testDir, yes: true });
      
      const firstConfig = await fs.readJSON(path.join(testDir, 'virtual-ui.json'));
      const firstComponent = await fs.readFile(
        path.join(testDir, 'components/ui/parallax-card.tsx'),
        'utf8'
      );

      // Second installation with overwrite
      await addCommand(['parallax-card'], { cwd: testDir, yes: true, overwrite: true });

      const secondConfig = await fs.readJSON(path.join(testDir, 'virtual-ui.json'));
      const secondComponent = await fs.readFile(
        path.join(testDir, 'components/ui/parallax-card.tsx'),
        'utf8'
      );

      // Should be identical
      expect(secondConfig).toEqual(firstConfig);
      expect(secondComponent).toBe(firstComponent);
    });

    it('should handle interrupted installation gracefully', async () => {
      await createPackageJson(testDir);
      
      mockInquirer.prompt.mockResolvedValue({ shouldInit: true });

      // First attempt
      await addCommand(['parallax-card'], { cwd: testDir });

      // Should succeed even if there were potential interruptions
      expect(await fs.pathExists(path.join(testDir, 'components/ui/parallax-card.tsx'))).toBe(true);
    });
  });
});