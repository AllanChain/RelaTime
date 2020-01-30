module.exports = {
  publicPath: process.env.PUB_PATH || '/',
  pwa: {
    name: 'RelaTime',
    themeColor: '#4c89fe',
    msTileColor: '#4c89fe',
    manifestOptions: {
      start_url: '.',
      background_color: '#4c89fe'
    },
    workboxOptions: {
      runtimeCaching: [{
        urlPattern: /./,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      }]
    }
  },
  transpileDependencies: ['vuetify']
}
