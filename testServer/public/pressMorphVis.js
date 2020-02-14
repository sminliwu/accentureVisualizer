var top_text_line = 30;
var reg_top = 90;
var  color_value = [230, 230, 230, 230, 230, 230];
var  history_value = [230, 230, 230, 230, 230, 230];
var  bg_fill = 255;
var view_mode = "present";


  // open socket after everything P5 is ready
let  socket = io('http://192.168.0.4:5000');

  socket.on('reading', function(packet) {
    console.log(JSON.stringify(packet));
    data = packet['reading'];
  });
}


function setup() {
  createCanvas(1024,768);

  //this wll be removed on install - its just to see the bounds of the tablet screen
  noFill();
  stroke(100);
  rect(0, 0, 1024, 768);


   header = createDiv();
   header.parent("sketch");
   header.position(0, 50);
   header.size(1024, 100);


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
  for(var l = 0; l <= 10; l++){
      fill(255, l * (1023/10.0), 0);
      rect(l*10, 0, 20, 30);
      
  }
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

 }

 function loadHistory(){
  //somehow read the history in and populate the most and least presssed regions (for now)


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
