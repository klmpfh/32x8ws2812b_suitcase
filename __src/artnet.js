const dgram = require('dgram');
const server = dgram.createSocket('udp4');

let config = require("./config.json");

const artnet_offset_length = 18;

let universe_offset = 0;

console.log(process.argv);


server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});


server.on('message', (msg, rinfo) => {

    try{
        const channels = parseInt((msg[16]<<8)+msg[17]);

        if(
            msg.slice(0,7) === "Art-Net"
            &&
            msg.length === rinfo.size
            &&
            rinfo.size >= artnet_offset_length
            &&
            channels >= 1
            &&
            channels <= 512
            &&
            rinfo.size <= (512 + artnet_offset_length)
            &&
            channels === rinfo.size - (artnet_offset_length)
        ){
            // Uni ...
            let uni = ((msg[15]<<8) + msg[14]) - universe_offset;
            // 1 erste hälfte
            // 2 zweite hälfte
            // 3 Text! ;)
            if(uni > 3) return;
            if(uni < 0) return;

            msg.slice(rinfo.size-channels,rinfo.size)


        }



    }catch(e){
        // kommt später weg ...
        throw(e);
    }
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(6454);


