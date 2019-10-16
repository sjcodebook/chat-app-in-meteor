import { Meteor } from 'meteor/meteor';

Meteor.publish('Meteor.users', function() {
  return Meteor.users.find({}, { sort: { created_at: -1 } });
});
