# Accenture Smart Textile Visualizer
Created by: [unstable.design](http://unstable.design)
Shanel Wu, Laura Devendorf, Emma Goodwill


## Components
- Fabric
- Padding
- ESP32 (ESP)
- Tablet
- Programming Cable (USB to MicroUSB)
- Power Cable

## Setup/Installation

### 1. Open and follow the [Installation instructions] (Documentation/AFtR-InstallDirections.pdf).

### 2. When you get to step 3, do the following:

#### a. Download the [Arduino IDE] (https://www.arduino.cc/en/software)

#### b. Install the ESP 32 Board via the Board Manager. Instructions at [ESP Core](https://github.com/espressif/arduino-esp32)

#### c. Install the the following libraries:

- [WebSocketsServer](https://github.com/Links2004/arduinoWebSockets)
- [ESPAsyncWebServer](https://github.com/me-no-dev/ESPAsyncWebServer)
- [AsyncTCP](https://github.com/me-no-dev/AsyncTCP)

(Optional) If you need to change the files running on the service, you can update them in the "data" folder but must follow the instructions here:

- [ESP 32 File System Updates](https://randomnerdtutorials.com/esp32-web-server-spiffs-spi-flash-file-system/)


#### d. Download the Arudino code for the fabric
Download [ESPServer_WS_Fabric.ino](Release/ESPServer_WS_Fabric/ESPServer_WS_Fabric.ino) and open it in the Arduino IDE. Change SSID and password at the top of the file to your Wi-Fi network's information. The network must run on 2.4GHz (Wi-Fi 4) to be compatible with the ESP. The network also needs to use WEP or WPA/WPA2 Personal encryption (NOT WPA Enterprise). We recommend assigning a static IP to the ESP. 



### 3. Continue [Installation instructions](Documentation/AFtR-InstallDirections.pdf) at Step 4. 


## Demo
You can find a video demo of the fabric and visualizer on [YouTube](https://youtu.be/pV-8iuQ4Avs);


## User Interface and Data Logs
The user interface client will run on the browser on your local machine. We reccomend using Google Chrome. The UI updates the visualization based on the information it receives from the ESP and writes that information to the browser's Local Storage. You can view the local storage used by opening the Chrome Code Inspector, clicking "Application", and then "Local Storage." This data is used to show the history of interactions with the fabric and will be preserved even if Chrome is closed. An explanation of the user interface features can be found [here](Documentation/ui_explained.pdf).

### Making Changes to the UI
If you would like to make changes to the UI, please do so in the [`ui.js`](Release/ESPServer_WS_Fabric/data/ui.js) file. 

### Making Changes to the Logs
If you would like to make any changes to the way data is logged, you can do so in [`log.js`](Release/ESPServer_WS_Fabric/data/log.js). The log contains some helper functions for clearing and recording the data. Since the local storage can store only 5MB of data (or 650,000 data entries) we have written functions for you to both clear the data (which you should do carefully) or download the data to a local file. Once the log is full, the software will simply delete and overwrite the oldest entry in the log. 

### Updating Arduino to Reflect Changes
To have any changes to these files take effect, you need to install the [ESP33 filesystem uploader](https://github.com/me-no-dev/arduino-esp32fs-plugin) tool. Both the [`ui.js`](Release/ESPServer_WS_Fabric/data/ui.js) and [`log.js`](Release/ESPServer_WS_Fabric/data/log.js) are in the `data` subdirectory of the `ESPServer_WS_Fabric.ino` sketch, which is what the Arduino IDE will flash to the ESP's memory.

#### Helper Functions
Opening the Chrome console and typing the following functions will allow you to clear and download accumulated data.

`downloadLocalStorage()`
downloads a CSV titled with the earliest and latest timestamp for collecting and preserving the data. 

`clearLocalStorage()`
erases all data collected in local storage. This should really only be done on setup, as the visualization gets more interesting as more data accumulates.
