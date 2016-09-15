(function() {
  'use strict';

  angular
    .module('app.dashBoard')
    .controller('DashBoardController', DashBoardController);

  DashBoardController.$inject = ['dashboardService'];

  function DashBoardController(dashboardService) {
    var vm = this;

    vm.customers  = dashboardService.getAllCustomers();
    vm.transactions = dashboardService.getAllTransactions();
  }

})();