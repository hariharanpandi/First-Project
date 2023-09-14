import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true, 
    collectCoverage:true,
    collectCoverageFrom:[
        '<rootDir>/src/controllers/**/*.ts',
        '<rootDir>/src/services/**/*.ts',
    ]
}

export default config;