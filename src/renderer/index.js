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
 *
 *
 *
 * Parameter:
 *
 * - Text
 * - scrolling (cols per secound)
 * - background Matrix
 * - forground Matrix
 *
 **/


const dgram = require('dgram');


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


const settings = require('./settings.json');
settings.ledout = require('../ledout/settings.json');

let colors_forground = new Array(settings.ledout.leds_x).fill(0).map(x => new Array(settings.ledout.leds_y).fill(0x100400));
let colors_background = new Array(settings.ledout.leds_x).fill(0).map(x => new Array(settings.ledout.leds_y).fill(0).map(x => Math.floor(Math.random() * 0x000008)));


const LEDMatrix = require('./classes/LEDMatrix');

const matrtix = new LEDMatrix();

let running = true;


let testText = "<3";

const Text = require('./classes/Text');
let text = new Text(testText);

const os = require('os');

function showIp() {

  let ifs = Object
    .values(os.networkInterfaces()).flat()
    .filter(n => !n.internal)
    .filter(n => n.family == 'IPv4')
    .map(n => n.address);

  if(ifs.length) {
    // setNewText("## IP:    " + ifs.join("    ") + "    ####");
    setNewText("<3##");
  } else {
    setTimeout(showIp, 100);
  }
}
setTimeout(showIp, 1000);

function setNewText(_text) {
  text.lines = _text;
  current_line_index = 0;
  offset_scrolling = - settings.ledout.leds_x;
  line_start_time = Date.now();
}




let current_line_index = 0;
function next_line_index() {
  if((current_line_index < (text.lineInfo.length - 1))) {
    // 1 up!
    current_line_index++;
  } else {
    // rest to 0
    current_line_index = 0;
  }
};

let offset_scrolling = - settings.ledout.leds_x;


let cols_per_secound = 15;

let line_start_time = Date.now();

function calc_offset_by_time() {
  let line_on_time = Date.now() - line_start_time;
  let line_max_on_time = (text.lineInfo[current_line_index].length + settings.ledout.leds_x) / cols_per_secound * 1000;

  if(line_on_time >= line_max_on_time) {
    // reset
    line_start_time = Date.now();
    offset_scrolling = -settings.ledout.leds_x;
    next_line_index();
  } else {
    offset_scrolling = Math.floor(line_on_time / line_max_on_time * (text.lineInfo[current_line_index].length + settings.ledout.leds_x)) - settings.ledout.leds_x;
  }

}

// text.textArray

function render() {

  calc_offset_by_time();

  for(let x = 0; x < settings.ledout.leds_x; x++) {

    let offset_x = x + offset_scrolling;

    // if no scrolling, overwirte
    if(!text.lineInfo[current_line_index].scrolling) {
      offset_x = x - Math.floor((settings.ledout.leds_x - text.lineInfo[current_line_index].length) / 2);
    }

    for(let y = 0; y < 8; y++) {
      let color = colors_background[x][y];

      if(offset_x >= 0 && offset_x < text.lineInfo[current_line_index].length) {
        if(text.lineArray[current_line_index][offset_x][y] == 1) {
          color = colors_forground[x][y];
        } else if(text.lineArray[current_line_index][offset_x][y] == 'x' && Math.random() > 0.5) {
          // randoms
          color = colors_forground[x][y]
        }
      }

      matrtix.set_pixel_value(x, y, color);
    }
  }
}




function sendLoop() {
  if(running) {

    render();

    metric_output.mark();

    const client = dgram.createSocket('udp4');
    client.send(
      matrtix.get_buffer(),
      settings.ledout.intern_listen_port,
      'localhost',
      (err) => {
        client.close();

        if(err) {
          running = false;
          throw err;
        }

        // setImmediate(sendLoop); // over 2000 frames per secound ... ^^
        setTimeout(sendLoop, 1);
      }
    );
  }
}

sendLoop();







const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.error(err);
  server.close();
  throw err;
});

server.on('message', (msg, rinfo) => {


  // witch kind of msg?
  try {
    let package = JSON.parse(msg.toString());

    // colors_background
    // colors_forground
    // speed_settings

    if(package.hasOwnProperty("colors_background")) colors_background = package.colors_background;
    if(package.hasOwnProperty("colors_forground")) colors_forground = package.colors_forground;
    if(package.hasOwnProperty("speed_settings")) cols_per_secound = package.speed_settings[0];

    if(package.hasOwnProperty("text")) {
      setNewText(package.text);
    };

    metric_input.mark();

  } catch(e) {
    console.error("Fehlerhaftes Datenpacket.");
    console.log(msg.toString());
    console.error(e);
  }

});

server.bind(settings.intern_listen_port);


console.log("ok");
