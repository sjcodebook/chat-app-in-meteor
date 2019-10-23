FlowRouter.route('/', {
  name: 'login',
  action() {
    BlazeLayout.render('Login');
  }
});

FlowRouter.route('/chat', {
  name: 'main',
  action() {
    BlazeLayout.render('main');
  }
});

FlowRouter.route('/signup', {
  name: 'signup',
  action() {
    BlazeLayout.render('signup');
  }
});

FlowRouter.route('/search', {
  name: 'search',
  action() {
    BlazeLayout.render('search');
  }
});
