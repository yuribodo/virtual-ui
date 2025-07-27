import { listCommand } from '../../src/commands/list';
import { getAllComponents } from '../../src/utils/registry';

// Mock console.log to capture output
const mockConsoleLog = jest.fn();
global.console.log = mockConsoleLog;

describe('List Command', () => {
  beforeEach(() => {
    mockConsoleLog.mockClear();
  });

  it('should list all available components', async () => {
    await listCommand();

    // Check that console.log was called with component information
    expect(mockConsoleLog).toHaveBeenCalled();
    
    // Check for header
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('Available Virtual UI Components:')
    );

    // Check for usage instructions
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('Usage:')
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('npx virtual-ui add [component-name]')
    );
  });

  it('should display component names and descriptions', async () => {
    const components = getAllComponents();
    
    await listCommand();

    // Check that each component is listed
    components.forEach(component => {
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining(component.name)
      );
    });
  });

  it('should display dependencies when available', async () => {
    await listCommand();

    // Check for dependencies display
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.anything(),
      expect.stringContaining('Dependencies:')
    );
  });

  it('should show example usage', async () => {
    await listCommand();

    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('Example:')
    );
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('npx virtual-ui add parallax-card')
    );
  });
});