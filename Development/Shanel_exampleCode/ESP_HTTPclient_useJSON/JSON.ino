#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

// WiFi Parameters
const char* ssid = "[SSID]";
const char* password = "[PWD]";

// user input stuff (hacked with Serial)
char inputChar[1];
bool receivedData = false;

HTTPClient http;  // Object of class HTTPClient
const char* server = "http://jsonplaceholder.typicode.com/users/";
String URL; // stores target URL for API

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting...");
  }
}

void loop() {
  // Check WiFi Status
  if (WiFi.status() == WL_CONNECTED) {
    if (!receivedData) {
      // receive user input for request
      Serial.println("Ready!");
      Serial.println("Enter User ID: (1-9)");    
      while (Serial.available() == 0) {} // wait for input

      size_t inBuffer;
      inBuffer = Serial.readBytes(inputChar, 1);
      if (inBuffer) {receivedData = true;}
      return;
    }
    if (receivedData) { // only make request if user input received
      URL = server;
      URL.concat(inputChar[0]); // append user ID # to the API server URL
      http.begin(URL);
      int httpCode = http.GET();
      //Check the returning code
      if (httpCode > 0) {
        // Get the request response payload
        String payload = http.getString();
        //      Serial.println(payload);

        // Parsing
        const size_t capacity = JSON_OBJECT_SIZE(2) + JSON_OBJECT_SIZE(3) + JSON_OBJECT_SIZE(5) + JSON_OBJECT_SIZE(8) + 370;
        char* json = new char[capacity];
        payload.toCharArray(json, (size_t)capacity);
        //      Serial.println(json);
        DynamicJsonDocument doc(capacity);
        deserializeJson(doc, json);

        int id = doc["id"]; // 2
        const char* name = doc["name"]; // "Ervin Howell"
        const char* username = doc["username"]; // "Antonette"
        const char* email = doc["email"]; // "Shanna@melissa.tv"

        JsonObject address = doc["address"];
        const char* address_street = address["street"]; // "Victor Plains"
        const char* address_suite = address["suite"]; // "Suite 879"
        const char* address_city = address["city"]; // "Wisokyburgh"
        const char* address_zipcode = address["zipcode"]; // "90566-7771"

        const char* address_geo_lat = address["geo"]["lat"]; // "-43.9509"
        const char* address_geo_lng = address["geo"]["lng"]; // "-34.4618"

        const char* phone = doc["phone"]; // "010-692-6593 x09125"
        const char* website = doc["website"]; // "anastasia.net"

        JsonObject company = doc["company"];
        const char* company_name = company["name"]; // "Deckow-Crist"
        const char* company_catchPhrase = company["catchPhrase"]; // "Proactive didactic contingency"
        const char* company_bs = company["bs"]; // "synergize scalable supply-chains"

        // Do something with the parsed data
        Serial.println("Retrieved angle ");
        Serial.print("User ID: ");
        Serial.println(id);
        Serial.print(address_geo_lat);
        Serial.print(" degrees, ");

        float lat = atof(address_geo_lat); // assumes that address_geo_lat is a string representation of floating point num
        if (lat < 0 && lat > -90) {
          Serial.println("South");
        } else if (lat == 0) {
          Serial.println("Equator");
        } else if (lat > 0 && lat <= 90) {
          Serial.println("North");
        } else {
          Serial.println("not an angle between -90 and 90");
        }
      }
      http.end();   //Close connection
      // Delay
      delay(5000); // 30s

      // clear serial buffer and flags for next request
      receivedData = false;
      while (Serial.available() > 0) {
        Serial.read(); 
      }
    }
  }
}
