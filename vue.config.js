module.exports = {
  pages: {
    index: {
      entry: 'src/main.js', // 必須パラメータ
      title: 'FEAPMaster',
    }
  },
  pwa: {
    iconPaths: {
      favicon32: 'img/icon_orange.png',
      favicon16: 'img/icon_orange.png',
    }
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import "@/sass/main.scss";'
      }
    }
  }
}
