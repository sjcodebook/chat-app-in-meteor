import { Template } from 'meteor/templating';

Template.signup.events({
  'submit .signup-form': function(e, template) {
    e.preventDefault();

    let userName = e.target.querySelector('#newinputuser').value,
      email = e.target.querySelector('#newinputEmail').value,
      pass = e.target.querySelector('#newinputPassword').value;

    email = email.trim().toLowerCase();
    userName = userName.trim();

    Meteor.call('addUserMethod', email, userName, pass);
    window.location = '/';
  }
});
