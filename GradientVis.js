class CircleGradient {
  constructor() {
    this.x = 250;
    this.y = 250;
    this.dim = 0;
  }
  
  drawCircle(radius) {
     var g = 230;
     this.dim = radius;
     for (var r = radius; r > 0; --r) {
      fill(255,g,0);
      if (r < 145) {
        ellipse(this.x,this.y,r,r);
      } else {
        ellipse(this.x,this.y,145,145);
      }
      if(g > 1) {
        g -= 2;
      }
    }
  }
  
  grow(radius) {
    if (this.dim < radius) {
      this.drawCircle(this.dim);
      this.dim += 1;
    }
  }
  
  shrink(radius) {
    if (this.dim > radius) {
      this.drawCircle(this.dim);
      this.dim -= 1;
    }
  }
  
   matchSize(radius) {
    if (this.dim < radius) {
      this.grow(radius);
    }
    else if (this.dim > radius) {
      this.shrink(radius);
    }
    else if (this.dim == radius) {
      this.drawCircle(radius);
    }
   }
}

let circle;

function setup() {
  createCanvas(500,500);
  background(255,255,255);
  circle = new CircleGradient();
  noStroke();
  smooth();
  frameRate(200);
  rectMode(CENTER);
  ellipseMode(RADIUS);
  fill(255,230,0);
  rect(250,250,250,150);
}

function draw(){
  var forceData = 1023;
  var transformedForce = transformForce(forceData);
  noStroke();
  if (mouseIsPressed) {
    circle.matchSize(transformedForce);
  }
  else {
    circle.matchSize(0);
  }
  boundGradient();
}

function cover(x, y, w, h) {
   noStroke();
   fill(255,255,255);
   rect(x,y,w,h);
}

function boundGradient() {
  var y = (250) + 125;
  var y2 = (250) - 125;
  var x = (250) + 175;
  var x2 = (250) - 175;
  cover(250,y,250,100);
  cover(250,y2,250,100);
  cover(x,250,100,150);
  cover(x2,250,100,400);
}

function transformForce(forceData){
  var toScale = (forceData)*0.2248289345;
  return int(toScale);
}
