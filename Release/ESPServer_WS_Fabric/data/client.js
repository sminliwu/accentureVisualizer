/* 
 * Authors: Shanel & Emma
 * Project: Accenture Force Fabric
 * Desc: This code opens the websocket connection between client and server, and parses any incoming data from the server + fabric
 */


// var connection = new WebSocket('ws://'+ location.hostname +':81/', ['arduino']);
//   connection.onopen = function () {
//     connection.send('Connect ' + new Date());
//   };
//   connection.onerror = function (error) {
//     console.log('WebSocket Error ', error);
//   };
//   connection.onmessage = function (e) {
//     var dataArray = parseData(e.data);
//     console.log('Region: ', dataArray[0], ', Value: ', dataArray[1]);
//     if (dataArray[1] > 0) {
//       hasData({region: dataArray[0], scale: dataArray[1]});
//     }
//   };
//   connection.onclose = function () {
//     console.log('WebSocket connection closed');
//   };


/* Expects data in the form of {%d, %d} */
function parseData(data) {
  var halves = data.split(",");
  var number1 = (halves[0].split("{"))[1];
  var temp = (halves[1].split(" "))[1];
  var number2 = (temp.split("}"))[0];
  var region = parseInt(number1);
  var value = parseInt(number2);
  var dataArray =[];
  dataArray[0] = region;
  dataArray[1] = value;
  return dataArray;
}


  




