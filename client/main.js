// Connection
Meteor.startup(() => {
  const PORT = window.socketPort;
  let socket = require('socket.io-client')(`${PORT}`);

  socket.on('connect', function() {
    console.log('Client connected');
    let $messageForm = $('#messageForm');
    let $message = $('#message');
    let $chat = $('#chat');
    let $userForm = $('#userForm');
    let $userFormArea = $('#userFormArea');
    let $messageArea = $('#messageArea');
    let $users = $('#users');
    let $username = $('#username');

    $messageForm.submit(function(e) {
      e.preventDefault();
      socket.emit('send message', $message.val());
      $message.val('');
    });

    socket.on('new message', function(data) {
      $chat.append(
        ' <div class="well"><strong>' + data.user + ': ' + data.msg + '</div>'
      );
    });

    $userForm.submit(function(e) {
      e.preventDefault();
      socket.emit('new user', $username.val(), function(data) {
        $userFormArea.hide();
        $messageArea.show();
      });
      $username.val('');
    });

    socket.on('get users', function(data) {
      let html = '';
      for (let i = 0; i < data.length; i++) {
        html += '<li class="list-group-item">' + data[i] + '</li>';
      }
      $users.html(html);
    });
  });
  socket.on('disconnect', function() {
    console.log('Client disconnected');
  });
});
