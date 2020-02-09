/**
 * Web app to visualize inputs from Arduinos configured as USB mice and keyboards.
 *
 */

var fillCol = 0;
var pressure = 0;
const Y_AXIS = 1;
const X_AXIS = 2;
let c1, c2;

// Gradient function from https://p5js.org/examples/color-linear-gradient.html
function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();

  if (axis === Y_AXIS) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === X_AXIS) {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}

function setup() {
	// visual parameters
  	createCanvas(windowWidth, windowHeight);
  	noStroke();
  	// Define colors
  	c1 = color(255, 255, 0);
  	c2 = color(255, 0, 0);

    // titles and headers
    fill(0);
    textSize(48);
    text("Pressure", 20, 58);
    text("Last Key Press", 350, 58);
}

// analog input (pressure sense) = mouseWheel
function mouseWheel(event) {
  console.log(event.delta); // MAKE SURE TO SCALE TO MATCH ARDUINO OUTPUT
  fillCol += event.delta/20;
  if (fillCol > 255) {
  	fillCol = 255;
  } if (fillCol < 0) {
  	fillCol = 0;
  }

  pressure = fillCol/255*100;
  // block default behavior, page scrolling
  return false;
}

// visualization
function draw() {
  // pressure reading - colored box with pressure reading between 0 and 100%
  let currentCol = lerpColor(c2, c1, fillCol/255);
  fill(currentCol);
  noStroke();
  rect(60, 70, 200, 90);
  fill(0);
  textSize(30);
  text(nfc(pressure, 0) + "%", 75, 110);

  // indicator gradient
  setGradient(10, 70, 40, 255, c1, c2, Y_AXIS);

  // triangle pointing to color
  fill(255);
  noStroke();
  triangle(30, 325-fillCol, 50, 320-fillCol, 50, 330-fillCol);
  
  ////////////////
  // digital inputs - key presses (each button mapped to a key)
  fill(200);
  rect(350, 70, 300, 90);
  fill(0);
  text(key, 360, 110);
}