import java.math.BigDecimal;
import java.math.MathContext;

ArrayList<PVector> rectangle = new ArrayList<PVector>();
ArrayList<PVector> circle = new ArrayList<PVector>();
ArrayList<PVector> result = new ArrayList<PVector>();
BigDecimal tracking;
int green;
float data = 1023;
MathContext m = new MathContext(1);

void setup() {
  rectMode(CENTER);
  size(640,360);
  background(51);
  //sets original green value to 230 corresponding to the desired yellow color
  green = 230;

  //populates the arraylist for circle with vectors to its coordinate spots along the circumference of the circle
  for (int angle = 0; angle < 360; angle += 9) {
    PVector v = PVector.fromAngle(radians(angle-135));
    v.mult(200);
    circle.add(v);
    //adds empty vectors to the result arraylist
    result.add(new PVector());
  }
  
  //populates rectangle arraylist
  for (int x = -150; x < 150; x += 30) {
    rectangle.add(new PVector(x, -100));
  }
  // Right side
  for (int y = -100; y < 100; y += 20) {
    rectangle.add(new PVector(150, y));
  }
  // Bottom
  for (int x = 150; x > -150; x -= 30) {
    rectangle.add(new PVector(x, 100));
  }
  // Left side
  for (int y = 100; y > -100; y -= 20) {
    rectangle.add(new PVector(-150, y));
  }
  
  //draws the original rectangle
  fill(255,green,0);
  rect(width/2,height/2,300,200);
  
  //initializes tracking to 0
  tracking = new BigDecimal(0);
}

void draw() {
  //redraws yellow rectangle if tracking is zero
  if (tracking.floatValue() == 0) {
    background(51);
    fill(255,green,0);
    rect(width/2,height/2,300,200);
  }
  if (mousePressed) {
    //transforms the force data to be comparable with green in the range of 0 to 230
    int transformedForce = transformForceColor(data);
    //adjusts green if needed
    if (green > transformedForce + 2) {
      green -= 3;
    }
    match(data);
  } else {
    //transformes the force data to be comparable with green on a scale of 0-230
    int transformedForce = transformForceColor(0);
    if (green < transformedForce - 2) {
       //adjusts green if needed
       green += 3;
     }
    match(0);
  }
}

//interface between result vector (what is drawn) and the actual draw function -> appropiate causes the rectangle to morph based on the data
//input: requres the raw data (as a float)
void match(float forceData) {
  //transforms data to be compared to tracking (which measures how close on a scale of 0 to 1 is the morphed rectangle to a circle)
  float transformedData = transformForce(forceData);
  transformedData = round(transformedData*10);
  transformedData /= 10;
  float check = round((tracking.floatValue() - transformedData)*100);
  check /= 100;
  if (check < 0) {
    grow();
  } else if (check > 0) {
    shrink();
  }
}

void grow() {
  //adds slightly to tracking
  BigDecimal addOn = new BigDecimal(0.01);
  tracking = tracking.add(addOn);
 
  //iterates through the rectangle arraylist
  for (int i = 0; i < rectangle.size(); i++) {
    PVector v1;
    PVector v2;
    //gets the rectangle and circle vectors at this index
    v1 = rectangle.get(i);
    v2 = circle.get(i);
    PVector newVector;
    //lerps between the two, using tracking's float value as the amount
    newVector = PVector.lerp(v1,v2,tracking.floatValue());
    //set result at i to this newVector
    result.set(i,newVector);
  }
      
  //move the drawing to the center of the sketch and fill with adjusted green and 255 for red
  translate(width/2, height/2);
  noStroke();
  fill(255,green,0);
  
  //actually draw the morphed shape
  beginShape();
  for (PVector v : result) {
    vertex(v.x, v.y);
  }
  endShape(CLOSE);
}

void shrink() {
  //erase what has been drawn
  background(51);
  
  //subtracts slightly from tracking
  BigDecimal sub = new BigDecimal(0.01);
  tracking = tracking.subtract(sub);
   
  //iterates through the rectangle arraylist
  for (int i = 0; i < rectangle.size(); i++) {
    PVector v1;
    PVector v2;
    //gets the rectangle and circle vectors at this index
    v1 = rectangle.get(i);
    v2 = circle.get(i);
    PVector newVector;
    //lerps between the two, using tracking's float value as the amount
    newVector = PVector.lerp(v1,v2,tracking.floatValue());
    //set result at i to this newVector
    result.set(i,newVector);
  }   
    
  //move the drawing to the center of the sketch and fill with adjusted green and 255 for red
  translate(width/2, height/2);
  noStroke();
  fill(255,green,0);

  //actually draw the morphed shape
  beginShape();
  for (PVector v : result) {
    vertex(v.x, v.y);
  }
  endShape(CLOSE);
}

//finds how close to a circle the morphed shape should be on a scale of 0 to 1 (only accessing 0.6, b/c never want it to be full circle) based on the force
//input: raw force data (as a float)
float transformForce(float forceData) {
  float toBeRounded= (forceData/1023)*0.6;
  float scale = 10;
  toBeRounded = round(toBeRounded*scale);
  return toBeRounded/scale;
}

//determines the correct greeen value based on the force
//input: raw force data (as a float)
int transformForceColor(float data) {
  float toScale = 1023-data;
  float multiplier = 0.2248289345;
  float scaled = multiplier*toScale;
  return int(scaled);
}
