module.exports = {
  apps : [
    {
      name        : 'api',
      script      : "./index_api.js",
      watch       : "./src/api/**",
    },
    {
      name        : 'artnet',
      script      : "./index_artnet.js",
      watch       : "./src/artnet/**",
    },
    {
      name        : 'frontend',
      script      : "./index_frontend.js",
      watch       : "./src/frontend/**",
    },
    {
      name        : 'ledout',
      script      : "./index_ledout.js",
      watch       : "./src/ledout/**",
    },
    {
      name        : 'renderer',
      script      : "./src/renderer/index.js",
      watch       : "./src/renderer/**",
    },
  ]
}
