/**
 *
 * send to arduino for display
 *
 *
 *
 */


// SerialPort communication ofer USB
const SerialPort = require('serialport');

// custom metrtics
const tx2 = require('tx2');
let fps_out = tx2.meter({
  name      : 'f/s out',
  samples   : 1,
  timeframe : 60,
});
let fps_in = tx2.meter({
  name      : 'f/s in',
  samples   : 1,
  timeframe : 60,
});

// get settings
const settings = require('./settings');

let buf = new Uint8Array(settings.leds_x * settings.leds_y).fill(0);

// setup SerialPort with Arduino std
const port = new SerialPort(
  process.platform == 'linux' ? settings.USBPort : settings.WindowsTestingUSBPort,
  {
    baudRate: 250000,
    databits: 8,
    stopBits: 1,
    parity: 'even',
    autoOpen: true,
  }
);

// on "start" message, send led color from buffer
port.on('data', function () {
  port.write(buf);
  fps_out.mark();
});

port.on('error', (err) => {
  server.close();
  port.close();
  console.error(err);
  throw err;
});

const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  server.close();
  port.close();
  console.error(err);
  throw err;
});

server.on('message', (msg, rinfo) => {
  if(rinfo.size == (settings.colors_per_leds * settings.leds_x * settings.leds_y)){
    buf = msg;
    fps_in.mark();
  }
});

server.bind(settings.intern_listen_port);
