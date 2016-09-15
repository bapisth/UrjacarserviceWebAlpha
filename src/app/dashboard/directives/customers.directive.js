/**
 * Created by BAPI1 on 9/15/2016.
 */
(function() {
    'use strict';

    angular
        .module('app.dashBoard')
        .directive('urjaCustomerlist', urjaCustomerlist);

    function urjaCustomerlist() {
        return {
            templateUrl: 'app/dashboard/directives/allCustomers.html',
            restrict: 'E',
            controller: CustomerListController,
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                customers: '='
            }
        };
    }

    /*function urjaCustomerTransactionList() {
        return {
            templateUrl: 'app/dashboard/directives/allTransactions.html',
            restrict: 'E',
            controller: TransactionListController,
            controllerAs: 'vm',
            bindToController: true,
            /!*scope: {
                transactions: '='
            }*!/
            scope: {
                customerTransactions: '='
            }
        };
    }*/

    CustomerListController.$inject = ['dashboardService'];

    function CustomerListController(dashboardService) {
        var vm = this;

        /*vm.newCustomer = new dashboardService.Customer();
        vm.addParty = addParty;

        function addParty() {
            vm.parties.$add(vm.newParty);
            vm.newParty = new partyService.Party();
        }*/
    }

})();
