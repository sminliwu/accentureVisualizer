# Accenture Smart Textile Visualizer

## Components
- Fabric
- ESP32 (ESP)
- Tablet

## Setup/Installation

### 1. Install fabric according to [wiring diagram](Documentation/wiring_diagram.pdf).

### 2. Set up ESP with the local Wi-Fi network

Open [ESPServer_WS_Fabric.ino](Release/ESPServer_WS_Fabric/ESPServer_WS_Fabric.ino) file in the Arduino IDE. Change SSID and password at the top of the file to your Wi-Fi network's information. Reprogram the ESP board with the edited code. This will require installing [ESP Library](https://github.com/espressif/arduino-esp32) via the Arduino Boards Manager  After the program has finished uploading, open up the serial monitor and press the RST button on the ESP to reboot. After a couple of seconds, if the connection is successful, the ESP should print its IP address into the serial monitor.

The network must run on 2.4GHz (Wi-Fi 4) to be compatible with the ESP. The network also needs to use WEP or WPA/WPA2 Personal encryption (NOT WPA Enterprise). We recommend assigning a static IP to the ESP. 

### 3. Connect ESP to wall power.

### 4. Connect tablet to ESP.

Connect the tablet to the same Wi-Fi network that the ESP is on. Open a browser window and go to the IP address of the ESP (the one that was printed when you booted up the ESP).

## User Interface and Data Logs
 The user interface client will run on the browser on your local machine. We reccomend using Google Chrome. The UI updates the visualizaiton based on the information it receives for the ESP and writes that information to the browsers Local Storage. You can view the local storage used by opening the Chrome Code Inspector, clicking "Application", and then "Local Storage." This data is used to show the history of interactions with the fabric and will be preserved even if chrome is closed. An explaination of the user interface features can be found [here](Documentation/ui_explained.pdf).
 
 # Making Changes to the UI
 If you would like to make changes to the UI, please do so in the [ui.js](Release/ESPServer_WS_Fabric/http/ui.js) file. 

# Making Changes to the Logs
If you would like to make any changes to the way data is logged, you can do so in [log.js] (Release/ESPServer_WS_Fabric/http/log.js). The log contains some helper functions for clearing and recording the data. Since the lcoal storage can store only 5MB of data (or 650,000 data entries) we have writen functions for you to both clear the data (which you should do carefully) or download the data to a local file. Once the log is full, the software will simply delete and overwrite the oldest entry in the log.


