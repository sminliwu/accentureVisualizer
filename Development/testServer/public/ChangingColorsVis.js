var green;

function setup() {
  createCanvas(500,500);
  green = 230;
  noStroke();
  fill(255,green,0);
  rect(100,150,300,200);
}

function draw() {
  if(mouseIsPressed) {
    matchColor(1023);
  } else {
    matchColor(0);
  }
}

function dataMatch(data) {

}

function matchColor(forceData) {
  var transformedForce = transformForce(forceData);
  if (green < (transformedForce-1)){
    green +=2;
    fill(255, green,0);
    rect(100,150,300,200);
  } else if (green > (transformedForce + 1)) {
    green -= 2;
    fill(255,green,0);
    rect(100,150,300,200);
  }
}

function transformForce(forceData){
   var toScale = (1023-forceData)*0.2248289345;
   return int(toScale);
}
