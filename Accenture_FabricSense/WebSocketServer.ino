#include <WiFi.h>
#include <WebSocketsServer.h>

const char* ssid     = "";
const char* password = "";

//dynamic array of ints to hold the ids connected to websocket server
int* id =0;
//size of dynamic array
int numberOfIds = 0;
int n = 0;

//declare a WebSocketsServer on port 81
WebSocketsServer webSocket(81);

//forward declaration of webSocketEvent handler
void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length);

void setup() {
  Serial.begin(115200);
  delay(10);
  Serial.println('\n');

  //connect to local network
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  Serial.println('\n');
  Serial.println("Connection established!");
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
      //iterate through array of connected ids and send dummy data
      for (int i =0; i < numberOfIds; i++) {
        webSocket.sendTXT(id[i],"1023");
      }
  } else {
      //iterate through array of connected ids and send dummy data
      for (int i =0; i < numberOfIds; i++) {
        webSocket.sendTXT(id[i],"300");
      }
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
      //if the array of ids is not empty
      if (id != 0) {
        //create a new dynamically allocated array of the current size -1
        int *newId = new int[numberOfIds-1];
        //put all but the disconnected id in the new array
        for (int i = 0; i < numberOfIds; i++) {
          if(id[i] != num) {
            newId[i] = id[i];
          }
          else {
            if ((i+1) < numberOfIds) {
              newId[i] = id[i+1];
              i++;
            }
          }
        }
        delete [] id;
        id = newId;
        numberOfIds--;
      }
      break;
    //if there has been a connection
    case WStype_CONNECTED: {
      //display the corresponding info
      IPAddress ip = webSocket.remoteIP(num);
      Serial.printf("[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);
      //create a new dynamically allocated array of the current size +1
      int *newId = new int[numberOfIds+1];
      //copy the array of ids over to the new array
      if (id !=0) {
        for (int i = 0; i < numberOfIds; i++) {
          newId[i] = id[i];
        }
        delete []id;
        id = newId;
      }
      //add the new element to the array
      id[numberOfIds] = num;
      numberOfIds++;
    }
    break;
  }
}
