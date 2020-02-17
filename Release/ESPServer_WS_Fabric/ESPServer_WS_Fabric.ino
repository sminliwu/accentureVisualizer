/*
 * Date: Feb 14
 * Author: Shanel
 * Project: Accenture Force Fabric
 * 
 * This code handles the web server and websockets connectivity functions of the ESP/Arduino.
 * This code compiles with Accenture_FabricSense.ino in the Arduino IDE.
 */

#include <WiFi.h>
#include <WebSocketsServer.h>
#include <ESPAsyncWebServer.h>
#include <SPIFFS.h>
#include <string.h>

// put network information here
const char* ssid     = "YOUR_NTWK_SSID_HERE";
const char* password = "YOUR_NTWK_PASSWORD_HERE";

const int port = 80;
const int WSport = 81;

AsyncWebServer server(port);
WebSocketsServer webSocket(WSport);

char dataBuffer[30];

//pins for force region 1-6 
int fregs[] = {36, 37, 38, 39, 32, 33};

//the sensor values on each round
int vals[6];

//preset / compiled baselines for each value
int base[6];

// preset max offset - this makes it more or less sensitive (max 1000)
int max_offset = 500;

//preset number of "steps" to detect in each press
int offset_step_size = 50;

//the total number of regions on the fabric
int num_regs = 6;

//how long to search for a baseline during the initialization phase
int baseline_window = 100;

//updates on each loop
int counter = 0;

void setup() {
  Serial.begin(115200);
  
  if(!SPIFFS.begin()){
    Serial.println("error occured while mounting SPIFFS");
    return;
  }
  
  WiFi.begin(ssid, password);
  Serial.println("atempting to connect to wifi");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print('.');
  }
  
  Serial.println("connection successful!");
  Serial.print("server running at IP:\t");
  Serial.print(WiFi.localIP());
  Serial.print(":");
  Serial.println(port);
  
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/index.html", "text/html", false);
  });
  
  // make sure there's a server.on(___) for each file in data
  // and that there are no unused files in data to waste storage
  server.on("/ui.js", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/ui.js", "text/javascript");
  });
  server.on("/client.js", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/client.js", "text/javascript");
  });
  server.on("/log.js", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/log.js", "text/javascript");
  });

  server.begin();
  Serial.println("Async HTTP server started.");

  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
  Serial.println("Websocket server started.");

  Serial.println("calculating base values");
  calculate_base_values(baseline_window);
  print_base_values();
  Serial.println("end base values");
}

void loop(){
  webSocket.loop();

  read_values();
  // send values from fabric to the websocket
  print_offset_steps(); // printing has been commented out in final version
  delay(100);
}

/* Callback function for websocket events. */
void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED: // if a client disconnects
      Serial.printf("[%u] Client disconnected :(", num);
      break;
    case WStype_CONNECTED: { // if a new websocket client connects
      IPAddress ip = webSocket.remoteIP(num);
      Serial.printf("[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);
      break;
    }
    case WStype_TEXT: { // if new text data is received
      Serial.printf("[%u] got Text: %s\n", num, payload);
      break;
    }
  }
}


/* Pack values into a string in the form {%d, %d} to send to the 
 * websocket, where the client expects to parse this format.
 */
void packVals(int region, int val) {
  for (int i = 0; i < 30; i++) {
    dataBuffer[i] = '\0';
  }
  char regionStr[20];
  char valStr[20];
  itoa(region, regionStr, 10);
  itoa(val, valStr, 10);
  strcat(dataBuffer, "{");
  strcat(dataBuffer, regionStr);
  strcat(dataBuffer, ", ");
  strcat(dataBuffer, valStr);
  strcat(dataBuffer, "}");
}
