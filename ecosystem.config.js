module.exports = {
  apps : [
    {
      name        : 'api',
      script      : "./index_api.js",
      watch       : "./**",
    },
    {
      name        : 'artnet',
      script      : "./index_artnet.js",
      watch       : "./**",
    },
    {
      name        : 'frontend',
      script      : "./index_frontend.js",
      watch       : "./**",
    },
    {
      name        : 'ledout',
      script      : "./src/ledout/index.js",
      watch       : "./**",
    },
    {
      name        : 'renderer',
      script      : "./src/renderer/index.js",
      watch       : "./**",
    },
  ]
}
