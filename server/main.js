import { Meteor } from 'meteor/meteor';
// import http from 'http';
import socket_io from 'socket.io';
import { WebApp } from 'meteor/webapp';

// const PORT = parseInt(process.env.SOCKET_PORT) || 3003;
const connections = [];

// Client-side config
// WebAppInternals.addStaticJs(`
//   window.socketPort = ${PORT};
// `);

Meteor.startup(() => {
  // Server
  // const server = http.createServer();
  // const io = socket_io(server);
  const io = socket_io(WebApp.httpServer);

  // New client
  io.on('connection', function(socket) {
    socket.room = socket.id;
    connections.push(socket);

    console.log('connected: %s sockets connected', connections.length);

    // We are using room of socket io
    socket.on('join', function(data) {
      socket.leave(socket.room);
      socket.join(data.room_id);
      socket.room = data.room_id;
    });

    // Send Message
    socket.on('send message', data => {
      io.sockets.in(socket.room).emit('connectToRoom', {
        msg: data.msg,
        name: data.name,
        msg_id: data.message_id
      });
    });

    // Disconnect
    socket.on('disconnect', data => {
      connections.splice(connections.indexOf(data), 1);
      console.log('Disconnected: %s sockets connected', connections.length);
    });
  });

  // Start server
  try {
    server.listen(PORT);
  } catch (e) {
    console.error(e);
  }
});
