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
            replace: true,
            transclude: true,
            scope: {
                parties: '='
            }
        };
    }

    SidebarController.$inject = ['partyService', '$location'];

    function SidebarController(partyService, $location) {
        var vm = this;

        vm.newParty = new partyService.Party();
        vm.addParty = addParty;
        vm.getClass = getClass;

        function addParty() {
            vm.parties.$add(vm.newParty);
            vm.newParty = new partyService.Party();
        }
        
        function getClass(path) {
            return ($location.path().substr(0, path.length) === path) ? 'active' : '';
        }
    }

})();