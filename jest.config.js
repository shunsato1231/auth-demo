const path = require("path")

module.exports = {
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js'
    ],
    transform: {
        '^.+\\.(js|jsx|mjs)$': 'babel-jest',
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    setupFiles: [
        '<rootDir>/jest.setupEnzyme.ts'
    ],
    globals: {
        'ts-jest': {
            babelConfig: true,
            tsConfig: path.resolve(__dirname, "tsconfig.json")
        }
    },
}