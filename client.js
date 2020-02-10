//var io = require('socket.io')();

//import * as morphVis from './public/BoundedMorphVis.js';

var socket = io.connect('http://localhost:5000');

socket.on('serverKey', function() {
	console.log('got server key press');

	// copied from BoundedMorphVis.js
	//transforms the force data to be comparable with green in the range of 0 to 230
    var transformedForce = morphVis.transformForceColor(data);
    //adjusts green if needed
    if (green > transformedForce + 2) {
      green -= 3;
    }
    morphVis.matchData(data);
});

$(document).on('click', function(e) {  	
	socket.emit('message', "Client clicked something");
});