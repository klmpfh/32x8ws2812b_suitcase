const SerialPort = require('serialport')

// ls /dev/ttyUSB* /dev/ttyUSB0
const port = new SerialPort(process.platform == 'linux' ? '/dev/ttyUSB0' : 'COM5', {
  baudRate: 250000,
  databits: 8,
  stopBits: 1,
  parity: 'even',
  autoOpen: true,
})


const NUM_LEDs = 32*8;

const bufLength = NUM_LEDs * 3;

let value = 0;

let buf = new Array(bufLength).fill(value);

setInterval(()=>{
  value = (value + 1) % 256;
  buf.fill(value);
}, 20);

// on "start" message, send led color buffer
port.on('data', function () {
  port.write(buf);
});

