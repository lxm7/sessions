module.exports = function (api) {
  api.cache(true);
  let plugins = [];
  plugins.push('react-native-reanimated/plugin');
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      'react-native-reanimated/plugin', // MUST BE LAST
    ],
  };
};
