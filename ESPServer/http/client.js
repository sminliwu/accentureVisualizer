// write connection to websocket running on arduino 


//THIS FILE IS OWNED BY SHANEL 
//copied this code from socket.js in previous sketch
console.log("Loaded Client.js");


// Currently pointing to port 5000 on lab Eero Router
  socket = io('http://192.168.7.1:5000');

  socket.on('reading', function(packet) {
    console.log(JSON.stringify(packet));
    data = packet['reading'];
  });

  
