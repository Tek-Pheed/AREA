/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
setupFilesAfterEnv: ['src/__test__/setup.js'],
    (module.exports = {
        preset: 'ts-jest',
        testEnvironment: 'node',
        testMatch: ['**/**/*.test.ts'],
        verbose: true,
        forceExit: true,
        clearMocks: true,
        resetMocks: true,
        restoreMocks: true,
        collectCoverage: true,
        coverageDirectory: 'coverage',
    });
