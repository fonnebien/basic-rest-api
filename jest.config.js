/** @type {import('jest').Config} */
export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  setupFiles: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@api/(.*)\\.js$": "<rootDir>/src/api/$1",
    "^@domain/(.*)\\.js$": "<rootDir>/src/domain/$1",
    "^@models/(.*)\\.js$": "<rootDir>/src/domain/models/$1",
    "^@services/(.*)\\.js$": "<rootDir>/src/domain/services/$1",
    "^@errors/(.*)\\.js$": "<rootDir>/src/domain/errors/$1",
    "^@repositories/(.*)\\.js$": "<rootDir>/src/domain/repositories/$1",
    "^@infrastructure/(.*)\\.js$": "<rootDir>/src/infrastructure/$1",
    "^@middleware/(.*)\\.js$": "<rootDir>/src/middleware/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true }],
  },
};
