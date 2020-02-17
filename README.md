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
