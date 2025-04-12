// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
// eslint-disable-next-line no-undef
const config = getDefaultConfig(__dirname);

// const { assetExts, sourceExts } = config.resolver;
// config.resolver.assetExts = [...assetExts, 'cjs', 'json', 'svg'];
// config.resolver.sourceExts = sourceExts.filter(
//   (ext) => ext !== 'cjs' && ext !== 'json' && ext !== 'svg'
//   // &&
//   // ext !== 'jsx' &&
//   // ext !== 'js' &&
//   // ext !== 'ts' &&
//   // ext !== 'tsx'
// );

module.exports = withNativeWind(config, { input: './global.css' });
