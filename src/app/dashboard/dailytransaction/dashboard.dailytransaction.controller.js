(function () {
    'use strict';

    angular
        .module('app.dashboard.dailytransaction')
        .controller('DailyTransactionController', DailyTransactionController);

    DailyTransactionController.$inject = ['dashboardService', 'firebaseDataService', '$firebaseArray', 'NgTableParams', '$firebaseObject'];

    function DailyTransactionController(dashboardService, firebaseDataService, $firebaseArray, NgTableParams, $firebaseObject) {
        var vm = this;
        vm.dailytransactionOpen = [];
        vm.defaultConfigTableParams = null;
        //Put the contnets in the ng-include='dashboardContent'
        vm.dashboardContent = "app/dashboard/dailytransaction/dailytransaction.transactionlist.html";
        firebaseDataService.AdminNotification.on('value', function (item) {
            vm.obj = [];
            vm.dailytransactionOpen = [];
            $firebaseArray(firebaseDataService.AdminNotification).$loaded().then(function (snapshot) {
                var prevTransactionId = "";
                snapshot.forEach(function (data, index) {
                    /*if (prevTransactionId != data.transactionId){*/
                        prevTransactionId = data.transactionId;
                        vm.obj[index] = [];
                        vm.obj[index]["customerId"] = data.customerId;
                        //vm.obj[index]["customerName"] = data.customerName;
                        //vm.obj[index]["customerVehicleNumber"] = data.customerVehicleNumber;
                        vm.obj[index]["isUnread"] = data.isUnread;
                        vm.obj[index]["rootRef"] = data.rootRef;
                        vm.obj[index]["transactionId"] = data.transactionId;
                        vm.obj[index]["transactionRef"] = data.transactionRef;
                        vm.obj[index]["unread"] = data.unread;
                        $firebaseObject(firebaseDataService.customer.child(data.customerId).child("mobile")).$loaded().then(function (mobileData) {
                            vm.obj[index]["mobile"] = mobileData.$value;
                        });

                        $firebaseObject(firebaseDataService.customer.child(data.customerId).child("name")).$loaded().then(function (name) {
                            vm.obj[index]["customerName"] = name.$value;
                        });

                        //Push the data to the dailyTransaction Array
                        vm.dailytransactionOpen.push(vm.obj[index]);
                    /*}*/
                });

                vm.defaultConfigTableParams = new NgTableParams({}, { dataset: vm.dailytransactionOpen});
                vm.defaultConfigTableParams.reload();
            });
        });
    }

})();