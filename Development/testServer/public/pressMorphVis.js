//LAURA OWNS THIS FILE 
//TO DO: READING/WRITING IS BROKEN 

var top_text_line = 30;
var reg_top = 90;
var  color_value = [230, 230, 230, 230, 230, 230];
var  history_value = [230, 230, 230, 230, 230, 230];
var  bg_fill = 255;
var  view_mode = "present";
var  d_log;



function setup() {

 

  createCanvas(1024,768);

  //this wll be removed on install - its just to see the bounds of the tablet screen
  noFill();
  stroke(100);
  rect(0, 0, 1024, 768);


  // header = createDiv();
  // header.parent("sketch");
  // header.position(0, 50);
  // header.size(1024, 100);
  d_log = new p5.Table();
//  d_log.addColumn('timestamp');
  d_log.addColumn('region');
  d_log.addColumn('value');
  
readLog();


  title = createDiv("A Fabric that Remembers");
  title.style('font-family', 'avenir');
  title.style('font-size', '24px');
  title.position(30, 50);


  button_past = createButton('past');
  button_past.position(780, 50);
  button_past.mousePressed(swapToPastMode);
  button_past.size(100,30);
  button_past.style("background-color", "#333");
  button_past.style("border", "thin solid #999")
  button_past.style("color", "#FFF");
  button_past.style('font-family', 'avenir');
  button_past.style('font-size', '14px');



  button_present = createButton('present');
  button_present.position(900, 50);
  button_present.mousePressed(swapToPresentMode);
  button_present.size(100,30);
  button_present.style("border", "thin solid #999")
  button_present.style("background-color", "#FFF");
  button_present.style("color", "#000");
  button_present.style('font-family', 'avenir');
  button_present.style('font-size', '14px');

  footer = createDiv();
  footer.parent("sketch");
  footer.position(800, 50);
  footer.size(1024, 200);





}

function draw() {
  background(255);
  fill(bg_fill);
  stroke("#999");
  rect(30, 100, 974, 455)

  //make sure the color scale matches the mode
  var which_color = (view_mode == "present") ? color_value : history_value;

  noStroke();
  pressreg_w = 190;
  pressreg_h = 94;


  //top left - region 0
  fill(255,which_color[0],0);
  rect(93,32+reg_top,pressreg_w,pressreg_h);

  //top right - region 1
  fill(255,which_color[1],0);
  rect(739,32+reg_top,pressreg_w,pressreg_h);

  //middle left - region 2
  fill(255,which_color[2],0);
  rect(267,192+reg_top,pressreg_w,pressreg_h);

  //middle right - region 3
  fill(255,which_color[3],0);
  rect(567,192+reg_top,pressreg_w,pressreg_h);

  //bottom left - region 4
  fill(255,which_color[4],0);
  rect(44,344+reg_top,pressreg_w,pressreg_h);

  //bottom right- region 5
  fill(255,which_color[5],0);
  rect(802,344+reg_top,pressreg_w,pressreg_h);


 
  //now create a key on the lower corner; 
  push();

  translate(800, 575);


  fill(0);
  noStroke();
  textSize(12);
  textFont('avenir');
  text("least force", -70, 20);

  for(var l = 0; l <= 10; l++){
      fill(255, 255 - (l * (255/10.0)), 0);
      rect(l*10, 0, 20, 30);
      
  }
  fill(0);
  text("most force", 130, 20);
  pop();



   if(mouseIsPressed) {
     hasData({region: 0, scale: 3});
     hasData({region: 3, scale: 0});

   } else {
     hasData({region: 0, scale: 0});
     hasData({region: 3, scale: 10});

   }
}




//placeholder for the incoming data from the web socket
function hasData(data){


  //only write the present data if we are in the live view mode

  //data.scale will be a number from 0-10
  //must map scale to a range from 0-1023
  var color_target = data.scale * (1023/10);
  matchColor(data.region, color_target);
  logData(data);
}

 function logData(data){
  //input code to write this to a data log
  let timestamp = "";
  let y = year();
  let m = month();
  let d = day();
  let h = hour();
  let mi = minute();
  let s = second(); //only write what the last value was within the current second.
  timestamp = y+":"+m+":"+d+":"+h+":"+mi+":"+s;

  let newRow = d_log.addRow();
  //newRow.setString('timestamp', timestamp);
  newRow.setNum('region', data.region);
  newRow.setNum('value', data.scale);



 }

//called form DOM onLoad
 //loads all previous data collected from other instances of running
function readLog(){
  console.log("Reading Log");
  //d_log = loadTable('log.csv', 'csv', 'header');
  //console.log(d_log);
}
  


 function loadHistory(){
  //somehow read the history in and populate the most and least presssed regions (for now)
  /// write history values here
  //var  history_value = [230, 230, 230, 230, 230, 230];


 }


function swapToPastMode() {
  view_mode = "past";
  bg_fill = 100;

  button_past.style('background-color', "#fff");
  button_past.style('color', "#000");

  button_present.style('background-color', "#000");
  button_present.style('color', "#fff");

}

function swapToPresentMode(){
  view_mode = "present";
  bg_fill = 255;


  button_present.style('background-color', "#fff");
  button_present.style('color',  "#000");

  button_past.style('background-color', "#000");
  button_past.style('color', "#fff");
}



function matchColor(region, forceData) {
  var transformedForce = transformForce(forceData);
  if (color_value[region] < (transformedForce-1)){
    color_value[region] +=10;
  } else if (color_value[region] > (transformedForce + 1)) {
    color_value[region] -= 10;
  }
}

function transformForce(forceData){
   var toScale = (1023-forceData)*0.2248289345;
   return int(toScale);
}

