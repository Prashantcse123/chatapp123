#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('chatroom:server');
var http = require('http');
var io = require('socket.io')(http);
io.on('connection', function(socket){
  //console.log('a user connected');
  var address = socket.handshake.address;
  console.log('New connection from ' + address.address + ':' + address.port);
  socket.on('chat message', function(msg){
    
      io.emit('chat message', msg);
    });
  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
//require('../public/socket.io/socket_io').setUpIO(io)

require('dotenv').load();
/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '4000');
console.log(`Server started on PORT NUMBER:${port}`)
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
