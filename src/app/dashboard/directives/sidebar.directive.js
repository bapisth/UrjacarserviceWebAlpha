(function () {
    'use strict';

    angular
        .module('app.dashBoard')
        .directive('urjaSidebar', urjaSidebar);

    function urjaSidebar() {
        return {
            templateUrl: 'app/dashboard/directives/sidebar.html',
            restrict: 'E',
            controller: SidebarController,
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                parties: '='
            }
        };
    }

    SidebarController.$inject = ['partyService'];

    function SidebarController(partyService) {
        var vm = this;

        vm.newParty = new partyService.Party();
        vm.addParty = addParty;

        function addParty() {
            vm.parties.$add(vm.newParty);
            vm.newParty = new partyService.Party();
        }
    }

})();