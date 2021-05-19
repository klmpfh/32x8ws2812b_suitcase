const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const artnet_offset_length = 18;

var ws281x = require('rpi-ws281x');

let config = {
    leds:32*8,
    stripType : 'grb',
    brightness : 255,
    gpio : 18
};

let universe_offset = 0;


let matrix = (function(){

    const map_xy_to_lednr = (function map_gen(){
        let line = [];
        for(var i = 0 ; i < 32*8 ; i++) line.push(i);
        line = line.reverse();
        let zickzack = new Array(Math.ceil(line.length / 8))
            .fill()
            .map(_ => line.splice(0, 8));
        for(var i = 0 ; i < zickzack.length ; i+=2) zickzack[i] = zickzack[i].reverse();
        return zickzack;
    })();

    function xy_to_pixel_nr(x,y){
        return map_xy_to_lednr[x][y];
    }




    const map_unichannel_to_xycolor = (function map_gen2(){
        let arr = [
            // uni 0,
            // channels 0-479
            [],

            // uni 1, 0-287
            []
        ];

        arr.forEach((v,uni)=>{
            for(var i = 0 ; i < (3+(2*(1-uni)))*32*3 ; i++){ // 3 oder 5 Streifen a 32 LED mit 3 Farben ...
                arr[uni].push({
                    x : Math.floor(i/3)%32,
                    y : (uni*5) + (Math.floor(Math.floor(i/3)/32)),
                    c : i%3
                });
            }
        });

        return arr;
    })();;

    function uni_channel_to_xy_color(uni,channel){
        return map_unichannel_to_xycolor[uni][channel];
    }

    var rgb_channels = new Uint8Array(config.leds * 3);
    rgb_channels.forEach((v,i,a)=>a[i] = 0);

    function set_value_on_uni_channel(uni, channel, value){
        let xyc = uni_channel_to_xy_color(uni,channel);
        if(xyc === undefined) return;

        rgb_channels[(xy_to_pixel_nr(xyc.x, xyc.y)*3) + xyc.c] = value;
    }

    function set_rgb_on_xy(x,y,r,g,b){
        rgb_channels[xy_to_pixel_nr(x, y) + 0] = r;
        rgb_channels[xy_to_pixel_nr(x, y) + 1] = g;
        rgb_channels[xy_to_pixel_nr(x, y) + 2] = b;
    }

    function get_pixel_stripe(){
        var pixels = new Uint32Array(config.leds);
        rgb_channels.forEach((v,i)=>{
            let led = Math.floor(i/3);
            pixels[led] += (v << ((2*8)-((i%3) * 8)));
        });
        return pixels;
    }

    return {
        set_value_on_uni_channel,
        set_rgb_on_xy,
        get_pixel_stripe,
    }
})();


// Configure ws281x
ws281x.configure(config);



let artnet_puffer = [
    [],
    [],
    []
];


function renderer(){
    ([
        5*32*3, // uni 1 (0)
        3*32*3, // uni 2 (1)
    ]).forEach((max, uni)=>{
        artnet_puffer[uni].forEach((value, channel)=>{
            if(channel < max) matrix.set_value_on_uni_channel(uni,channel,value);
        });
    });


    // hier werden die Buchstaben gerendert! / eingefügt ....


    ws281x.render(matrix.get_pixel_stripe());
    setImmediate(renderer);
}
setImmediate(renderer);


server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});


server.on('message', (msg, rinfo) => {

    try{
        const channels = parseInt((msg[16]<<8)+msg[17]);

        if(
            msg.slice(0,7) == "Art-Net"
            &&
            msg.length == rinfo.size
            &&
            rinfo.size >= artnet_offset_length
            &&
            channels >= 1
            &&
            channels <= 512
            &&
            rinfo.size <= (512 + artnet_offset_length)
            &&
            channels == rinfo.size - (artnet_offset_length)
        ){
            // Uni ...
            let uni = ((msg[15]<<8) + msg[14]) - universe_offset;
            // 1 erste hälfte
            // 2 zweite hälfte
            // 3 Text! ;)
            if(uni > 3) return;
            if(uni < 0) return;
            artnet_puffer[parseInt(uni)] = msg.slice(rinfo.size-channels,rinfo.size);

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





const buchstaben = require('./buchstaben.js');

console.log(buchstaben);


function zeichen_to_id(zeichen){
    let index = buchstaben.zeichen.indexOf(zeichen);
    return index >= 0 ? index : (Math.random() >= 0.5 ? 1 : 2);
}

function convert_string_to_id_array(str){
    str = str.toUpperCase().split("").map(zeichen_to_id);
    if(str.length > 100) map = map.slice(0,100);
    return str;
}

let led_text_ids_from_telegram = [];
let led_text_as_mapping_array = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    []
];


const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '1739010749:AAHSruqWVk7kV3hUBd5e_Tz3wHbzKJWuP3Q';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, JSON.stringify(convert_string_to_id_array(msg.text)));
});