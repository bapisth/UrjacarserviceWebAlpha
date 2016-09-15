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

  NavbarController.$inject = ['partyService'];

  function NavbarController(partyService) {
    var vm = this;

    vm.newParty = new partyService.Party();
    vm.addParty = addParty;

    function addParty() {
      vm.parties.$add(vm.newParty);
      vm.newParty = new partyService.Party();
    }
  }

})();