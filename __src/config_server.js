const ipc = require('node-ipc');
const fs = require("fs");

ipc.config.id = 'koffer';
ipc.config.retry= 50;

ipc.serveNet(
    'udp4',
    function(){
        ipc.server.on(
            'config',
            function(data,socket){
                ipc.server.broadcast(
                    'config',
                    data
                );
                fs.writeFileSync("./config.json", JSON.stringify(data,null,4));
            }
        );
    }
);

ipc.server.start();