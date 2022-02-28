const dgram = require('dgram');

const port = require('../../renderer/settings.json').intern_listen_port;





module.exports = function (req, res, next) {

  console.log(req.body)

  // body check is missing

  let internal_body = {};
  let flash_body = {};

  let flash = req.body.flash;

  if('text' in req.body) {
    req.body.text = req.body.text.split('\r').join('').split('\n').map(x => x.trim()).join('\n');
    internal_body.text = req.body.text;
  }

  if('colors_background_r' in req.body) {
    if(flash){
      flash_body.colors_background = new Array(32).fill(0).map(x => new Array(8).fill(0xffffff));
    }
    const random = req.body.colors_background_some_random;
    internal_body.colors_background = new Array(32).fill(0).map(x => new Array(8).fill(0).map(x =>
      Math.floor((random ? Math.random() : 1) * parseInt(req.body.colors_background_r || 0)).toString(16).padStart(2, '0') +
      Math.floor((random ? Math.random() : 1) * parseInt(req.body.colors_background_g || 0)).toString(16).padStart(2, '0') +
      Math.floor((random ? Math.random() : 1) * parseInt(req.body.colors_background_b || 0)).toString(16).padStart(2, '0')
    ));
  }

  if('colors_forground_r' in req.body) {
    if(flash){
      flash_body.colors_forground = new Array(32).fill(0).map(x => new Array(8).fill(0xffffff));
    }
    internal_body.colors_forground = new Array(32).fill(0).map(x => new Array(8).fill(
      parseInt(req.body.colors_forground_r || 0).toString(16).padStart(2, '0') +
      parseInt(req.body.colors_forground_g || 0).toString(16).padStart(2, '0') +
      parseInt(req.body.colors_forground_b || 0).toString(16).padStart(2, '0')
    ));
  }

  if('speed_settings' in req.body) {
    internal_body.speed_settings = [req.body.speed_settings];
  }


  // if not empty, send internal
  if(Object.keys(internal_body).length > 0) {
    let delay = 0;

    if(flash) {
      delay = 120;
      const client = dgram.createSocket('udp4');
      client.send(
        JSON.stringify(flash_body),
        port,
        'localhost',
        (err) => {
          client.close();

          if(err) {
            running = false;
            throw err;
          }
        }
      );
    }

    setTimeout(() => {
      const client = dgram.createSocket('udp4');
      client.send(
        JSON.stringify(internal_body),
        port,
        'localhost',
        (err) => {
          client.close();

          if(err) {
            running = false;
            throw err;
          }
        }
      );
    }, delay);

  }




  res.redirect('/');
}
