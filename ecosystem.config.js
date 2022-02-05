module.exports = {
  apps : [
    {
      name        : 'api',
      script      : "./src/api/index.js",
      watch       : "./**",
    },
    {
      name        : 'artnet',
      script      : "./src/artnet/index.js",
      watch       : "./**",
    },
    {
      name        : 'frontend',
      script      : "./src/frontend/index.js",
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
