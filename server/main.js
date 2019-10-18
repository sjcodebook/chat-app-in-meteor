import { Meteor } from 'meteor/meteor';
import http from 'http';
import socket_io from 'socket.io';

const PORT = parseInt(process.env.SOCKET_PORT) || 3003;
const users = [],
  connections = [];

// Client-side config
WebAppInternals.addStaticJs(`
  window.socketPort = ${PORT};
`);

Meteor.startup(() => {
  // Server
  const server = http.createServer();
  const io = socket_io(server);

  // New client
  io.on('connection', function(socket) {
    connections.push(socket);
    console.log('connected: %s sockets connected', connections.length);

    // Disconnect
    socket.on('disconnect', data => {
      connections.splice(connections.indexOf(data), 1);
      console.log('Disconnected: %s sockets connected', connections.length);
    });

    // Send Message
    socket.on('send message', data => {
      io.sockets.emit('new message', { msg: data, user: socket.username });
    });
  });

  // Start server
  try {
    server.listen(PORT);
  } catch (e) {
    console.error(e);
  }
});
