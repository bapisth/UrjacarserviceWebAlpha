(function () {
    'use strict';

    angular
        .module('app.dashBoard')
        .factory('dashboardService', dashboardService);

    dashboardService.$inject = ['$firebaseArray', '$firebaseObject', 'firebaseDataService'];

    function dashboardService($firebaseArray, $firebaseObject, firebaseDataService) {

        var customers = null;
        var transactions = null;
        var customer = null;
        var customerTransactions = [];
        var allTransactionDatas = [];
        var customerTransactionsByTransactionId = [];
        var allVanAndAgents = [];
        var allVanAndAgentPromiseList = [];

        var service = {
            Customer: Customer,
            TransactionModel: TransactionModel,
            getAllCustomers: getAllCustomers,
            getAllTransactions: getAllTransactions,
            CustomerValueEvent: getValueChangedListener,
            CustomerChildAddedEvent: customerChildAddedEventListener,
            GetAllVanAndAgents: getAllVanAndAgents,
            reset: reset
        };

        return service;

        ////////////

        function Customer() {
            this.name = '';
            this.mobile = '';
        }

        function TransactionModel() {
            this.transactionId = '';
            this.customerName = '';
        }





        function getAllCustomers(uid) {
            if (!customers) {
                customers = $firebaseArray(firebaseDataService.customer);
            }
            return customers;
        }

        function getAllTransactions() {
                    return $firebaseArray(firebaseDataService.Transaction).$loaded().then(function (snapshot) {
                                        customerTransactions = [];
                                        snapshot.forEach(function (childSnapshot) {
                                            var transactionId = childSnapshot.$id;
                                            var promise = $firebaseObject(firebaseDataService.customer.child(transactionId)).$loaded();
                                            customerTransactions.push(promise);
                                        });
                                        return Promise.all(customerTransactions);
                                    }, function (error) {
                                        // The Promise was rejected.
                                        console.error(error);
                                    }).then(function (values) {
                                    allTransactionDatas = [];
                                         values.forEach(function(value){
                                             TransactionModel = {};
                                             TransactionModel["transactionId"] = value.$id;
                                             TransactionModel["customerName"] = value.name;
                                             TransactionModel["customerMobile"] = value.mobile;

                                             allTransactionDatas.push(TransactionModel);
                                        })
                                        //console.log(allTransactionDatas);
                                        return allTransactionDatas;
                                    });


        }

        function getValueChangedListener() {
            firebaseDataService.customer.on('value', function (snapshot) {
                //updateStarCount(postElement, snapshot.val());
                //console.log(postElement);
                console.log(snapshot.val());
            });
        }

        function customerChildAddedEventListener() {
            firebaseDataService.customer.on('child_added', function (data) {
            });
        }

        function getAllVanAndAgents(){
            return $firebaseArray(firebaseDataService.vanWithAgentService)
            .$loaded().then(function (snapshot) {
                            allVanAndAgentPromiseList = [];
                            return Promise.all(snapshot);
                        }, function (error) {
                            console.error(error);
                        }).then(function (values) {
                             allVanAndAgents = [];
                             values.forEach(function(value){
                                 var vehicle = new function(){
                                             this.vehicleName=value.vanName;
                                             this.vehicleNumber=value.vanNumber;
                                             this.agentName=value.agentName;
                                             this.agentContact=value.agentMobile;
                                         }

                                 allVanAndAgents.push(vehicle);
                            })
                            console.log(allVanAndAgents);
                            return allVanAndAgents;
                        });

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
