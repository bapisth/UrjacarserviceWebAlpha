(function() {
  'use strict';

  angular
    .module('app.dashBoard')
    .directive('urjaNavbar', urjaNavbar);

  function urjaNavbar() {
    return {
      templateUrl: 'app/dashboard/directives/navbar.html',
      restrict: 'E',
      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: true,
      scope: {
        parties: '='
      }
    };
  }

  NavbarController.$inject = ['firebaseDataService'];

  function NavbarController(firebaseDataService) {
    var vm = this;
    vm.messageCount = 0;
    firebaseDataService.customer.on('value', function(data) {
                     vm.messageCount += 1;
                     /*var author = data.val().author || 'Anonymous';
                     var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
                     containerElement.insertBefore(
                     createPostElement(data.key, data.val().title, data.val().body, author, data.val().uid, data.val().authorPic),
                     containerElement.firstChild);*/
                 });
  }

})();