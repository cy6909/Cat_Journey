// Simple test setup for Jest
global.performance = require('perf_hooks').performance;

// Mock console to reduce noise during tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};