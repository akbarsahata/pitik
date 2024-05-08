import { tap } from '../../../src/libs/utils/debuggers';

// Mock console.log to capture its output
const consoleLogSpy = jest.spyOn(console, 'log');

describe('tap', () => {
  afterEach(() => {
    // Clear the consoleLogSpy mock after each test
    consoleLogSpy.mockClear();
  });

  it('should log the data to the console', () => {
    const data = 'Hello, world!';
    const result = tap(data);

    // Expect the function to return the same data
    expect(result).toBe(data);

    // Expect console.log to be called with the data
    expect(consoleLogSpy).toHaveBeenCalledWith(data);
  });

  it('should log the stringified data to the console when stringify is true', () => {
    const data = { message: 'Hello, world!' };
    const result = tap(data, true);

    // Expect the function to return the same data
    expect(result).toBe(data);

    // Expect console.log to be called with the stringified data
    expect(consoleLogSpy).toHaveBeenCalledWith(JSON.stringify(data, null, 2));
  });
});
