module.exports = {
  pwa: {
    name: 'WebNav',
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
            cacheName: 'webnav|AC',
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    }
  }
}
