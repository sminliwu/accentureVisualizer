/**
 * Web app that communicates with an Arduino connected via Bluetooth 
 * (a virtual port) to the computer.
 *
 */
var fillCol = 0;
var voltage = 0;
const Y_AXIS = 1;
const X_AXIS = 2;
const LOGIC_HIGH = 5; // logic high voltage is 5V or 3.3V?
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
}

function mouseWheel(event) {
  //move the square according to the vertical scroll amount
  console.log(event.delta); // MAKE SURE TO SCALE TO MATCH ARDUINO OUTPUT
  fillCol += event.delta/20;
  if (fillCol > 255) {
  	fillCol = 255;
  } if (fillCol < 0) {
  	fillCol = 0;
  }

  voltage = fillCol/255*LOGIC_HIGH;
  // block default behavior, page scrolling
  return false;
}

function draw() {
  // visualization
  let currentCol = lerpColor(c2, c1, fillCol/255);
  if (mouseIsPressed) {
    fill(currentCol);
  	noStroke();
  	circle(mouseX, mouseY, 20);
  }

  // indicator gradient
  fill(0)
  noStroke();
  rect(0, 0, 100, windowHeight);
  setGradient(10, 10, 40, 255, c1, c2, Y_AXIS);

  // triangle pointing to color
  fill(255);
  noStroke();
  triangle(30, 265-fillCol, 50, 270-fillCol, 50, 260-fillCol);
  
  // voltage reading
  textSize(12);
  text(nf(voltage, 1, 2) + " V", 55, 270-fillCol);
}