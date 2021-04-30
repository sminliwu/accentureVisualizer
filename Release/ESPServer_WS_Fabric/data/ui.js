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
var  c_blue = "rgb(11,66,110)";
var  history_position = 50;

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


function handleMove(evt) {

  var hs = document.getElementById("history_slider");

  evt.preventDefault();

  let seg = 0;
  let offset = evt.touches[0].clientX - hs.offsetLeft;
  if(offset > 0){
    seg = Math.floor(offset / history_resolution);
  }

  if(offset > hs.offsetWidth) seg = 50;

  history_position = seg;
  setHistoryColorValues(seg);

}


function handleStart(evt) {
  evt.preventDefault();
  console.log("start");

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

window.onload = function() {
 const body = document.getElementById('sketch'); 


  var hs = document.getElementById("history_slider");
  hs.addEventListener("touchmove", handleMove, false);


  var map = document.getElementById("map");
  map.addEventListener("touchstart", handleStart, false);


  window.requestAnimationFrame(draw);

};




function draw(timestamp) {

  if(view_mode != 'present'){
    setHistoryColorValues(history_position);
  }


  const body = document.getElementById("body");


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

    clearHistoryGraph();

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

  

		//draw the tick marks + bars
  	for(var i =0; i < history_resolution; i++){
      // console.log(fp_timewindow);
      // console.log(fp_timewindow.history[i][6],fp_timewindow.max, graph.offsetHeight);
       let y = fp_timewindow.history[i][6] / fp_timewindow.max * graph.offsetHeight;
       if(y <=0) y = 10;
       if(y >= 100) y = 90;

       let div = document.createElement("div");
       div.classList.add("graph-segment")
       div.id = i;
       div.style.height = "100%";
       div.style.width = graph.offsetWidth/history_resolution+"%";

      let measure = document.createElement("div");
      measure.classList.add("measurement");
      measure.style.height = y+"%";
      div.appendChild(measure);
      graph.appendChild(div);

  	}
}

function clearHistoryGraph(){
      const graph = document.getElementById("graph");
      while (graph.firstChild) {
        graph.removeChild(graph.firstChild);
     }
     console.log("graph", graph.children);
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


  if(view_mode === "present"){
    return "rgba(255,0,0,"+opacity+")";
  }else{
    return "rgba(255, 255, 255,"+opacity+")";
  }

}


//this loads the current log data and organizes it into structutres by region and time window for visualization

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

   if(d_log.length == 0) return;

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
   		var cur_window = parseInt((d_log[d].timestamp - oldest_stamp) / time_window);

   		window_array = fp_timewindow.history[cur_window];
   	  window_array[d_log[d].region] = parseInt(window_array[d_log[d].region]) +parseInt(d_log[d].value);  
   	   	//window_array[d_log[d].region] = int(window_array[d_log[d].region]) +1;  

   	  region_array =  reg_timewindow.history[d_log[d].region];
   	  region_array[cur_window] = parseInt(region_array[d_log[d].region]) + parseInt(d_log[d].value);
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
    setHistoryColorValues(parseInt(r), last_value);
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
  const live = document.getElementById("key");
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
  view_mode = "present";


  const body = document.getElementById("body");
  const button_present = document.getElementById("present");
  const button_past = document.getElementById("past");
  const live = document.getElementById("key");
  const map = document.getElementById("map");
  const hs = document.getElementById("history_slider");

  hs.style.display = "none";
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




