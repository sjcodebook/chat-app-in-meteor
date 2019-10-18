import { Template } from 'meteor/templating';

Template.search.onCreated(function() {
  let self = this;
  self.autorun(function() {
    self.subscribe('Meteor.users');
  });
});

Template.search.events({
  'change #searchInput': function() {
    $('#searchResults').empty();
    let input = $('#searchInput').val();
    let userArr = Meteor.users.find({ email: input }).fetch();
    if (userArr.length <= 0) {
      document.getElementById('searchResults').insertAdjacentHTML(
        'afterbegin',
        `
      <div class="my-3 p-3 bg-white rounded shadow-sm">
      <h6 class="border-bottom border-gray pb-2 mb-0">Search Result:</h6>
      <div class="media text-muted pt-3">
        <p class="media-body pb-3 mb-0 small lh-125  border-gray">
          <strong id="searchUsername" class="d-block text-gray-dark"
            >No Result Found</strong
          >
        </p>
      </div>
    </div>
      `
      );
    } else {
      document.getElementById('searchResults').insertAdjacentHTML(
        'afterbegin',
        `
        <div class="my-3 p-3 bg-white rounded shadow-sm">
        <h6 class="border-bottom border-gray pb-2 mb-0">Search Result:</h6>
        <div class="media text-muted pt-3">
          <i class="far fa-user-circle mr-2" style="font-size: 1.5em;"></i>
          <p class="media-body pb-3 mb-0 small lh-125  border-gray">
            <strong id="searchUsername" class="d-block text-gray-dark"
              >${userArr[0].name}</strong
            >
            <a href="/">
              <button
                id="${userArr[0].user_id}"
                class="userAddBtn btn btn-primary btn-sm mt-2"
              >
                Add
              </button></a
            >
          </p>
        </div>
      </div>
      `
      );
    }
  },

  'click .userAddBtn': function(e) {
    const id = e.target.id;
    Meteor.call('addUserConnection', id);
    // window.location = '/';
  }
});
