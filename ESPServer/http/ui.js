

var top_text_line = 30;
var reg_top = 90;
var num_regions = 6;
var  color_value = [230, 230, 230, 230, 230, 230];
var  history_value = [230, 230, 230, 230, 230, 230];
var  bg_fill = 255;
var  view_mode = "present";
var  history_resolution = 50;

var  fp_timewindow = {
	history: [],
	max: 0
};
var  reg_timewindow = {
	history: [],
	max: 0
};



function setup() {

   //calculateLocalStoreUsage();

  createCanvas(1024,768);

  //this wll be removed on install - its just to see the bounds of the tablet screen
  noFill();
  stroke(100);
  rect(0, 0, 1024, 768);
  history_slider = createSlider(0, history_resolution, history_resolution, 1);
  history_slider.position(30, 700);
  history_slider.style("width", "880px");
  history_slider.hide();

  title = createDiv("A Fabric that Remembers");
  title.style('font-family', 'avenir');
  title.style('font-size', '24px');
  title.position(30, 50);


  button_past = createButton('past');
  button_past.position(780, 50);
  button_past.mousePressed(swapToPastMode);
  button_past.size(100,30);
  button_past.style("background-color", "#fff");
  button_past.style("border", "thin solid #999")
  button_past.style("color", "#000");
  button_past.style('font-family', 'avenir');
  button_past.style('font-size', '14px');



  button_present = createButton('present');
  button_present.position(900, 50);
  button_present.mousePressed(swapToPresentMode);
  button_present.size(100,30);
  button_present.style("border", "thin solid #999")
  button_present.style("background-color", "#000");
  button_present.style("color", "#fff");
  button_present.style('font-family', 'avenir');
  button_present.style('font-size', '14px');


}




function draw() {



  background(255);
  fill(bg_fill);
  stroke("#999");
  textSize(12);
  textFont('avenir');


  rect(30, 100, 974, 455)

  //make sure the color scale matches the mode
 // var which_color = (view_mode == "present") ? color_value : history_value;

  noStroke();
  pressreg_w = 190;
  pressreg_h = 94;



  if(view_mode != "present"){
	let v = history_slider.value();
    setHistoryColorValues(v);
  }


  //top left - region 0
  fill(getColor(0));
  rect(93,32+reg_top,pressreg_w,pressreg_h);

  //top right - region 1
  fill(getColor(1));
  rect(739,32+reg_top,pressreg_w,pressreg_h);

  //middle left - region 2
  fill(getColor(2));
  rect(267,192+reg_top,pressreg_w,pressreg_h);

  //middle right - region 3
  fill(getColor(3));
  rect(567,192+reg_top,pressreg_w,pressreg_h);

  //bottom left - region 4
  fill(getColor(4));
  rect(44,344+reg_top,pressreg_w,pressreg_h);

  //bottom right- region 5
  fill(getColor(5));
  rect(802,344+reg_top,pressreg_w,pressreg_h);



  //create the sliding 
  if(view_mode != "present"){
		drawHistoryGraph();

  }else{
 
  //now create a key on the lower corner; 
  push();
  translate(800, 575);




  fill(0);
  noStroke();
  text("least force", -70, 20);

  for(var l = 0; l <= 10; l++){
      fill(255, 255 - (l * (255/10.0)), 0);
      rect(l*10, 0, 20, 30);
      
  }
  fill(0);
  text("most force", 130, 20);
  pop();
   }



   // if(mouseIsPressed) {
	  //  	 console.log("mouse Press");
	  //    hasData({region: 1, scale: 10});
	  //    hasData({region: 2, scale: 6});
	  //    hasData({region: 3, scale: 10});
   // } else {
	  //   	hasNoData(0);
	  //     hasNoData(1);
	  //     hasNoData(2);
	  //     hasNoData(3);
	  //     hasNoData(4);
   //    	hasNoData(5);
   // }

}



function getColor(region){

	if(view_mode == "present"){
		return color(255,color_value[region],0);
	}else{
		return color(history_value[region]);
	}


}


function drawHistoryGraph(){
  	history_slider.show();
  	var graph_h = 100;
  	var graph_w = 880;
  	push();
  	translate(30, 575);
  	stroke(200);
 
  	noStroke();
  	fill(0);
  	text("start date", 0,  graph_h+20);
  	text("ACTIVITY LOG", graph_w/2-25,  graph_h+20);
  	text("end date", graph_w-50, graph_h+20);

  	fill(255, 0, 0);
  	text("most pressed", graph_w+20,  10);
  	text("least pressed", graph_w+20,  graph_h);


	stroke(200);
	noFill();

	  	push()
		  	for(var i =0; i < history_resolution; i++){
		  	   line(0,0, 0, graph_h);
		  	   translate(graph_w/history_resolution, 0);
		  	}
	  	line(0,0, 0, graph_h);
	  	pop();

	 	push()
	 	noFill();
	 	stroke(255, 0, 0);
	 	var last_y = -1;
	 	var y = 0;
	 	translate(0, graph_h);

		  	for(var i = 0; i < history_resolution; i++){
		  		y = fp_timewindow.history[i][6] / fp_timewindow.max * graph_h;
		  	   if(last_y != -1){
		  	   	line(0,(1-last_y), graph_w/history_resolution, (1-y));
		  	    translate(graph_w/history_resolution, 0);
		  	   }
		  	   last_y = y
		  	  
		  	}
	    line(0,last_y, graph_w/history_resolution, y);
	  	pop();
  	pop();
}




