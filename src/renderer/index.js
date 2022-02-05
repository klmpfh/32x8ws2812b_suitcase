/**
 * renderer
 *
 * getting all values and make the Matrix with it!
 *
 * Artnet forground
 * Artnet Background
 * Text Color
 * Effekts??
 * text (scrolling? blending?)
 *
 * the LEDs are starting in my case from bottom right corner
 * LED (32|8) is the first one
 * starts upwards and the col befor downwards
 * ... and so on ... up, down, up, down
 */

const dgram = require('dgram');
setInterval(() => {
  const client = dgram.createSocket('udp4');
  client.send(new Int8Array((settings.colors_per_leds * settings.leds_x * settings.leds_y)).fill(8), settings.intern_listen_port, 'localhost', (err) => {
    client.close();
  });
}, 1000)

