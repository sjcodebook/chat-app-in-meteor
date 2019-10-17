import { Meteor } from 'meteor/meteor';
import connections from './../collections/connections';

Meteor.publish('Meteor.users', function() {
  return Meteor.users.find({}, { sort: { created_at: -1 } });
});

Meteor.publish('connections', function() {
  return connections.find({}, { sort: { created_at: -1 } });
});
