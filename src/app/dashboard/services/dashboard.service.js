(function() {
    'use strict';

    angular
        .module('app.dashBoard')
        .factory('dashboardService', dashboardService);

    dashboardService.$inject = ['$firebaseArray', 'firebaseDataService'];

    function dashboardService($firebaseArray, firebaseDataService) {

        var customers = null;
        var transactions = null;

        var service = {
            Customer: Customer,
            TransactionModel: TransactionModel,
            getAllCustomers: getAllCustomers,
            getAllTransactions: getAllTransactions,
            reset: reset
        };

        return service;

        ////////////

        function Customer() {
            this.name = '';
            this.mobile = '';
        }

        function TransactionModel() {
            this.code = '';
            this.desc = '';
            this.groupname = '';
            this.id = '';
        }

        function getAllCustomers(uid) {
            if (!customers) {
                customers = $firebaseArray(firebaseDataService.customer);
            }
            return customers;
        }

        function getAllTransactions(uid) {
            if (!transactions) {
                transactions = $firebaseArray(firebaseDataService.Transaction);
            }
            return transactions;
        }



        function reset() {
            if (customers) {
                customers.$destroy();
                customers = null;
            }

            if (transactions) {
                transactions.$destroy();
                transactions = null;
            }


        }

    }

})();
