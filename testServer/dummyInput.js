// Dummy server ref code - https://github.com/robdodson/defcon/blob/master/models/Stopwatch.js
// Modified by Shanel

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
    this.reading = 1200; // simple coundown from 60 right now
    this.pattern = undefined;
    this.interval = undefined;

    events.EventEmitter.call(this);

    // list out all of the prototype functions
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
    this.reading = 1200;
    this.emit('reset:DummyData', this.formatTime(this.time));
};

// Most of Shanel's changes from source code here
DummyData.prototype.onTick = function() {
    // keep this time count running
    this.time += 1;

    // pattern: steadily decreasing drop
    if (this.reading > 0) {
        this.reading -= 5; // rate of change of drop
    }
 
    this.emit('tick:DummyData', this.reading);

    // stay at 0 for a bit, then reset
    if (this.time % 300 == 0) {
        this.reset();
        this.start();
    }
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