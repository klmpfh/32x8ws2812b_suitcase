const SerialPort = require('serialport')
const port = new SerialPort('COM4', {
  baudRate: 115200
})

port.write('main screen turn on', function(err) {
  if (err) {
    return console.log('Error on write: ', err.message)
  }
})

// sending some random stuff ...
function sendSomeStuff(){
  let buffer = new ArrayBuffer(32*8*3);

  buffer.forEach((v,i,a) => {
    a[i] = Math.floor(Math.random()*255);
  });

  port.write(buffer, function(err) {
    if (err) {
      return console.error('Error on write: ', err.message)
    }
  });

}

setInterval(sendSomeStuff, (1000/60));
