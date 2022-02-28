/**
 * Artnet-server
 *
 * - background (2 unis)
 * - forground (2 Unis)
 * - settings (1 uni)
 *   - speed ...
 */

const settings = require('./settings.json');
settings.ledout = require('../ledout/settings.json');
settings.renderer = require('../renderer/settings.json');

// custom metrtics
const tx2 = require('tx2');
let metric_output = tx2.meter({
  name: 'fps output',
  samples: 1,
  timeframe: 60,
});
let metric_input = tx2.meter({
  name: 'fps input',
  samples: 1,
  timeframe: 60,
});

const unis_background = [0, 1];
const unis_forground = [2, 3];
const unis_settings = [4];
const accepted_unis = [
  unis_background,
  unis_forground,
  unis_settings,
].flat();

let colors_forground = new Array(settings.ledout.leds_x).fill(0).map(x=> new Array(settings.ledout.leds_y).fill(0x000205));
let colors_background = new Array(settings.ledout.leds_x).fill(0).map(x=> new Array(settings.ledout.leds_y).fill(0x010101));
let speed_settings = new Array(1).fill(16);

const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(err);
  server.close();
  throw err;
});

server.on('message', (msg, rinfo) => {

  metric_input.mark();

  // no artnet, no work
  if(msg.indexOf("Art-Net") != 0) return;
  if(msg.length < 19) return;

  const uni = msg.readUInt16LE(14);

  // check the universe // not my universe
  if(!(accepted_unis.includes(uni))) return;

  // remove artnet stuff, get the data!
  msg = msg.subarray(18);


  function read_colorvalues_from_databuffer(buffer){
    let values = [];
    for(let index = 0 ; index < buffer.length; index += 3){
      // const x = Math.floor(index / 3 / 8);
      // const y = Math.floor(index / 3) % 8;
      values.push(buffer.readUIntBE(index, 3));
    }

    return values;
  }


  // manipulate msg by target ...
  if(unis_background.includes(uni)){

    let offset_x = unis_background.indexOf(uni) * 16;

    // 16 cols per uni
    msg = msg.subarray(0, 16 * 8 * 3);
    let values = read_colorvalues_from_databuffer(msg);
    for(let index = 0 ; index < values.length; index++){
      const x = Math.floor(index / 8) + offset_x;
      const y = Math.floor(index) % 8;
      colors_background[x][y] = values[index];
    }

  }else if(unis_forground.includes(uni)){

    let offset_x = unis_forground.indexOf(uni) * 16;

    // 16 cols per uni
    msg = msg.subarray(0, 16 * 8 * 3);
    let values = read_colorvalues_from_databuffer(msg);
    for(let index = 0 ; index < values.length; index++){
      const x = Math.floor(index / 8) + offset_x;
      const y = Math.floor(index) % 8;
      colors_forground[x][y] = values[index];
    }

  }else if(unis_settings.includes(uni)){

    // there are 1 settings
    msg = msg.subarray(0, 1);
    for(let index = 0 ; index < msg.length ; index++){
      speed_settings[index] = msg.readUInt8(index);
    }

  }else return;

  running = true;

});

server.bind(settings.artnet_port);


running = false;

function sendLoop() {
  if(running) {

    metric_output.mark();

    const client = dgram.createSocket('udp4');
    client.send(
      JSON.stringify({
        colors_background,
        colors_forground,
        speed_settings,
      }),
      settings.renderer.intern_listen_port,
      'localhost',
      (err) => {
        client.close();

        if(err){
          running = false;
          throw err;
        }
      }
    );
  }
  setTimeout(sendLoop, 10);
}

sendLoop();

console.log("ok");
