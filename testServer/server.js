var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')();
var DummyData = require('./dummyInput.js');

var port = 5000; // test server port

// NodeJS example of websocket stopwatch: https://github.com/robdodson/defcon/blob/master/models/stopwatch.js
// used this for a continuously broadcasting dummy server

// uncomment to serve a webpage
// app.use(express.static('public'));

// app.get('/', function(req, res) {
// 	res.sendFile(__dirname + '/index.html');
// });

http.listen(port);
http.on('listening', function() {
	var myIP = require('os').networkInterfaces()['Wi-Fi'][1]['address'];
	console.log('Hosting server from ' + myIP + ':' + port);
});

io.listen(http);

var dummy = new DummyData();

dummy.on('tick:DummyData', function(reading) {
  io.sockets.emit('reading', { reading: reading });
  if (reading % 100 == 0 && reading != 0) {
      console.log(reading);
  }
});

dummy.start();

io.on('connection', function (socket) {
  let handshake = socket.handshake;
  console.log("New connection from " + handshake['address']);

  io.sockets.emit('reading', { reading: dummy.getReading() });
  
  socket.on('message', function (data) {

    socket.broadcast.emit('message', data);
  });

  socket.on('disconnect', function() {
  	console.log(handshake['address'] + " disconnected");
  });

  socket.on('serverKey', function() {
  	console.log("key was pressed on server side");
  	socket.broadcast.emit('serverKey');
  });

});
