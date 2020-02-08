class CircleGradient {
  float x;
  float y;
  int dim;
  Boolean drawn;
  
  CircleGradient() {
    x = width/2;
    y = height/2;
    dim = 0;
  }
  
  void drawCircle(int radius) {
    float g = 230;
    dim = radius;
    fill(255,g,0);
    ellipse(x,y,145,145);
    for (int r = radius; r >0; --r) {
      fill(255,g,0);
      if (r < 145) {
        ellipse(x,y,r,r);
      } else {
        ellipse(x,y,145,145);
      }
      if(g > 1) {
        g -= 2;
      }
    }
  }
  
  void grow(int radius) {
    if (dim < radius) {
      drawCircle(dim);
      dim += 1;
    }
  }
  
  void shrink(int radius) {
    if (dim > radius) {
      background(255,255,255);
      drawCircle(dim);
      dim -= 1;
    }
  }
  
  void match(int radius) {
    if (dim < radius) {
      grow(radius);
    }
    else if (dim > radius) {
      shrink(radius);
    }
    else if (dim == radius) {
      drawCircle(radius);
    }
  }
}

CircleGradient circle;

void setup() {
  size(400,400);
  background(255,255,255);
  noStroke();
  smooth();
  frameRate(200);
  rectMode(CENTER);
  ellipseMode(RADIUS);
  circle = new CircleGradient();
  fill(255,230,0);
  rect(width/2,height/2,250,150);
}

void draw(){
  int forceData = 1023;
  int transformedForce = transformForce(forceData);
  if (mousePressed) {
    circle.match(transformedForce);
  }
  else {
    circle.match(0);

  }
  boundGradient();
}

void cover(float x, float y, float width, float height) {
   noStroke();
   fill(255,255,255);
   rect(x,y,width,height);
}

void boundGradient() {
  float y = (height/2) + 125;
  float y2 = (height/2) - 125;
  float x = (width/2) + 175;
  float x2 = (width/2) - 175;
  cover(width/2,y,250,100);
  cover(width/2,y2,250,100);
  cover(x,height/2,100,150);
  cover(x2,height/2,100,400);
}

int transformForce(float forceData) {
  int transformedForce;
  float multiplier = 0.219941349;
  transformedForce = int(forceData * multiplier);
  return transformedForce;
}
