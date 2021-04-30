/*
AUTHOR: LAURA
PROJECT: ACCENTURE FABRIC THAT REMEMBERS
DESC: This code controls the UI. It updates based on calls from client and then writes to log.
It also parses the log in order to draw history graphs
*/


var  color_value = [0, 0, 0, 0, 0, 0];
var  history_value = [0, 0, 0, 0, 0, 0];
var  color_targets = [0,0,0,0,0,0];
var num_regions = 6;
var  view_mode = "present";

var  history_resolution = 50; //adjust this if you want the history vis to be more or less detailed. 

var  fp_timewindow = {
  history: [],
  max: 0
};
var  reg_timewindow = {
  history: [],
  max: 0
};

var oldest_stamp = 0;
var newest_stamp =  0;



window.onload = function() {
 const body = document.getElementById('sketch'); 

 body.onclick = function changeContent() {
    var r = Math.floor(Math.random()*6);
    var val = Math.floor(Math.random()*10);

    var e = {
      data: "{"+r+", "+val+"}"
    };

    var dataArray = parseData(e.data);
    console.log('Region: ', dataArray[0], ', Value: ', dataArray[1]);
    if (dataArray[1] > 0) {
      hasData({region: dataArray[0], scale: dataArray[1]});
    }
  }


  window.requestAnimationFrame(draw);

};



// function draw(timestamp) {
//   if (start === undefined)
//     start = timestamp;
//   const elapsed = timestamp - start;

//   // `Math.min()` is used here to make sure that the element stops at exactly 200px.
//   element.style.transform = 'translateX(' + Math.min(0.1 * elapsed, 200) + 'px)';

//   if (elapsed < 2000) { // Stop the animation after 2 seconds
//     window.requestAnimationFrame(step);
//   }
// }





// function setup() {

//    c_red = color(255, 0, 0);
//    c_white = color(255, 255, 255);
   var  c_blue = "rgb(11,66,110)";

//   createCanvas(1024,768);

//   noFill();
//   stroke(c_red);
//   rect(0, 0, 1024, 768);
//   history_slider = createSlider(0, history_resolution, history_resolution, 1);
//   history_slider.position(30, 700);
//   history_slider.style("width", "880px");
//   history_slider.hide();

//   title = createDiv("A Fabric that Remembers");
//   title.style('font-family', font);
//   title.style('font-size', '24px');
//    title.style('color', '#f00');
//   title.position(30, 50);


//   button_past = createButton('history');
//   button_past.position(780, 50);
//   button_past.mousePressed(swapToPastMode);
//   button_past.size(100,30);
//   button_past.style("background-color", "#fff");
//   button_past.style("border", "thin solid #f00")
//   button_past.style("color", "#f00");
//   button_past.style('font-family', font);
//   button_past.style('font-size', '14px');



//   button_present = createButton('live');
//   button_present.position(900, 50);
//   button_present.mousePressed(swapToPresentMode);
//   button_present.size(100,30);
//   button_present.style("border", "thin solid #f00")
//   button_present.style("background-color", "#f00");
//   button_present.style("color", "#fff");
//   button_present.style('font-family', font);
//   button_present.style('font-size', '14px');

// }




function draw(timestamp) {


  const body = document.getElementById("body");

  if(view_mode == "present"){
    body.style.backgroundColor = "white";
    body.style.color = "red";

  }else{

  	 body.style.backgroundColor = c_blue;
     body.style.color = "white";
  }

  

  if(view_mode != "present"){
	 let v = history_slider.value();
   setHistoryColorValues(v);
  }


  const r1 = document.getElementById('region_1');
  r1.style.backgroundColor = getColor(5);

  const r2 = document.getElementById('region_2');
  r2.style.backgroundColor = getColor(4);

  const r3 = document.getElementById('region_3');
  r3.style.backgroundColor = getColor(2);

  const r4 = document.getElementById('region_4');
  r4.style.backgroundColor = getColor(3);

  const r5 = document.getElementById('region_5');
  r5.style.backgroundColor = getColor(0);

  const r6 = document.getElementById('region_6');
  r6.style.backgroundColor = getColor(1);


  // //draw the information under the region visualization
  
  window.requestAnimationFrame(draw);

}



