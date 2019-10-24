import { Template } from 'meteor/templating';
import moment from 'moment';
const PORT = window.socketPort || 3003;
const socket = require('socket.io-client')(`http://localhost:${PORT}`);
// const socket = require('socket.io-client')(`https://chatmeteor.herokuapp.com/`);

Meteor.startup(() => {
  socket.on('connect', function() {
    Meteor.call('changeUserStatus', Meteor.userId(), 'online');
    socket.emit('saveUserId', Meteor.userId());
    console.log('Client connected');
  });
});

socket.on('disconnect', function() {
  console.log('Client Disconnected');
});

socket.on('connectToRoom', function(data) {
  const currUser = Meteor.users.find({ _id: Meteor.userId() }).fetch();
  if (currUser[0].user_id === data.curruser_id) {
    document.getElementById('chatBox').insertAdjacentHTML(
      'beforeend',
      `<div
      class="align-self-end self p-2 my-1 mx-3 rounded bg-white shadow-sm message-item"
      >
      <div class="options">
        <a href="#"><i class="fas fa-angle-down text-muted"></i></a>
      </div>
      <span style='font-weight: 600;'>
     You:
      </span>
      <div class="d-flex flex-row">
        <div class="body mr-2"> ${data.msg}</div>
        <div
          class="time ml-auto small text-right flex-shrink-0 align-self-end text-muted"
          style="width:75px;"
        >
          ${data.created_at} 
        </div>
      </div>
      </div>`
    );
  } else {
    document.getElementById('chatBox').insertAdjacentHTML(
      'beforeend',
      `<div
      class="align-self-start p-2 my-1 mx-3 rounded bg-white shadow-sm message-item"
      >
      <div class="options">
        <a href="#"><i class="fas fa-angle-down text-muted"></i></a>
      </div>
      <span style='font-weight: 600;'>
      ${data.name}:
      </span>
      <div class="d-flex flex-row">
        <div class="body mr-2"> ${data.msg}</div>
        <div
          class="time ml-auto small text-right flex-shrink-0 align-self-end text-muted"
          style="width:75px;"
        >
          ${data.created_at} 
        </div>
      </div>
      </div>
        `
    );
  }
  $('#mainDiv').animate({ scrollTop: 9999 }, 800);
});

$(document).keypress(function(event) {
  var keycode = event.keyCode ? event.keyCode : event.which;
  if (keycode == '13') {
    $('.sendMsgBtn').click();
  }
});

