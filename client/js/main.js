import { Template } from 'meteor/templating';

Template.main.onCreated(function() {
  let self = this;
  self.autorun(function() {
    self.subscribe('Meteor.users');
    self.subscribe('connections');
    self.subscribe('messages');
    Meteor.subscribe('userConnections');
    Meteor.subscribe('userMessages');
  });
});

Template.main.helpers({
  fetchConnection() {
    const connections = [],
      connectionArr = userConnections.find({}).fetch();
    connectionArr[0].Connections.forEach(e => {
      let connectedUser = Meteor.users
        .find({ user_id: e.connected_to })
        .fetch();
      connections.push(connectedUser[0]);
    });

    return connections;
  },

  fetchMessages() {}
});

Template.main.events({
  'click .connectedPerson': function(e) {
    $('.connectedPerson').removeClass('active-user');
    const currUser = Meteor.users.find({ _id: Meteor.userId() }).fetch();
    const connectedUser = Meteor.users
      .find({ user_id: e.currentTarget.id })
      .fetch();
    $(`#${connectedUser[0].user_id}`).addClass('active-user');

    const sentArr = messages
        .find({
          send_by: currUser[0].user_id,
          recieved_by: connectedUser[0].user_id
        })
        .fetch(),
      recievedArr = messages
        .find({
          send_by: connectedUser[0].user_id,
          recieved_by: currUser[0].user_id
        })
        .fetch(),
      allMessages = sentArr.concat(recievedArr);

    allMessages.forEach(e => {
      if (e.send_by === currUser[0].user_id) {
        e['sent'] = true;
      } else {
        e['sent'] = false;
      }
    });
    let msgStr = '';

    allMessages.forEach(e => {
      if (e.sent) {
        msgStr =
          msgStr +
          `<li class="chat-right">
        <div class="chat-hour">
          08:56 <span class="fa fa-check-circle ml-2"></span>
        </div>
        <div class="chat-text">
          ${e.content}
        </div>
        <div class="chat-avatar">
          <img
            src="https://www.bootdey.com/img/Content/avatar/avatar3.png"
            alt="Retail Admin"
          />
          <div class="chat-name">${currUser[0].name}</div>
        </div>
      </li>`;
      } else {
        msgStr =
          msgStr +
          `<li class="chat-left">
        <div class="chat-avatar">
          <img
            src="https://www.bootdey.com/img/Content/avatar/avatar3.png"
            alt="Retail Admin"
          />
          <div class="chat-name">${connectedUser[0].name}</div>
        </div>
        <div class="chat-text">
          ${e.content}
        </div>
        <div class="chat-hour">
          08:55 <span class="fa fa-check-circle ml-2"></span>
        </div>
      </li>`;
      }
    });

    $('#mainContainerChatHead').empty();

    document.getElementById('mainContainerChatHead').insertAdjacentHTML(
      'afterbegin',
      `<div class="selected-user">
      <span>To: <span class="name">${connectedUser[0].name}</span></span>
    </div>
    `
    );

    $('#chatBox').empty();

    document.getElementById('chatBox').insertAdjacentHTML('afterbegin', msgStr);

    $('#messageContainer').empty();

    document.getElementById('messageContainer').insertAdjacentHTML(
      'afterbegin',
      `  <textarea
      class="form-control text-message-area"
      rows="1"
      placeholder="Your Message Here...."
      id=${connectedUser[0].user_id}message
    ></textarea>
    <i
      id=${connectedUser[0].user_id}
      class="fixed-bottom fa fa-send-o sendMsgBtn"
      style="display: inline; margin-left: 1150px; font-size: 40px; color: green;"
    ></i>
    `
    );
  },

  'click .sendMsgBtn': function(e) {
    const msgContent = $(`#${e.currentTarget.id}message`).val();

    if (msgContent !== '') {
      Meteor.call('addNewMessage', e.currentTarget.id, msgContent);
      $(`#${e.currentTarget.id}message`).val('');
    }
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
