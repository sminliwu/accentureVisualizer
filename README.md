# Accenture Visualizer
repo for Unstable Design Lab woven smart textile setup


INGREDIENTS
Fabric
ESP
Tablet



SETUP
ESP - reading fabric sensor data and serving it to the client
Tablet - Pointed to URL at unstable.design




Step: 1
Install Fabric according to [Image] Wiring

Step 2: 
Plug in ESP to Wall Power

Step 3:
Setup Network INFO
WebSocketServer.ino 
Change SSID and password (to the desired network). 
Make sure network filters allow access.... (TO DO)

Make sure the tablet is connected to the same network.

Match the IP in the Processing Sketch to the same IP used in the WebSocketServer.ino


Step 4: 
Go to http://unstable.design/accentureVisualizer/testServer/public/ 


TO DO - 
EMMA -  debug ESP crash, start publishing to socket from ESP

SHANEL - getting code to listen to the socket from P5

LAURA - udpate P5 Interface + Read from log files
      - P5 to write log files
       - template log available in public folder


