import { Meteor } from 'meteor/meteor';
import connections from './../collections/connections';
import uuidv4 from 'uuid/v4';

Meteor.methods({
  addUserMethod: function(email, userName, pass) {
    let userId = Accounts.createUser({
      email: email,
      password: pass
    });

    Meteor.users.update(
      { _id: userId },
      {
        $set: {
          user_id: uuidv4(),
          name: userName,
          email: email,
          status: new Date(),
          created_at: new Date()
        }
      }
    );
  },

  changeUserStatus: function(id, status) {
    console.log(id, status);

    if (status === 'online') {
      Meteor.users.update(
        { _id: id },
        {
          $set: {
            status: 'online'
          }
        }
      );
    } else {
      Meteor.users.update(
        { _id: id },
        {
          $set: {
            status: new Date()
          }
        }
      );
    }
  },

  addUserConnection: function(id) {
    let user = Meteor.users.find({ _id: Meteor.userId() }).fetch(),
      prevConnection = connections
        .find({
          user_id: user[0].user_id
        })
        .fetch(),
      connectionIds = [];

    prevConnection.forEach(e => {
      connectionIds.push(e.connected_to);
    });

    if (user[0].user_id === id) {
      throw new Meteor.Error(
        500,
        'Error 500: Not unique',
        'the document is not unique'
      );
    } else if (connectionIds.includes(id)) {
      throw new Meteor.Error(
        500,
        'Error 500: Not unique',
        'the document is not unique'
      );
    } else {
      const room_id = uuidv4();
      connections.insert({
        connection_id: uuidv4(),
        user_id: user[0].user_id,
        connected_to: id,
        room_id: room_id,
        last_connected: new Date(),
        created_at: new Date()
      });

      connections.insert({
        connection_id: uuidv4(),
        user_id: id,
        connected_to: user[0].user_id,
        room_id: room_id,
        last_connected: new Date(),
        created_at: new Date()
      });
    }
    return true;
  }
});
