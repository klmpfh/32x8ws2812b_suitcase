module.exports = {
  apps : [
    {
      name        : 'artnetRes',
      script      : "./src/artnetRes.js",
      watch       : "./src/artnetRes.js",
    },
    {
      name        : 'ledMapper',
      script      : "./src/ledMapper.js",
      watch       : "./src/ledMapper.js",
    },
    {
      name        : 'renderLetter',
      script      : "./src/renderLetter.js",
      watch       : "./src/renderLetter.js",
    },
    {
      name        : 'telegram',
      script      : "./src/telegram.js",
      watch       : "./src/telegram.js",
    },
    {
      name        : 'ws2812b',
      script      : "./src/ws2812b.js",
      watch       : "./src/ws2812b.js",
    }
  ]
}
