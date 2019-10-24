import { Meteor } from 'meteor/meteor';

Meteor.publish('Meteor.users', function() {
  return Meteor.users.find({}, { sort: { created_at: -1 } });
});

Meteor.publish('connections', function() {
  return connections.find({}, { sort: { created_at: -1 } });
});

Meteor.publish('messages', function() {
  return messages.find({}, { sort: { created_at: -1 } });
});

Meteor.publish('currActiveUser', function() {
  return currActiveUser.find({});
});
