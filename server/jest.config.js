module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>/src', '<rootDir>/__tests__'],
	testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
};
