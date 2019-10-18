import { Meteor } from 'meteor/meteor';
import uuidv4 from 'uuid/v4';

Meteor.publish('userConnections', function() {
  const id = Meteor.userId();

  let self = this;
  let connectionView = [];
  Meteor.users
    .rawCollection()
    .aggregate([
      {
        $match: { _id: { $eq: id } }
      },
      {
        $lookup: {
          from: 'connections',
          localField: 'user_id',
          foreignField: 'user_id',
          as: 'Connections'
        }
      }
    ])
    .toArray()
    .then(function(result) {
      connectionView = result;
      connectionView.forEach(e => {
        self.added('userConnections', uuidv4(), e);
      });
      self.ready();
    });
});
