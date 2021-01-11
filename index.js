const webSocketsServerPort = 8000;
const webSocketServer = require('webSocket').server;
const http = require('http');

// spinning http server and websocket server
const server = http.createServer();
server.listen(webSocketsServerPort);
console.log('listening on port 8000');

const wsServer = new webSocketServer({
  httpServer: server
});

const clients = {};

//generate unique user id for every user
const getUniqueID = () => {
  const s4 = () => Math.floor(1 + Math.random()).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
}

wsServer.on('request', function(request){
  var userID = getUniqueID();
  console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');

  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients));

  connection.on('message', function(message) {
    if (message.type === 'utf8'){
      console.log('Recieved Message: ', message.utf8Data);

      for (key in clients){
        clients[key].sendUTF(message.utf8Data);
        console.log('send Message to: ', clients[key]);
      }
    }
  })
});