function drawHistoryGraph(){

    const hs = document.getElementById("history_slider");
    const begin = document.getElementById("begin");
    const end = document.getElementById("end");
    const graph = document.getElementById("graph");
   
    hs.style.display = "flex";


  	var date_begin = new Date();
  	date_begin.setMilliseconds((oldest_stamp*1000)-Date.now());
  	var begin_str = date_begin.getMonth()+"/"+date_begin.getDate()+"/"+date_begin.getFullYear()
    begin.innerHTML = begin_str;

  	var date_end = new Date();
  	date_end.setMilliseconds((newest_stamp*1000)-Date.now());
  	var end_str = date_end.getMonth()+"/"+date_end.getDate()+"/"+date_end.getFullYear()
    end.innerHTML = end_str;

  



	stroke(255, 255, 255, 100);
	noFill();

		//draw the tick marks
	  	push()
		  	for(var i =0; i < history_resolution; i++){
		  	   line(0,0, 0, graph_h);
		  	   translate(graph_w/history_resolution, 0);
		  	}
	  	//line(0,0, 0, graph_h);
	  	pop();


	  	//draw the graph line
	 	push()
	 	noFill();
	 	stroke(c_white);
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
	  	pop();
  	pop();
}




//this is called from the web socket each time a region has a non-zero value to report
function hasData(data){
  console.log(data);
  //data.scale will be a number from 0-10
  if(data.scale > 2)  color_targets[data.region] = data.scale;
  logData(data);
}

//note, changing these values makes the transition faster
function getColor(region){

  working_colors = (view_mode=="present") ? color_value : history_value;
  target_adjusted = color_targets[region]*250/10;

    if(working_colors[region] < target_adjusted){
      working_colors[region] += 5;

    }else if(working_colors[region] == target_adjusted){
      color_targets[region] = 0;

    }else{
       working_colors[region] -= 5;
    }

    var opacity = (working_colors[region]+5)/255;


  if(view_mode == "present"){
    return "rgba(255,0,0,"+opacity+")";
  }else{
    return "rgba(255, 255, 255,"+opacity+")";
  }

}



// function matchColor(region, forceData) {
//   var transformedForce = transformForce(forceData);
//   if (color_value[region] < (transformedForce-1)){
//     color_value[region] +=10;
//   } else if (color_value[region] > (transformedForce + 1)) {
//     color_value[region] -= 10;
//   }
// }

// function transformForce(forceData){
//    var toScale = (1023-forceData)*0.2248289345;
//    return int(toScale);
// }



// function clearData(){
//   //data.scale will be a number from 0-10
//   //must map scale to a range from 0-1023
//   for(var i = 0; i < 6;i++){
// 	  var color_target = 0;
// 	  matchColor(i, color_target);
// 	}
// }

//this loads the current log data and organizes it into structutres by region and time window for visualization

 function loadHistory(){

  const hs = document.getElementById("history_slider");


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


	oldest_stamp = d_log[0].timestamp;
  newest_stamp =   d_log[0].timestamp

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
   	   	//window_array[d_log[d].region] = int(window_array[d_log[d].region]) +1;  

   	   	region_array =  reg_timewindow.history[d_log[d].region];
   	   	region_array[cur_window] = int(region_array[d_log[d].region]) + int(d_log[d].value);
   	   	//region_array[cur_window] = int(region_array[d_log[d].region]) + 1;


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

  const body = document.getElementById("body");
  const button_present = document.getElementById("present");
  const button_past = document.getElementById("past");
  const live = document.getElementById("live");
  const map = document.getElementById("map");


  live.style.display = "none";
  map.style.border= "1px solid white";

  body.style.backgroundColor = c_blue;
  body.style.color = "white";


  button_present.style.backgroundColor = "#0b426e";
  button_present.style.color="white";
  button_present.style.border = "thin solid white";

  button_past.style.backgroundColor = "white";
  button_past.style.color="#0b426e";
  button_past.style.border = "thin solid white";



  loadHistory();
  drawHistoryGraph();


}

function swapToPresentMode(){

  console.log("to present");

  const body = document.getElementById("body");
  const button_present = document.getElementById("present");
  const button_past = document.getElementById("past");
  const live = document.getElementById("live");
  const map = document.getElementById("map");

  live.style.display = "flex";
  map.style.border= "1px solid red";

  body.style.backgroundColor = "#ffffff";
  body.style.color = "red";
 
  button_present.style.backgroundColor = "red";
  button_present.style.color="white";
  button_present.style.border = "thin solid red";

  button_past.style.backgroundColor = "white";
  button_past.style.color="red";
  button_past.style.border = "thin solid red";

}




