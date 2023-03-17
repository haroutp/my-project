module.exports = {
  preset: 'jest-playwright-preset',
  testMatch: ['**/*.test.js'],
  testTimeout: 30000,
  setupFiles: ['./jest.setup.js'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironmentOptions: {
    'jest-playwright': {
      browsers: ['chromium', 'firefox', 'webkit'],
      launchOptions: {
        headless: true,
        slowMo: 50,
      },
    },
  },
};
