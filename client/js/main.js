import { Template } from 'meteor/templating';
// const PORT = window.socketPort || 3003;
// const socket = require('socket.io-client')(`http://localhost:${PORT}`);
const socket = require('socket.io-client')(`https://chatmeteor.herokuapp.com/`);

Meteor.startup(() => {
  socket.on('connect', function() {
    console.log('Client connected');
  });
});

socket.on('disconnect', function() {
  console.log('Client disconnected');
});

socket.on('connectToRoom', function(data) {
  const currUser = Meteor.users.find({ _id: Meteor.userId() }).fetch();
  if (currUser[0].user_id === data.msg_id) {
    document.getElementById('chatBox').insertAdjacentHTML(
      'beforeend',
      `<li class="chat-right">
      <div class="chat-hour">
        08:56 <span class="fa fa-check-circle ml-2"></span>
      </div>
      <div class="chat-text">
        ${data.msg}
      </div>
      <div class="chat-avatar">
        <img
          src="https://www.bootdey.com/img/Content/avatar/avatar3.png"
          alt="Retail Admin"
        />
        <div class="chat-name">${data.name}</div>
      </div>
    </li>`
    );
  } else {
    document.getElementById('chatBox').insertAdjacentHTML(
      'beforeend',
      `
        <li class="chat-left">
                <div class="chat-avatar">
                  <img
                    src="https://www.bootdey.com/img/Content/avatar/avatar3.png"
                    alt="Retail Admin"
                  />
                  <div class="chat-name">${data.name}</div>
                </div>
                <div class="chat-text">
                ${data.msg}
                </div>
                <div class="chat-hour">
                  08:55 <span class="fa fa-check-circle ml-2"></span>
                </div>
              </li>
        `
    );
  }
});

Template.main.onCreated(function() {
  let self = this;
  self.autorun(function() {
    self.subscribe('Meteor.users');
    self.subscribe('connections');
    self.subscribe('messages');
    Meteor.subscribe('userConnections');
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
  }
});

Template.main.events({
  'click .connectedPerson': function(e) {
    // Feting old messages
    $('.connectedPerson').removeClass('active-user');
    let msgStr = '';
    const currUser = Meteor.users.find({ _id: Meteor.userId() }).fetch(),
      connectedUser = Meteor.users
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

    allMessages.sort((a, b) => (a.created_at > b.created_at ? 1 : -1));

    $('#mainContainerChatHead').empty();
    $('#chatBox').empty();
    $('#messageContainer').empty();

    allMessages.forEach(e => {
      if (e.send_by === currUser[0].user_id) {
        e['sent'] = true;
      } else {
        e['sent'] = false;
      }
    });

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

    document.getElementById('mainContainerChatHead').insertAdjacentHTML(
      'afterbegin',
      `<div class="selected-user">
      <span>To: <span class="name">${connectedUser[0].name}</span></span>
    </div>
    `
    );

    document.getElementById('chatBox').insertAdjacentHTML('afterbegin', msgStr);

    document.getElementById('messageContainer').insertAdjacentHTML(
      'afterbegin',
      `  <textarea
      class="form-control text-message-area"
      rows="1"
      placeholder="Your Message Here...."
      id=${currUser[0].user_id}
    ></textarea>
    <i
      id=${connectedUser[0].user_id}
      class="fixed-bottom fa fa-send-o sendMsgBtn"
      style="display: inline; margin-left: 1150px; font-size: 40px; color: green;"
    ></i>
    `
    );
    let connected_room_id = connections
      .find({
        user_id: currUser[0].user_id,
        connected_to: connectedUser[0].user_id
      })
      .fetch();
    socket.emit('join', {
      room_id: connected_room_id[0].room_id
    });
    $('.contentContainer').animate(
      {
        scrollTop: document.body.scrollHeight
      },
      500
    );
  },

  'click .sendMsgBtn': function(e) {
    const currUser = Meteor.users
      .find({ user_id: $('.text-message-area').attr('id') })
      .fetch();
    const msgContent = $('.text-message-area').val();
    let connected_room_id = connections
      .find({
        user_id: currUser[0].user_id,
        connected_to: e.currentTarget.id
      })
      .fetch();

    if (msgContent !== '') {
      Meteor.call('addNewMessage', e.currentTarget.id, msgContent);
      socket.emit('send message', {
        msg: msgContent,
        room_id: connected_room_id[0].room_id,
        name: currUser[0].name,
        message_id: currUser[0].user_id
      });
      $('.text-message-area').val('');
    }
  }
});
