(function () {
    'use strict';

    angular
        .module('app.dashBoard')
        .controller('DashBoardController', DashBoardController);

    DashBoardController.$inject = ['dashboardService', 'allTransactionData', 'DTOptionsBuilder', 'DTColumnBuilder', '$q'];

    function DashBoardController(dashboardService, allTransactionData, DTOptionsBuilder, DTColumnBuilder, $q) {
        var vm = this;
        //Put the contnets in the ng-include='dashboardContent'
        vm.dashboardContent="app/dashboard/transactionlist.html"

        var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';
        //console.log("allTransactionData:"+allTransactionData);
        //vm.customers = dashboardService.getAllCustomers();
        //vm.transactions = dashboardService.getAllTransactions();
        //vm.customerTransactions = dashboardService.getAllTransactions();

        vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
            var defer = $q.defer();
            console.log(allTransactionData)
            defer.resolve(allTransactionData);
                return defer.promise;
            }).withPaginationType('full_numbers');
            vm.dtColumns = [

                DTColumnBuilder.newColumn('transactionId')
                .withTitle('Transaction ID')
                .renderWith(function(data, type, full, meta) {
                    return '<a href="#/transactionDetail/'+data+'">'+data+'</a>';
                }),
                DTColumnBuilder.newColumn('customerName').withTitle('Customer Name'),
                DTColumnBuilder.newColumn('customerMobile').withTitle('Customer Mobile')//.notVisible()
            ];


        //vm.customerTransactions = vm.customers;
        console.log("21313123:" + vm.customers);
    }

})();