#include <WiFi.h>
#include <WebSocketsServer.h>

const char* ssid = "";
const char* password =  "";

int savedNum;
int n =0;

//declare a WebSocketsServer on port 81
WebSocketsServer webSocket(81);

//forward declaration of webSocketEvent handler
void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length);

void setup() {
  
  Serial.begin(115200);
  WiFi.begin(ssid, password);
 
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }
 
  Serial.println("Connected to the WiFi network");
  Serial.print("IP address:\t");
  Serial.println(WiFi.localIP());

  //start websocket server
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
  Serial.println("Web socket server started.");
}

void loop() {
      webSocket.loop();
  // n % 11 in the conditional is used to send dummy values until they can be sent via serial
  if ((n % 11) < 6) {
      //send dummy data
      webSocket.sendTXT(savedNum,"1023");
  } else {
      //send dummy data
      webSocket.sendTXT(savedNum,"300");
  }
  n++;
}

//handles webSocketEvents
void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    //if there has been a disconnection
    case WStype_DISCONNECTED:
      //display the id
      Serial.printf("[%u] disconnected from websocket server.", num);
      savedNum = 0;
      break;
    //if there has been a connection
    case WStype_CONNECTED: {
      //display the corresponding info
      IPAddress ip = webSocket.remoteIP(num);
      Serial.printf("[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);
      savedNum = num;
    }
    break;
  }
}
