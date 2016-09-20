(function () {
    'use strict';

    angular
        .module('app.dashBoard')
        .controller('DashBoardController', DashBoardController);

    DashBoardController.$inject = ['dashboardService', 'allTransactionData'];

    function DashBoardController(dashboardService, allTransactionData) {
        var vm = this;

        console.log("allTransactionData:"+allTransactionData);
        vm.customers = dashboardService.getAllCustomers();
        vm.transactions = dashboardService.getAllTransactions();
        vm.customerTransactions = dashboardService.getAllTransactions();

        console.log("-------->" + vm.customerTransactions.transactionId);
        //vm.customerTransactions = vm.customers;
        console.log("21313123:" + vm.customers);
    }

})();