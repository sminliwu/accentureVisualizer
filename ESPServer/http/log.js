/*


AUTHOR: LAURA
PROJECT: ACCENTURE FABRIC THAT REMEMBERS
DESC: THIS CODE READS FROM AND WRITES DATA TO CHROME LOCAL STORAGE. ALSO MANAGES IT
SO ITS ALWAYS THE MOST RECENT DATA

TO SEE THE DATA OPEN CHROME CODE INSPECTOR -> APPLICATION -> LOCAL STORAGE
SAVES VALUES FOR ALL SESSIONS (EVEN IF YOU CLOSE AND REOPEN)

*/


var LOGMAX = 650000;


//Update to Write to Local Storage.
 function logData(data){


  //get date in seconds
  var timestamp = Math.floor(Date.now() / 1000);

  //input code to write this to a data log
  // let timestamp = "";
  // let y = year();
  // let m = month();
  // let d = day();
  // let h = hour();
  // let mi = minute();
  // let s = second(); //only write what the last value was within the current second.
  // timestamp = y+":"+m+":"+d+":"+h+":"+mi+":"+s;
  let value = data.region+","+data.scale;


  //pop the last value from the list and write a new one. 
  //this ensures that the last 650000 values will be recorded and displayed
  if(localStorage.length >= LOGMAX){
  	for(var x in localStorage){
  		localStorage.removeItem(x);
  	}
  }

  localStorage.setItem(timestamp, value);
 }


 //prints the size of each entry and total use of the local store
//each entry is ~ 0.000008 MB 
//store has max of 5MB
// we can safely store 625000 entries before we over run
function calculateLocalStoreUsage(){

	var total = 0;
	for(var x in localStorage) {
	  var amount = (localStorage[x].length * 2) / 1024 / 1024;
	  total += amount;
	  console.log( x + " = " + amount.toFixed(8) + " MB");
	}
	//console.log( "Total: " + total.toFixed(8) + " MB");
}


//careful!
function clearLocalStorage(){

	var total = 0;
	for(var x in localStorage) {
	  localStorage.removeItem(x);
	}
	console.log( "LOCAL STORAGE CLEARED");
	console.log("local storage size now "+localStorage.length);
}



//load raw log into memory so we can process it for the visualization
//this will be called once everytime we switch into vis mode, though log entries may be
//accumulated in the backgroudn that won't affect this
function loadRawLog(){
	//clear the log so we can load it fresh
	console.log(Date.now());

	var d_log = [];
	//console.log(localStorage.length);

	for(var x in localStorage) {
		if(typeof(localStorage[x]) == "string"){
			values = split(localStorage[x], ",");

			d_log.push({
			timestamp: x,
			region: values[0],
			value: values[1]
		});
		}
	}


	return d_log;

}




