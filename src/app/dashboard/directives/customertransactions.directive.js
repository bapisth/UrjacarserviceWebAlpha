/**
 * Created by BAPI1 on 9/15/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.dashBoard')
        .directive('urjaTransaction', urjaCustomerTransactionList);

    function urjaCustomerTransactionList() {
        return {
            templateUrl: 'app/dashboard/directives/allTransactions.html',
            restrict: 'E',
            controller: TransactionListController,
            controllerAs: 'vm',
            bindToController: true,
            /*scope: {
             transactions: '='
             }*/
            scope: {
                customertransactions: '='
            }
        };
    }

    TransactionListController.$inject = ['dashboardService'];

    function TransactionListController(dashboardService) {
        var vm = this;
    }

})();
