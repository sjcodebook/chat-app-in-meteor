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

// Meteor.publish('userMessages', function(id) {
//   let self = this;
//   let connectionView = [];
//   const currUser = Meteor.users.find({ _id: Meteor.userId() }).fetch();
//   messages
//     .rawCollection()
//     .aggregate([
//       {
//         $match: {
//           send_by: { $eq: currUser[0].user_id },
//           recieved_by: { $eq: id }
//         }
//       },
//       {
//         $addFields: { sent: true }
//       },
//       { $sort: { created_at: -1 } }
//     ])
//     .toArray()
//     .then(function(result) {
//       connectionView = result;
//       console.log(connectionView);
//       connectionView.forEach(e => {
//         self.added('userMessages', uuidv4(), e);
//       });
//       self.ready();
//     });
// });
