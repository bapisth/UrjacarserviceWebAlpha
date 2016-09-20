(function() {
  'use strict';

  angular
    .module('app.dashBoard')
    .controller('TransactionDetailController', TransactionDetailController);

  TransactionDetailController.$inject = ['dashboardService', '$location', '$routeParams'];

  function TransactionDetailController(dashboardService, $location, $routeParams ) {
    var vm = this;

    vm.param = $routeParams.transactionId;
  }

})();