import { Meteor } from 'meteor/meteor';
// import http from 'http';
import socket_io from 'socket.io';
import { WebApp } from 'meteor/webapp';

// const PORT = parseInt(process.env.SOCKET_PORT) || 3003;
const connections = [];
let userIds = {};
let currUserId = '';

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
        curruser_id: data.curruser_id,
        created_at: data.created_at
      });
    });

    socket.on('saveUserId', function(data) {
      currUserId = data;
    });

    // Disconnect
    socket.on('disconnect', data => {
      connections.splice(connections.indexOf(data), 1);
      console.log('Disconnected: %s sockets connected', connections.length);
    });
  });

  // Start server
  // try {
  //   server.listen(PORT);
  // } catch (e) {
  //   console.error(e);
  // }
});

Meteor.onConnection(function(conn) {
  console.log('Meteor connected');

  userIds[conn.id] = currUserId;
  conn.onClose(function() {
    const currUser = userIds[conn.id];
    delete userIds[conn.id];
    console.log(conn.id + 'user left');
    Meteor.call('changeUserStatus', currUser, 'offline', function(
      error,
      result
    ) {
      if (error) {
        console.log('Error while Updating Online Status');
      } else {
        console.log('Status Updated from Server');
      }
    });
  });
});
