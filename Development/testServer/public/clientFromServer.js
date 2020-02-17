var socket;
var sketch;

var EventEmitter = require('events').EventEmitter,
    puts = require('sys').puts;

function passToSketch(object){
	// with test server for now, everything passed to sketch is a single number
	canvas.click();
}

$(document).ready(function(){
	console.log('page ready');
	socket = io();
});

$('canvas#visualization').ready(function() {
	console.log('canvas ready');
	var canvas = $('canvas#visualization')[0];
	console.log(canvas);
	sketch = canvas.getContext('2d');

	function keyPressed() {
	    console.log("pressed a key on server");
	    socket.emit('serverKey', 'pressed a key on server');
	}

	socket.on('time', function(data) {
		console.log(JSON.stringify(data));
		passToSketch(data);
	});
});