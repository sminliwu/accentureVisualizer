# Author(s): Shanel Wu 
import sys, os, tornado
from PyQt5.QtWidgets import QDialog, QApplication # case sensitive!
from integrated import *
from interactions_dummysensor import *
from tornado_websocket import *

class AppWindow(QDialog):
    def __init__(self): 
        super().__init__()
        self.ui = Ui_Form()
        self.ui.setupUi(self)
        
        self.thread = ListenWebSocket()
        self.thread.start()
        
        self.show()

class ListenWebSocket(QtCore.QThread):
    def __init__(self, parent=None):
        super(ListenWebSocket, self).__init__(parent)
        websocket.enableTrace(True)
        self.ws = PythonWS()
    
    def run(self):
        self.ws.open()
    
    def on_message(self, ws, message):
        self.ws.on_message()
            
    def on_close(self, ws):
        self.ws.on_close()

QTApp = QApplication(sys.argv)
w = Form()
w.show()

<<<<<<< HEAD
tornadoApp = tornado.web.Application([
=======
application = tornado.web.Application([
>>>>>>> 982c288f5341f8ea621722cdaa7228c0a337031b
    (r'/ws', WSHandler),
])

port = 8888
http_server = tornado.httpserver.HTTPServer(tornadoApp)
http_server.listen(port)
myIP = socket.gethostbyname(socket.gethostname())
print('*** Websocket Server Listening on Port %s***' % port)
tornado.ioloop.IOLoop.instance().start()

sys.exit(QTApp.exec_())