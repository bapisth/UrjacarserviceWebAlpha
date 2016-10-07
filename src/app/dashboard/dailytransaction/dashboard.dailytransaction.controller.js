(function () {
    'use strict';

    angular
        .module('app.dashboard.dailytransaction')
        .controller('DailyTransactionController', DailyTransactionController);

    DailyTransactionController.$inject = ['dashboardService'];

    function DailyTransactionController(dashboardService) {
        var vm = this;
        //Put the contnets in the ng-include='dashboardContent'
        vm.dashboardContent = "app/dashboard/dailytransaction/dailytransaction.transactionlist.html";
    }

})();