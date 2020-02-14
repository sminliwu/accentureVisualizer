// property of shanel
// Connect to BTUGoo
// Requires Static IP - Laura to Setup UnstableWIFI to host static IP

// TO DO 
//-- (1) This code needs to serve HTTP files (stored locally)
//-- (2) This code needs to establish websocket with client

#include <WiFi.h>
//#include <WebSocketsServer.h>
#include <ESPAsyncWebServer.h>
#include <SPIFFS.h>

const char* ssid     = "BTUgoo";
const char* password = "blowItUp";

//const char* ssid = "UnstableWifi";
//const char* password = "fluxusmuxus";

const int port = 80;

AsyncWebServer server(port);

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
//
//  server.on("/p5.min.js", HTTP_GET, [](AsyncWebServerRequest *request){
//    request->send(SPIFFS, "/p5.min.js", "text/javascript");
//  });
//  server.on("/p5.dom.min.js", HTTP_GET, [](AsyncWebServerRequest *request){
//    request->send(SPIFFS, "/p5.dom.min.js", "text/javascript");
//  });
  server.on("/pressMorphVis.js", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/pressMorphVis.js", "text/javascript");
  });
  server.on("/socket.js", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(SPIFFS, "/socket.js", "text/javascript");
  });

  server.begin();
}

void loop(){
//  server.handleClient();
}
