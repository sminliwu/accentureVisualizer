//THIS FILE IS OWNED BY SHANEL 

console.log("I'm here");


// open socket after everything P5 is ready
  socket = io('http://192.168.0.4:5000');

  socket.on('reading', function(packet) {
    console.log(JSON.stringify(packet));
    data = packet['reading'];
  });

  




