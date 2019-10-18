import { Template } from 'meteor/templating';

Template.main.onCreated(function() {
  let self = this;
  self.autorun(function() {
    self.subscribe('Meteor.users');
    self.subscribe('connections');
    Meteor.subscribe('userConnections', true);
  });
});

Template.main.helpers({
  haveUsers(name) {
    if (!name) {
      return false;
    } else {
      return true;
    }
  },

  fetchConnection() {
    const connections = [],
      connectionArr = userConnections.find({}).fetch();
    connectionArr[0].Connections.forEach(e => {
      let connectedUser = Meteor.users
        .find({ user_id: e.connected_to })
        .fetch();
      connections.push(connectedUser[0]);
    });

    console.log(connections);

    return connections;
  }
});

Template.main.events({
  'click .connectedPerson': function(e) {
    $('.connectedPerson').removeClass('active-user');
    const connectedUser = Meteor.users
      .find({ user_id: e.currentTarget.id })
      .fetch();
    $(`#${connectedUser[0].user_id}`).addClass('active-user');

    $('#mainContainerChat').empty();

    document.getElementById('mainContainerChat').insertAdjacentHTML(
      'afterbegin',
      `<div class="selected-user">
      <span
        >To: <span class="name">${connectedUser[0].name}</span></span
      >
    </div>
    <div class="chat-container">
      <ul class="chat-box chatContainerScroll">
        <li class="chat-left">
          <div class="chat-avatar">
            <img
              src="https://www.bootdey.com/img/Content/avatar/avatar3.png"
              alt="Retail Admin"
            />
            <div class="chat-name">Russell</div>
          </div>
          <div class="chat-text">
            Hello, I'm Russell. <br />How can I help you today?
          </div>
          <div class="chat-hour">
            08:55 <span class="fa fa-check-circle ml-2"></span>
          </div>
        </li>
        <li class="chat-right">
          <div class="chat-hour">
            08:56 <span class="fa fa-check-circle ml-2"></span>
          </div>
          <div class="chat-text">
            Hi, Russell <br />
            I need more information about Developer Plan.
          </div>
          <div class="chat-avatar">
            <img
              src="https://www.bootdey.com/img/Content/avatar/avatar3.png"
              alt="Retail Admin"
            />
            <div class="chat-name">Sam</div>
          </div>
        </li>
      </ul>
      <div
        class="fixed-bottom col-md-6"
        style="margin-left: 475px; display: inline;"
      >
        <textarea
          class="form-control"
          rows="2"
          placeholder="Your Message Here...."
        ></textarea>
        <i
          class="fixed-bottom fa fa-send-o"
          style="display: inline; margin-left: 1150px; font-size: 40px; color: green;"
        ></i>
      </div>
    </div>`
    );
  }
});

// // Connection
// Meteor.startup(() => {
//   // const PORT = window.socketPort || 3003;
//   let socket = require('socket.io-client')(`https://chatmeteor.herokuapp.com/`);

//   socket.on('connect', function() {
//     console.log('Client connected');
//     let $messageForm = $('#messageForm');
//     let $message = $('#message');
//     let $chat = $('#chat');
//     let $userForm = $('#userForm');
//     let $userFormArea = $('#userFormArea');
//     let $messageArea = $('#messageArea');
//     let $users = $('#users');
//     let $username = $('#username');

//     $messageForm.submit(function(e) {
//       e.preventDefault();
//       socket.emit('send message', $message.val());
//       $message.val('');
//     });

//     socket.on('new message', function(data) {
//       $chat.append(
//         ' <div class="well"><strong>' + data.user + ': ' + data.msg + '</div>'
//       );
//     });

//     $userForm.submit(function(e) {
//       e.preventDefault();
//       socket.emit('new user', $username.val(), function(data) {
//         $userFormArea.hide();
//         $messageArea.show();
//       });
//       $username.val('');
//     });

//     socket.on('get users', function(data) {
//       let html = '';
//       for (let i = 0; i < data.length; i++) {
//         html += '<li class="list-group-item">' + data[i] + '</li>';
//       }
//       $users.html(html);
//     });
//   });
//   socket.on('disconnect', function() {
//     console.log('Client disconnected');
//   });
// });
