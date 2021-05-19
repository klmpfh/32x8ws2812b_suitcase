// subber.js
var zmq = require("zeromq"),
  sock = zmq.socket("sub");

sock.connect("tcp://127.0.0.1:3000");
sock.subscribe("telegram");
console.log("Subscriber connected to port 3000");

sock.on("message", function(topic, message) {
  console.log(
    topic.toString(),
    ":",
    message.toString()
  );
});