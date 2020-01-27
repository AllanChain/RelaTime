module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/RelaTime/' : '/',
  pwa: {
    name: 'RelaTime',
    themeColor: '#4c89fe',
    msTileColor: '#4c89fe',
    manifestOptions: {
      start_url: '.',
      background_color: '#4c89fe'
    },
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      navigateFallback: '.',
      runtimeCaching: [
        {
          urlPattern: new RegExp('/'),
          handler: 'networkFirst',
          options: {
            networkTimeoutSeconds: 20,
            cacheName: 'RelaTime',
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    }
  },
  transpileDependencies: ['vuetify']
}
