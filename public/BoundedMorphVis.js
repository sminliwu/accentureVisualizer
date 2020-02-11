var rectangleArray;
var circleArray;
var result;
var tracking;
let green;
var data = 1023;

var socket;

let sketch = function(p) {
  p.setup = function() {
    p.rectMode(p.CENTER);
    var canvas = p.createCanvas(640,360);
    canvas.parent('sketch'); // links the P5 Canvas object to a div on the HTML page
    canvas.id('visualization');
    console.log('canvas created in page');

    p.background(255,255,255);
    p.noStroke();
    p.smooth();
    p.frameRate(200);
    //sets original green value to 230 corresponding to the desired yellow color
    green = 230;

    rectangleArray = new Array();
    circleArray = new Array();
    result = new Array();

    //populates the arraylist for circle with vectors to its coordinate spots along the circumference of the circle
    for (var angle = 0; angle < 360; angle += 9) {
      var v = p5.Vector.fromAngle(p.radians(angle-135));
      v.mult(200);
      circleArray.push(v);
      //adds empty vectors to the result arraylist
      result.push(new p5.Vector());
    }
    
    //populates rectangle arraylist
    for (var x = -150; x < 150; x += 30) {
      rectangleArray.push(p.createVector(x, -100));
    }
    // Right side
    for (var y = -100; y < 100; y += 20) {
      rectangleArray.push(p.createVector(150, y));
    }
    // Bottom
    for (var x = 150; x > -150; x -= 30) {
      rectangleArray.push(p.createVector(x, 100));
    }
    // Left side
    for (var y = 100; y > -100; y -= 20) {
      rectangleArray.push(p.createVector(-150, y));
    }
    
    //draws the original rectangle
    p.fill(255,green,0);
    p.rect(p.width/2,p.height/2,300,200);
    
    //initializes tracking to 0
    tracking = 0;
  }

  p.draw = function() {
    //redraws yellow rectangle if tracking is zero
    if (tracking == 0) {
      p.background(255,255,255);
      p.fill(255,green,0);
      p.rect(p.width/2,p.height/2,300,200);
    }
    // if (p.mouseIsPressed) {
    //   //transforms the force data to be comparable with green in the range of 0 to 230
    //   var transformedForce = transformForceColor(data);
    //   //adjusts green if needed
    //   if (green > transformedForce + 2) {
    //     green -= 3;
    //   }
    //   matchData(data);
    // } else {
    //   transformes the force data to be comparable with green on a scale of 0-230
    //   var transformedForce = transformForceColor(0);
    //   if (green < transformedForce - 2) {
    //     //adjusts green if needed
    //     green += 3;
    //   }
    //   matchData(0);
    // }
    p.listenData(data);
  }

  p.mousePressed = function() {
    //console.log("mousePressed");
    //transforms the force data to be comparable with green in the range of 0 to 230
    var transformedForce = transformForceColor(data);
    //adjusts green if needed
    if (green > transformedForce + 2) {
      green -= 3;
    }
    matchData(data);
  }

  p.mouseReleased = function() {
    //transformes the force data to be comparable with green on a scale of 0-230
    var transformedForce = transformForceColor(0);
    if (green < transformedForce - 2) {
      //adjusts green if needed
      green += 3;
    }
    matchData(0);
  }

  p.listenData = function(data) {
    var transformedForce = transformForceColor(data);
    //adjusts green if needed
    if (green > transformedForce + 2) {
      green -= 3;
    } else if (green < transformedForce + 2) {
      green += 3;
    }
    matchData(data);
  }

  //interface between result vector (what is drawn) and the actual draw function -> appropriate causes the rectangle to morph based on the data
  //input: requires the raw data (as a float)
  function matchData(forceData) {
    //console.log(forceData);
    //transforms data to be compared to tracking (which measures how close on a scale of 0 to 1 is the morphed rectangle to a circle)
    var transformedData = transformForce(forceData);
    transformedData = p.round(transformedData*10);
    transformedData /= 10;
    var check = p.round((tracking - transformedData)*100);
    check /= 100;
    if (check < 0) {
      grow();
    } else if (check > 0) {
      shrink();
    }
  }

  function grow() {
    //adds slightly to tracking
    var addOn = 0.01;
    tracking += addOn;
   
    //iterates through the rectangle arraylist
    for (var i = 0; i < rectangleArray.length; i++) {
      //PVector v1;
      //Vector v2;
      //gets the rectangle and circle vectors at this index
      let v1 = rectangleArray[i];
      let v2 = circleArray[i];
      let newVector;
      //lerps between the two, using tracking's float value as the amount
      newVector = p5.Vector.lerp(v1,v2,tracking);
      //set result at i to this newVector
      result[i] = newVector;
    }
        
    //move the drawing to the center of the sketch and fill with adjusted green and 255 for red
    p.translate(p.width/2, p.height/2);
    p.noStroke();
    p.fill(255,green,0);
    
    //actually draw the morphed shape
    p.beginShape();
    for (var v of result) {
      p.vertex(v.x, v.y);
    }
    p.endShape(p.CLOSE);
  }

  function shrink() {
    //erase what has been drawn
    p.background(255);
    
    //subtracts slightly from tracking
    var sub = 0.01;
    tracking -= sub;
     
    //iterates through the rectangle arraylist
    for (var i = 0; i < rectangleArray.length; i++) {
      //PVector v1;
      //PVector v2;
      //gets the rectangle and circle vectors at this index
      let v1 = rectangleArray[i];
      let v2 = circleArray[i];
      let newVector;
      //lerps between the two, using tracking's float value as the amount
      newVector = p5.Vector.lerp(v1,v2,tracking);
      //set result at i to this newVector
      result[i] = newVector;
    }   
      
    //move the drawing to the center of the sketch and fill with adjusted green and 255 for red
    p.translate(p.width/2, p.height/2);
    p.noStroke();
    p.fill(255,green,0);

    //actually draw the morphed shape
    p.beginShape();
    for (var v of result) {
      p.vertex(v.x, v.y);
    }
    p.endShape(p.CLOSE);
  }

  //finds how close to a circle the morphed shape should be on a scale of 0 to 1 (only accessing 0.6, b/c never want it to be full circle) based on the force
  //input: raw force data (as a float)
  function transformForce(forceData) {
    var toBeRounded= (forceData/1023)*0.6;
    var scale = 10;
    toBeRounded = p.round(toBeRounded*scale);
    return toBeRounded/scale;
  }

  //determines the correct greeen value based on the force
  //input: raw force data (as a float)
  function transformForceColor(data) {
    var toScale = 1023-data;
    var multiplier = 0.2248289345;
    var scaled = multiplier*toScale;
    return p.int(scaled);
  }
}

let vis = new p5(sketch); // can call p5 functions as vis.function()

socket = io();

socket.on('reading', function(packet) {
  console.log(JSON.stringify(packet));
  data = packet['reading'];
});