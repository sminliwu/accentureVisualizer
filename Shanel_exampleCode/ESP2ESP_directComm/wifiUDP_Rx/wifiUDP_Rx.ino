//
// wifiUDP_Rx
//
// Jiffer Hariman, mod by Shanel Wu
// Connected Things 2019
//
// UDP transmit and receive example.
//
// Tx sends a counter that increments from 0-16 and starts over
// When digital input GPIO5 (nodeMCU pin labelled D1) it sends a one time string message
//
// Rx prints values to console and blinks light on and off with even/odd numbers receieved
//
// The static IP address of this device needs to be unique (relative to others on the network)
// The remoteIP address list includes other devices that the UDP messages will be sent to.

#include <ESP8266WiFi.h>
#include <WiFiUDP.h>

// WiFi variables
const char* ssid = "[SSID]";        // ssid
const char* password = "PWD]"; // password
boolean wifiConnected = false;
IPAddress ip(192, 168, 0, 117);
IPAddress gateway(192, 168, 0, 1);
IPAddress subnet(255, 255, 255, 0);

// UDP variables
unsigned int localPort = 8000;
WiFiUDP UDP;
boolean udpConnected = false;
char packetBuffer[UDP_TX_PACKET_MAX_SIZE]; //buffer to hold incoming packet,

// built in LED pin (nodeMCU)
#define digitalOut 16
#define analogOut A0 // A0 = analog output (LED)

int analogIn; // analog value received from Tx
boolean digitalIn; // button state received from Tx

// *************************
// init
// *************************
void setup()
{
  Serial.begin(115200);
  Serial.println();

  // connect to wifi
  // Initialize wifi connection
  wifiConnected = connectWifi();

  // only proceed if wifi connection successful
  if (wifiConnected) {
    Serial.println();

    Serial.print("Hooray! Connected to ");
    Serial.println(ssid);
    Serial.print("I'm using IP address: ");
    Serial.println(WiFi.localIP());

    // initialize output pins to control the outputs
    pinMode(digitalOut, OUTPUT);
    pinMode(analogOut, OUTPUT);
  }

  udpConnected = connectUDP();
  if (udpConnected) {
    // congrats
    Serial.println("udp connected");
  }
}

// *************************
// main
// *************************
void loop() {
  // check if the WiFi and UDP connections were successful
  if (wifiConnected) {
    if (udpConnected) {
//      Serial.println("waiting for packet");
      // if there’s data available, read a packet
      int packetSize = UDP.parsePacket();
      if (packetSize)
      {
        Serial.println("");
        Serial.print("Received packet of size ");
        Serial.println(packetSize);
/*        Serial.print("From ");        
        IPAddress remote = UDP.remoteIP();
        for (int i = 0; i < 4; i++)
        {
          Serial.print(remote[i], DEC);
          if (i < 3)
          {
            Serial.print(".");
          }
        }
        Serial.print(", port ");
        Serial.println(UDP.remotePort());
*/
        // read the packet into packetBufffer
        UDP.read(packetBuffer, UDP_TX_PACKET_MAX_SIZE);

        // this code assumes the value coming in is a 16 bit integer
        digitalIn = packetBuffer[0];
        analogIn = packetBuffer[1];
        Serial.print("got message: {");
        Serial.print(digitalIn);
        Serial.print(", ");
        Serial.print(analogIn);
        Serial.println("}");

        // do something with packet info
        digitalWrite(digitalOut, digitalIn);
        analogWrite(analogOut, analogIn);
        delay(10);
      }
    }
  }
}

// *************************
// connect to UDP – returns true if successful or false if not
// *************************
boolean connectUDP() {
  boolean state = false;

  Serial.println("");
  Serial.println("Connecting to UDP");

  if (UDP.begin(localPort) == 1) {
    Serial.println("Connection successful");
    state = true;
  }
  else {
    Serial.println("Connection failed");
  }
  return state;
}

// *************************
// connect to wifi – returns true if successful or false if not
// *************************
boolean connectWifi() {
  boolean state = true;
  int i = 0;
  WiFi.begin(ssid, password);
  WiFi.config(ip, gateway, subnet);
  Serial.println("");
  Serial.println("Connecting to WiFi");

  // Wait for connection
  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    if (i > 10) {
      state = false;
      break;
    }
    i++;
  }
  if (state) {
    Serial.println("");
    Serial.print("Connected to ");
    Serial.println(ssid);
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
  }
  else {
    Serial.println("");
    Serial.println("Connection failed.");
  }
  return state;
}
