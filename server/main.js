import { Meteor } from 'meteor/meteor';
import http from 'http';
import socket_io from 'socket.io';

const PORT = parseInt(process.env.SOCKET_PORT) || 3003;

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
    console.log('new socket client');
  });

  // Start server
  try {
    server.listen(PORT);
  } catch (e) {
    console.error(e);
  }
});
