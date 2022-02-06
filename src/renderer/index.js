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


const dgram = require('dgram');



const settings = require('./settings.json');
settings.ledout = require('../ledout/settings.json');




const LEDMatrix = require('./classes/LEDMatrix');

const matrtix = new LEDMatrix();

let running = true;

setInterval(() => {
  matrtix.set_pixel_rgb(
    Math.floor(Math.random()*32),
    Math.floor(Math.random()*8),
    Math.floor(Math.random()*256),
    Math.floor(Math.random()*256),
    Math.floor(Math.random()*256),
  );
}, 100);


function sendLoop() {
  if (running) {
    const client = dgram.createSocket('udp4');
    client.send(
      matrtix.get_buffer(),
      settings.ledout.intern_listen_port,
      'localhost',
      (err) => {
        client.close();
        if(err) throw err;
        setImmediate(sendLoop);
      }
    );
  }
}



sendLoop();


