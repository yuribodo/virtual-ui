# Virtual UI CLI Test Suite

This directory contains comprehensive tests for the Virtual UI CLI tool.

## Test Structure

### Unit Tests
- **`utils/config.test.ts`** - Tests for configuration management utilities
- **`utils/registry.test.ts`** - Tests for component registry functionality  
- **`commands/init.test.ts`** - Tests for the `init` command
- **`commands/add.test.ts`** - Tests for the `add` command
- **`commands/list.test.ts`** - Tests for the `list` command
- **`commands/add-auto-init.test.ts`** - Tests for auto-initialization feature

### Integration Tests
- **`integration/cli-workflow.test.ts`** - End-to-end workflow tests
- **`integration/complete-workflow.test.ts`** - Real-world usage scenarios

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- config.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="auto-init"
```

## Test Features

### Mocking Strategy
- **File System**: Uses temporary directories for each test
- **External Commands**: Mocks `execa` to avoid actual npm installs
- **User Input**: Mocks `inquirer` for automated testing
- **Console Output**: Mocks console methods to test user feedback

### Test Scenarios
- Fresh project initialization
- Component installation with and without existing setup
- Auto-initialization on first component add
- Error handling and recovery
- Different project types (React, Next.js, TypeScript)
- Performance and reliability tests

### Key Test Cases

#### Auto-Initialization
Tests that users can run `npx virtual-ui add component-name` directly without prior setup:

```typescript
// User runs: npx virtual-ui add parallax-card
await addCommand(['parallax-card'], { cwd: testDir });

// Should auto-initialize and install component
expect(await fs.pathExists('virtual-ui.json')).toBe(true);
expect(await fs.pathExists('components/ui/parallax-card.tsx')).toBe(true);
```

#### Real-World Scenarios
- Adding components to existing React projects
- Working with Next.js App Router structure  
- TypeScript project compatibility
- Handling partial setups and edge cases

## Test Utilities

### Setup Helpers
- `createTestDir()` - Creates isolated test environment
- `createPackageJson()` - Sets up mock package.json
- `createTsConfig()` - Creates TypeScript configuration
- `cleanupTestDir()` - Cleans up after tests

### Assertions
Tests verify:
- File creation and content accuracy
- Configuration correctness
- Dependency installation
- User feedback messages
- Error handling
- Performance benchmarks

## Coverage Goals

- **Commands**: 100% coverage of all CLI commands
- **Utilities**: Complete coverage of config and registry helpers
- **Workflows**: End-to-end scenario testing
- **Error Cases**: Comprehensive error handling validation
- **User Experience**: Message clarity and workflow efficiency

## Development

When adding new features:

1. Add unit tests for individual functions
2. Add integration tests for complete workflows  
3. Update mock data if adding new components
4. Test both success and failure scenarios
5. Verify user experience with real-world project structures

## Mock Data

Tests use realistic component definitions and project structures to ensure accuracy. The test suite includes mocks for:

- Component registry entries
- Package.json variations
- TypeScript configurations
- Next.js project structures
- Tailwind CSS configurations