//placeholder for the incoming data from the web socket
function hasData(data){
  //data.scale will be a number from 0-10
  //must map scale to a range from 0-1023
  var color_target = data.scale * (1023/10);
  matchColor(data.region, color_target);
  logData(data);
}


function hasNoData(region){
  //data.scale will be a number from 0-10
  //must map scale to a range from 0-1023
  var color_target = 0;
  matchColor(region, color_target);
}



 function loadHistory(){

 	reg_timewindow.history = [];
 	reg_timewindow.max = 0;

 	fp_timewindow.history = [];
 	fp_timewindow.max = 0;


 	for(var i = 0; i <= history_resolution; i++){
 		fp_timewindow.history[i] = [];
 		for(var j = 0; j < num_regions; j++){
 			fp_timewindow.history[i].push(0);
 		}
 		//write an extra element for totals
 		fp_timewindow.history[i].push(0);
 	}

 	for(var i = 0; i < num_regions; i++){
 		reg_timewindow.history[i] = [];
 		for(var j = 0; j <= history_resolution; j++){
 			reg_timewindow.history[i].push(0);
 		}
 		//write an extra element for totals
 		reg_timewindow.history[i].push(0);
 	}


 	//this function should show the total accumulated force within the time window saved.
   var d_log = [];
   d_log = loadRawLog();


	var oldest_stamp = d_log[0].timestamp;
   	var newest_stamp =   d_log[0].timestamp

	for(var d in d_log){
		if(d_log[d].timestamp > newest_stamp) newest_stamp = d_log[d].timestamp;
		if(d_log[d].timestamp < oldest_stamp) oldest_stamp = d_log[d].timestamp;
	}

   	var elapsed = newest_stamp - oldest_stamp;
   	var time_window = elapsed / history_resolution; 
 

   	//does not require values ot be in order
   	//writes an array of [time window][region][total force within time region]
   	for(var d in d_log){
   		var time_diff = d_log[d].timestamp - oldest_stamp;
   		var cur_window = int((d_log[d].timestamp - oldest_stamp) / time_window);


   		window_array = fp_timewindow.history[cur_window];
   	   	window_array[d_log[d].region] = int(window_array[d_log[d].region]) +int(d_log[d].value);  

   	   	region_array =  reg_timewindow.history[d_log[d].region];
   	   	region_array[cur_window] = int(region_array[d_log[d].region]) + int(d_log[d].value);


   	}


   	//now go through and caulculate the total forces by timewindow
   	for(var f in fp_timewindow.history){
   		var t = 0;
   		for(var i = 0; i < 6; i++){
   			t += fp_timewindow.history[f][i];
   		}
   		fp_timewindow.history[f][6] = t;
   		if(t > fp_timewindow.max) fp_timewindow.max = t;
    }

    //	now go through and caulculate the total forces by region
   	for(var r in reg_timewindow.history){
   		var t = 0;
   		var l = reg_timewindow.history[r].length -1;
   		for(var i = 0; i < l; i++){
   			t += reg_timewindow.history[r][i];
   		}
   		reg_timewindow.history[r][l] = t;
   		if(t > reg_timewindow.max)reg_timewindow.max = t;
    }

   	

 	history_value = [];


  //set history values to most and least pressed
  for(r in reg_timewindow.history){
  	var last_value = reg_timewindow.history[r].length - 2;
    setHistoryColorValues(int(r), last_value);
  }

 }


function setHistoryColorValues(time){

	history_value = [0,0,0,0,0,0];
	var ndx = 0;

	for(var r in reg_timewindow.history){
		for(var t = 0; t < time; t++){
			history_value[r] = history_value[r] + reg_timewindow.history[r][t];
		}
	}

	for(var i = 0; i < num_regions; i++){
		history_value[i] = (history_value[i] / reg_timewindow.max)*255;
	}
	
}

function swapToPastMode() {
  view_mode = "past";
  bg_fill = 100;

  button_past.style('background-color', "#000");
  button_past.style('color', "#fff");

  button_present.style('background-color', "#fff");
  button_present.style('color', "#000");

  history_slider.show();

  loadHistory();

}

function swapToPresentMode(){
  history_slider.hide();
  view_mode = "present";
  bg_fill = 255;


  button_present.style('background-color', "#000");
  button_present.style('color',  "#fff");

  button_past.style('background-color', "#fff");
  button_past.style('color', "#000");
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

// this is the p5 sketch to load as the UI
