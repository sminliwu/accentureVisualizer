var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')();

var port = 5000;

//server.listen(process.env.PORT || 5000);

app.use(express.static('public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

http.listen(port, function() {
	console.log('listening on ' + port);
});

io.listen(http);


io.on('connection', function (socket) {
  console.log("new connection from " + socket.id);
  
  socket.emit('connected', {msg: "You're connected!"});
  
  socket.on('message', function (data) {
    console.log(data);
    socket.broadcast.emit('message', data);
  });

  socket.on('disconnect', function() {
  	console.log(socket.id + " disconnected");
  });

  socket.on('serverKey', function() {
  	console.log("key was pressed on server side");
  	socket.broadcast.emit('serverKey');
  })
});