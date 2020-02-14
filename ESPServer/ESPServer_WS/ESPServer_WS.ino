// property of shanel
// Connect to BTUGoo
// Requires Static IP - Laura to Setup UnstableWIFI to host static IP

// TO DO 
// DONE (1) This code needs to serve HTTP files (stored locally)
// DONE (2) This code needs to establish websocket with client
// -- (3) Combine this code with fabricsense.ino to read Arduino pins

#include <WiFi.h>
#include <WebSocketsServer.h>
#include <ESPAsyncWebServer.h>
#include <SPIFFS.h>

const char* ssid     = "BTUgoo";
const char* password = "blowItUp";

//const char* ssid = "UnstableWifi";
//const char* password = "fluxusmuxus";

const int port = 80;
const int WSport = 81;

int count = 0;

AsyncWebServer server(port);
WebSocketsServer webSocket(WSport);

String getContentType(String filename); // convert the file extension to the MIME type
bool handleFileRead(String path);       // send the right file to the client (if it exists)

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
  
  server.on("/pressMorphVis.js", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/pressMorphVis.js", "text/javascript");
  });
  server.on("/socket.js", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/socket.js", "text/javascript");
  });

  server.begin();
  Serial.println("Async HTTP server started.");

  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
  Serial.println("Websocket server started.");
}

void loop(){
  webSocket.loop();
  if ((count >= 0) && (count < 1000)){
    webSocket.broadcastTXT("{1, 10}");
  } else if ((count >= 1000) && (count < 2000)) {
    webSocket.broadcastTXT("{2, 10}");
  } else if ((count >= 2000) && (count < 3000)) {
    webSocket.broadcastTXT("{3, 10}");
  } else if ((count >= 3000) && (count < 4000)) {
    webSocket.broadcastTXT("{4, 10}");
  } else if ((count >= 4000) && (count < 5000)) {
    webSocket.broadcastTXT("{5, 10}");
  } else if (count >= 5000) {
    webSocket.broadcastTXT("{6, 10}");
  } else {
    Serial.println("Invalid count");
  }

  count++;
  count = count % 6000;
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:             // if a client disconnects
      Serial.printf("[%u] Client disconnected :(", num);
      break;
    case WStype_CONNECTED: {              // if a new websocket client connects
      IPAddress ip = webSocket.remoteIP(num);
      Serial.printf("[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);
      break;
    }
    case WStype_TEXT: {                   // if new text data is received
      Serial.printf("[%u] got Text: %s\n", num, payload);
      break;
    }
  }
}
