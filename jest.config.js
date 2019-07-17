module.exports = {
  preset: "jest-preset-ignite",
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!(jest-)?react-native|react-native|react-navigation|@react-navigation|@storybook|@react-native-community|@expo)"
  ],
  setupFilesAfterEnv: [
    "<rootDir>/test/setup-enzyme.ts"
  ],
  moduleNameMapper: {
    "^lodash-es$": "lodash"
  }
};