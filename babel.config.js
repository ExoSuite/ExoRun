module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  env: {
    production: {
      plugins: ["react-native-paper/babel"],
    },
  },
  plugins: [
    [
      "@babel/plugin-proposal-decorators",
      {
        legacy: true,
      },
    ],
    [
      "transform-inline-environment-variables",
      {
        include: ["NODE_ENV", "API"],
      },
    ],
    ["@babel/plugin-proposal-optional-catch-binding"],
    ["@babel/plugin-transform-runtime"],
    ["babel-plugin-idx"],
  ],
  sourceMaps: true,
}
