module.exports = {
    preset: "react-native",
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js"
    ],
    transform: {
        "^.+\\.(js)$": "<rootDir>/node_modules/babel-jest",
        "\\.(ts|tsx)$": "<rootDir>/node_modules/ts-jest/preprocessor.js"
    },
    testRegex: "(/tests/.*|\\.(test|spec))\\.(ts|tsx|js)$",
    testPathIgnorePatterns: [
        "\\.snap$",
        "<rootDir>/node_modules/"
    ],
    cacheDirectory: ".jest/cache",
    modulePaths: ["<rootDir>/app/"],
    moduleNameMapper: {
        "app/(.*)": "<rootDir>/app/$1"
    }
};
