/*
 * Date: April 29
 * Variation: CHAT region test coce
*  this version does not connect to network, it simply runs the code to test the regions directly on the arduino. 
 */

#include <WiFi.h>
#include <WebSocketsServer.h>
#include <ESPAsyncWebServer.h>
#include <SPIFFS.h>
#include <string.h>




const int port = 80;
const int WSport = 81;


AsyncWebServer server(port);
WebSocketsServer webSocket(WSport);

char dataBuffer[30];

//pins for force region 1-6 
//36 is top left
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

  Serial.println("calculating base values");
  calculate_base_values(baseline_window);
  print_base_values();
  Serial.println("end base values");
}

void loop(){
  //webSocket.loop();

  read_values();
  print_raw_values();
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
