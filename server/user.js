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
          created_at: new Date()
        }
      }
    );
  },

  addUserConnection: function(id) {
    const currUser = Meteor.userId();
    let user_id = Meteor.users.find({ _id: currUser }).fetch();
    user_id = user_id[0].user_id;

    if (user_id === id) {
      throw new Meteor.Error(
        500,
        'Error 500: Not unique',
        'the document is not unique'
      );
    } else {
      connections.insert({
        connection_id: uuidv4(),
        user_id: user_id,
        connected_to: id,
        created_at: new Date()
      });
    }
    return true;
  }
});
