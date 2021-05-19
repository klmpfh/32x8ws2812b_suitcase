const ipc = require('node-ipc');

let config = require("./config.json");

ipc.config.id = 'cl1';
ipc.config.retry= 500;

ipc.serveNet(
    8002, //we set the port here because the hello client and world server are already using the default of 8000 and the port 8001. So we can not bind to those while hello and world are connected to them.
    'udp4',
    function(){
        ipc.server.on(
            'config',
            function(data){
                config = data;
            }
        );
    }
);

setTimeout(() => {
    ipc.server.emit(
        {
            address : 'localhost',
            port    : ipc.config.networkPort
        },
        'config',
        config
    );
}, 1500);

ipc.server.start();