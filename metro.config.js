/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  getTransformModulePath() {
    return require.resolve("react-native-typescript-transformer")
  },
  getSourceExts() {
    return ["ts", "tsx"]
  },
  resolver: {
    extraNodeModules: require("node-libs-react-native"),
    assetExts: ["mp3", "ttf", "ogg", "png", "vrx", "hdr", "gltf", "glb", "arobject", "obj", "mtl"]
  }
};