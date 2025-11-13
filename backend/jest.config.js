module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  setupFiles: ["dotenv/config"],
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json"
    }
  },
  moduleFileExtensions: ["ts", "js", "json"],
};
