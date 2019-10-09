
module.exports = {
  runtimeCompiler: true,
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: "mockingBird.dryhands",
        asar:true,
        productName: "mockingBird",
        mainProcessFile: './dist_electron/bundled/background.js',
        directories: {
          "output": "build"
        },
        files: [
          "dist_electron/bundled/**/*"
        ],
        // options placed here will be merged with default configuration and passed to electron-builder
      }
    }
  }
}