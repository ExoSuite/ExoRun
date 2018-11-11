module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    production: {}
  },
  plugins: [
    [
      'transform-inline-environment-variables',
      {
        include: ['NODE_ENV', 'API']
      }
    ],
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true
      }
    ],
    ['@babel/plugin-transform-runtime'],
    ['@babel/plugin-proposal-optional-catch-binding']
  ]
};
