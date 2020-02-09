// Author(s): Smitha Bhaskar

const http = require('http');
const mysql = require('mysql');
const WebSocket = require('ws');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'EID',
  password: 'EID',
  database: 'TEMP',
  charset: 'utf8'
});

//html string that will be send to browser
var reo ='<html><head><title>Temperature and humidity Readings</title></head><body><h1>Node.js MySQL Select</h1>{${table}}</body></html>';

//sets and returns html table with results from sql select
//Receives sql query and callback function to return the table
function setResHtml(sql, cb){
  pool.getConnection((err, con)=>{
    if(err) throw err;

    con.query(sql, (err, res, cols)=>{
      if(err) throw err;

      var table =''; //to store html table

      //create html table with data from res.
      for(var i=0; i<res.length; i++){
        table +='<tr><td>'+ res[i].dateandtime +'</td><td>'+ res[i].TEMPERATUREinC +'</td><td>'+ res[i].HUMIDITY +'</td></tr>';
      }
      table ='<table border="1"><tr><th>DateandTime</th><th>TemperatureinC</th><th>Humidity</th></tr>'+ table +'</table>';

      con.release(); //Done with mysql connection

      return cb(table);
    });
  });
}

let sql ='SELECT * from Sensor LIMIT 10';

//create the server for browser access
const server = http.createServer((req, res)=>{
  setResHtml(sql, resql=>{
    reo = reo.replace('{${table}}', resql);
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write(reo, 'utf-8');
    res.end();
  });
});

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});

server.listen(8080, ()=>{
  console.log('Server running at //localhost:8080/');
});