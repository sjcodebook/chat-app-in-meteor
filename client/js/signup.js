import { Template } from 'meteor/templating';

Template.signup.onCreated(function() {
  let self = this;
  self.autorun(function() {
    self.subscribe('userConnections');
  });
});

Template.signup.events({
  'submit .signup-form': function(e, template) {
    e.preventDefault();

    let userName = e.target.querySelector('#newinputuser').value,
      email = e.target.querySelector('#newinputEmail').value,
      pass = e.target.querySelector('#newinputPassword').value;

    email = email.trim().toLowerCase();
    userName = userName.trim();

    Meteor.call('addUserMethod', email, userName, pass, (err, result) => {
      if (!err) {
        Meteor.loginWithPassword(email, pass, function(error) {
          if (error) {
            sAlert.error('Invalid Email Or Password');
          }
        });
      }
    });
    window.location = '/chat';
  }
});
