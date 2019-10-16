import { Meteor } from 'meteor/meteor';
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
  }
});
