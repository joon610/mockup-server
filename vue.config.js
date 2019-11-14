module.exports = {
  runtimeCompiler: true,
  lintOnSave: process.env.NODE_ENV !== 'production',
  pluginOptions: {
    electronBuilder: {
      outputDir: 'dist_electron',
    }
  }
}