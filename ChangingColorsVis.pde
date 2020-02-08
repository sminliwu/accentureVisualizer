int green;

void setup(){
  size(500,500);
  background(255,255,255);
  green = 230;
  noStroke();
  fill(255,green,0);
  rect(100,150,300,200);
}

void draw() {
  if (mousePressed){
    match(1023);
  } else {
    match(0);
  }
}

void match(float data) {
  int transformedForce = transformForce(data);
  if (green < transformedForce) {
    green += 2;
    fill(255,green,0);
    rect(100,150,300,200);
  }
  else if (green > transformedForce) {
    green -= 2;
    fill(255,green,0);
    rect(100,150,300,200);
  }
  else if (green == transformedForce) {
    fill(255,green,0);
    rect(100,150,300,200);
  }
}

int transformForce(float data) {
  float toScale = 1023-data;
  float multiplier = 0.2248289345;
  float scaled = multiplier*toScale;
  return int(scaled);
}
