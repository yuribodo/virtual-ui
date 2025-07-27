import fs from 'fs-extra';
import path from 'path';
import os from 'os';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

// Create temporary test directory for each test
export const createTestDir = async (): Promise<string> => {
  const testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'virtual-ui-test-'));
  return testDir;
};

// Clean up test directory
export const cleanupTestDir = async (testDir: string): Promise<void> => {
  await fs.remove(testDir);
};

// Create a basic package.json for testing
export const createPackageJson = async (testDir: string, overrides: any = {}): Promise<void> => {
  const packageJson = {
    name: 'test-project',
    version: '1.0.0',
    dependencies: {},
    devDependencies: {},
    ...overrides,
  };
  
  await fs.writeJSON(path.join(testDir, 'package.json'), packageJson, { spaces: 2 });
};

// Create a basic tsconfig.json
export const createTsConfig = async (testDir: string): Promise<void> => {
  const tsConfig = {
    compilerOptions: {
      target: "es5",
      lib: ["dom", "dom.iterable", "es6"],
      allowJs: true,
      skipLibCheck: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      strict: true,
      forceConsistentCasingInFileNames: true,
      moduleResolution: "node",
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: "preserve"
    },
    include: ["src/**/*"],
    exclude: ["node_modules"]
  };
  
  await fs.writeJSON(path.join(testDir, 'tsconfig.json'), tsConfig, { spaces: 2 });
};

// Mock execa to avoid actual npm installs in tests
jest.mock('execa', () => ({
  execa: jest.fn().mockResolvedValue({ stdout: 'mocked output' }),
}));

// Mock ora (spinner) to avoid spinner output in tests
jest.mock('ora', () => {
  return jest.fn(() => ({
    start: jest.fn().mockReturnThis(),
    succeed: jest.fn().mockReturnThis(),
    fail: jest.fn().mockReturnThis(),
    warn: jest.fn().mockReturnThis(),
    stop: jest.fn().mockReturnThis(),
    text: '',
  }));
});

// Mock inquirer for automated responses
jest.mock('inquirer', () => ({
  prompt: jest.fn(),
}));