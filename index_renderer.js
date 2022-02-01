const SerialPort = require('serialport')

// ls /dev/ttyUSB*
const port = new SerialPort('COM4', {
  baudRate: 115200
})

port.write('main screen turn on', function(err) {
  if (err) {
    return console.log('Error on write: ', err.message)
  }
})

const buffer_size = 32*8*3;

// sending some random stuff ...
function sendSomeStuff(){
  let buf = Buffer.allocUnsafe(buffer_size);

  for (let i = 0; i < buffer_size; i++) {
    buf[i] = Math.floor(Math.random()*255);
  }

  port.write(buf.toString('hex'), function(err) {
    if (err) {
      return console.error('Error on write: ', err.message)
    }
  });

}

setInterval(sendSomeStuff, (1000/60));