Template.main.onCreated(function() {
  let self = this;
  self.autorun(function() {
    self.subscribe('Meteor.users');
    self.subscribe('connections');
    self.subscribe('messages');
    self.subscribe('currActiveUser');
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
  },

  fetchLastConnection(id) {
    const currUser = Meteor.users.find({ _id: Meteor.userId() }).fetch();
    const co = connections
      .find({ user_id: currUser[0].user_id, connected_to: id })
      .fetch();
    co.forEach(e => {
      e.last_connected = moment(e.last_connected).format('ll');
    });
    return co;
  },

  fetchLastmessage(id) {
    const lastmsg = [];
    const currUser = Meteor.users.find({ _id: Meteor.userId() }).fetch();
    const sentArr = messages
        .find({
          send_by: currUser[0].user_id,
          recieved_by: id
        })
        .fetch(),
      recievedArr = messages
        .find({
          send_by: id,
          recieved_by: currUser[0].user_id
        })
        .fetch(),
      allMessages = sentArr.concat(recievedArr);

    allMessages.sort((a, b) => (a.created_at > b.created_at ? 1 : -1));
    lastmsg.push(allMessages[allMessages.length - 1]);

    return lastmsg;
  },

  sentByUser(msg_id) {
    const currUser = Meteor.users.find({ _id: Meteor.userId() }).fetch();
    const msg = messages
      .find({
        message_id: msg_id
      })
      .fetch();
    if (currUser[0].user_id === msg[0].send_by) {
      return true;
    } else {
      return false;
    }
  },

  isOnline(id) {
    const user = Meteor.users.find({ user_id: id }).fetch();
    if (user[0].status === 'online') {
      return true;
    } else {
      return false;
    }
  },

  readStatus(is_read) {
    if (is_read) {
      return false;
    } else {
      return true;
    }
  },

  activeUserStatus() {
    let status = [],
      currUser = Meteor.users.find({ _id: Meteor.userId() }).fetch(),
      user = currActiveUser.find({ user_id: currUser[0].user_id }).fetch(),
      connectedUser = Meteor.users
        .find({ user_id: user[0].connected_to })
        .fetch();

    if (connectedUser[0].status === 'online') {
      status = [];
      const obj = {};
      obj['status'] = 'online';
      status.push(obj);
    } else {
      status = [];
      const obj = {};
      obj['status'] = `Last Seen ${moment(
        connectedUser[0].status,
        ''
      ).fromNow()}`;
      status.push(obj);
    }

    return status;
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

    const unreadMsgArr = messages
      .find({
        send_by: connectedUser[0].user_id,
        recieved_by: currUser[0].user_id,
        is_read: false
      })
      .fetch();

    unreadMsgArr.forEach(e => {
      Meteor.call('changeMsgReadStatus', e.message_id);
    });

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

    $('#startingBlankCover').empty();
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
          `
          <div
          class="align-self-end self p-2 my-1 mx-3 rounded bg-white shadow-sm message-item"
        >
          <div class="options">
            <a href="#"><i class="fas fa-angle-down text-muted"></i></a>
          </div>
          <span style='font-weight: 600;'>
          You:
          </span>
          <div class="d-flex flex-row">
            <div class="body mr-2">${e.content}</div>
            <div
              class="time ml-auto small text-right flex-shrink-0 align-self-end text-muted"
              style="width:75px;"
            >
            ${moment(e.created_at).format('LT')}
            </div>
          </div>
        </div>
          `;
      } else {
        msgStr =
          msgStr +
          `<div
          class="align-self-start p-2 my-1 mx-3 rounded bg-white shadow-sm message-item"
        >
          <div class="options">
            <a href="#"><i class="fas fa-angle-down text-muted"></i></a>
          </div>
          <span style='font-weight: 600;'>
          ${connectedUser[0].name}:
          </span>
          <div class="d-flex flex-row">
            <div class="body mr-2">${e.content}</div>
            <div
              class="time ml-auto small text-right flex-shrink-0 align-self-end text-muted"
              style="width:75px;"
            >
            ${moment(e.created_at).format('LT')} 
            </div>
          </div>
        </div>`;
      }
    });

    document.getElementById('activeUserName').innerText = connectedUser[0].name;

    Meteor.call(
      'changeCurrentActiveUser',
      currUser[0].user_id,
      connectedUser[0].user_id
    );

    document.getElementById('chatBox').insertAdjacentHTML('afterbegin', msgStr);

    document.getElementById('messageContainer').insertAdjacentHTML(
      'afterbegin',
      `  <a href="#"
            ><i
              class="far fa-smile text-muted px-3"
              style="font-size:1.8rem;"
            ></i
          ></a>
          <input
            type="text"
            name="message"
            id="${currUser[0].user_id}"
            placeholder="Type a message"
            class="flex-grow-1 border-0 px-3 py-2 my-3 rounded shadow-sm text-message-area input"
            autocomplete="off"
          />
          <i
            id="${connectedUser[0].user_id}"
            class="fas fa-paper-plane text-muted px-3 sendMsgBtn"
            style="cursor:pointer; font-size:1.5rem;"</i>
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

    $('#mainDiv').animate({ scrollTop: 9999 }, 800);
  },

  'click .sendMsgBtn': function(e) {
    const currUser = Meteor.users
        .find({ user_id: $('.text-message-area').attr('id') })
        .fetch(),
      connectedUser = Meteor.users
        .find({ user_id: e.currentTarget.id })
        .fetch();
    const msgContent = $('.text-message-area').val();
    let connected_room_id = connections
      .find({
        user_id: currUser[0].user_id,
        connected_to: e.currentTarget.id
      })
      .fetch();

    if (msgContent !== '') {
      let is_read = false;
      const currUserConnection = currActiveUser
        .find({ user_id: e.currentTarget.id })
        .fetch();
      if (
        currUserConnection[0].connected_to === currUser[0].user_id &&
        connectedUser[0].status === 'online'
      ) {
        is_read = true;
      }
      Meteor.call('addNewMessage', e.currentTarget.id, msgContent, is_read);
      socket.emit('send message', {
        msg: msgContent,
        room_id: connected_room_id[0].room_id,
        name: currUser[0].name,
        curruser_id: currUser[0].user_id,
        created_at: moment(new Date()).format('LT')
      });

      $('.text-message-area').val('');
      $('#mainDiv').animate({ scrollTop: 9999 }, 800);
    }
  }
});
