/**
 * renderer
 *
 * getting all values and make the Matrix with it!
 *
 * Artnet forground
 * Artnet Background
 * Text Color
 * FX??
 * text (scrolling? blending?)
 *
 * the LEDs are starting in my case from bottom right corner
 * LED (32|8) is the first one
 * starts upwards and the col befor downwards
 * ... and so on ... up, down, up, down
 */

const settings = require('./settings.json');
settings.ledout = require('../ledout/settings.json');

const dgram = require('dgram');
setInterval(() => {
  const client = dgram.createSocket('udp4');
  client.send(
    new Int8Array((settings.ledout.colors_per_leds * settings.ledout.leds_x * settings.ledout.leds_y)).fill(8),
    settings.ledout.intern_listen_port,
    'localhost',
    (err) => {
      client.close();
    }
  );
}, 1000)


