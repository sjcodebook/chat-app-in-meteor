// Connection
Meteor.startup(() => {
  const PORT = window.socketPort || 3003;
  let socket = require('socket.io-client')(`http://localhost:${PORT}`);

  socket.on('connect', function() {
    console.log('Client connected');
  });
  socket.on('disconnect', function() {
    console.log('Client disconnected');
  });

  // Get counter updates from server
  let serverCounter = counter.get();
  socket.on('counter', function(value) {
    console.log(`counter changed on server: ${value}`);
    if (serverCounter !== value) {
      serverCounter = value;
      counter.set(value);
    }
  });
});
