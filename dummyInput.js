// Dummy server ref code - https://github.com/robdodson/defcon/blob/master/models/Stopwatch.js

var util    = require('util'),
    events  = require('events')
    _       = require('underscore');

// ---------------------------------------------
// Constructor
// ---------------------------------------------
function DummyData() {
    if(false === (this instanceof DummyData)) {
        return new DummyData();
    }

    this.second = 1000;
    this.time = 0;
    this.reading = 1000; // simple coundown from 60 right now
    this.pattern = undefined;
    this.interval = undefined;

    events.EventEmitter.call(this);

    // Use Underscore to bind all of our methods
    // to the proper context
    _.bindAll(this, 'start', 'stop', 'onTick', 'formatTime', 'getReading');
};

// ---------------------------------------------
// Inherit from EventEmitter
// ---------------------------------------------
util.inherits(DummyData, events.EventEmitter);

// ---------------------------------------------
// Methods
// ---------------------------------------------
DummyData.prototype.start = function() {
    if (this.interval) {
        return;
    }

    console.log('Starting DummyData!');
    // note the use of _.bindAll in the constructor
    // with bindAll we can pass one of our methods to
    // setInterval and have it called with the proper 'this' value
    this.interval = setInterval(this.onTick, 1);
    this.emit('start:DummyData');
};

DummyData.prototype.stop = function() {
    console.log('Stopping DummyData!');
    if (this.interval) {
        clearInterval(this.interval);
        this.interval = undefined;
        this.emit('stop:DummyData');
    }
};

DummyData.prototype.reset = function() {
    console.log('Resetting DummyData!');
    this.reading = 1000;
    this.emit('reset:DummyData', this.formatTime(this.time));
};

DummyData.prototype.onTick = function() {
    this.time += 1;

    if (this.reading > 0) {
        this.reading -= 1;
    }
 
    this.emit('tick:DummyData', this.reading);

    if (this.time % 2000 == 0) {
        this.reset();
        this.start();
    }


    //var formattedTime = this.formatTime(this.time);
   
    
    // if (this.reading === 0) {
        
    // }
};

DummyData.prototype.formatTime = function(time) {
    var remainder = time,
        numHours,
        numMinutes,
        numSeconds,
        output = "";

    numHours = String(parseInt(remainder / this.hour, 10));
    remainder -= this.hour * numHours;
    
    numMinutes = String(parseInt(remainder / this.minute, 10));
    remainder -= this.minute * numMinutes;
    
    numSeconds = String(parseInt(remainder / this.second, 10));
    
    output = _.map([numHours, numMinutes, numSeconds], function(str) {
        if (str.length === 1) {
            str = "0" + str;
        }
        return str;
    }).join(":");

    return output;
};

DummyData.prototype.getReading = function() {
    return this.reading;
};

// ---------------------------------------------
// Export
// ---------------------------------------------
module.exports = DummyData;