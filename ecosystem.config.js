module.exports = {
  apps : [
    {
      name          : 'api',
      script        : "./src/api/index.js",
      watch         : "./**",
      restart_delay : 4000,
      // autorestart   : false,
    },
    {
      name          : 'artnet',
      script        : "./src/artnet/index.js",
      watch         : "./**",
      restart_delay : 4000,
      // autorestart   : false,
    },
    {
      name          : 'ledout',
      script        : "./src/ledout/index.js",
      // watch         : "./**",
      restart_delay : 4000,
      autorestart   : false,
    },
    {
      name          : 'renderer',
      script        : "./src/renderer/index.js",
      watch         : "./**",
      restart_delay : 4000,
      // autorestart   : false,
    },
  ]
}
