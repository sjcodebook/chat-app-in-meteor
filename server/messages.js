import { Meteor } from 'meteor/meteor';
import messages from './../collections/messages';
import connections from './../collections/connections';
import uuidv4 from 'uuid/v4';

Meteor.methods({
  addNewMessage: function(id, content, is_read) {
    const currUser = Meteor.users.find({ _id: Meteor.userId() }).fetch();

    messages.insert({
      message_id: uuidv4(),
      send_by: currUser[0].user_id,
      recieved_by: id,
      content: content,
      is_read: is_read,
      created_at: new Date()
    });

    connections.update(
      { user_id: currUser[0].user_id, connected_to: id },
      {
        $set: {
          last_connected: new Date()
        }
      }
    );
  },

  changeMsgReadStatus: function(id) {
    messages.update(
      { message_id: id },
      {
        $set: {
          is_read: true
        }
      }
    );
  }
});
