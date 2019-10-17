import { Template } from 'meteor/templating';

Template.Login.events({
  'submit .login-form': function(event, template) {
    event.preventDefault();
    document.getElementById('signInBtn').innerText = 'Signing In...';
    var $form = $(event.currentTarget);
    var $emailInput = $form.find('.email-address-input').eq(0);
    var $passwordInput = $form.find('.password-input').eq(0);

    var emailAddress = $emailInput.val() || '';
    var password = $passwordInput.val() || '';

    //trim
    emailAddress = emailAddress.replace(/^\s*|\s*$/g, '');
    password = password.replace(/^\s*|\s*$/g, '');

    Meteor.loginWithPassword(emailAddress, password, function(error) {
      document.getElementById('signInBtn').innerText = 'Sign In';
      if (error) {
        sAlert.error('Invalid Email Or Password');
      }
    });
  }
});
