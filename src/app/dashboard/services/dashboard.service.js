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

        var service = {
            Customer: Customer,
            TransactionModel: TransactionModel,
            getAllCustomers: getAllCustomers,
            getAllTransactions: getAllTransactions,
            CustomerValueEvent: getValueChangedListener,
            CustomerChildAddedEvent: customerChildAddedEventListener,
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

        /*function getAllTransactions(uid) {
         if (!transactions) {
         transactions = $firebaseArray(firebaseDataService.Transaction);
         transactions.$loaded()
         .then(function(){
         angular.forEach(transactions, function(transaction) {
         console.log("User Id:"+transaction.$id);

         customer = $firebaseObject(firebaseDataService.customer.child(transaction.$id));
         customer.$loaded()
         .then(function (customer) {
         TransactionModel = {};
         TransactionModel["transactionId"] = transaction.$id;
         TransactionModel["customerName"] = customer.name;
         TransactionModel["customerMobile"] = customer.mobile;

         customerTransactions.push(TransactionModel);
         //console.log("--------->"+ customer.name);

         })
         //console.log("=====>"+customer);
         //console.log(transaction);
         //console.log(transaction.$id);
         });
         return customerTransactions;
         });
         }
         //return transactions;
         //console.log("11111-------------111111111:"+customerTransactions);
         return customerTransactions;
         }*/

        function getAllTransactions() {
                return $firebaseArray(firebaseDataService.Transaction).$loaded().then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        var transactionId = childSnapshot.$id;
                        TransactionModel = {};
                        var promise = $firebaseObject(firebaseDataService.customer.child(transactionId)).$loaded().then(function (snap) {
                            // The Promise was fulfilled.
                            TransactionModel["transactionId"] = transactionId;
                            TransactionModel["customerName"] = snap.name;
                            TransactionModel["customerMobile"] = snap.mobile;
                        }, function (error) {
                            // The Promise was rejected.
                            console.error(error);
                        });
                        customerTransactions.push(promise);
                    });
                    return Promise.all(customerTransactions);
                }, function (error) {
                    // The Promise was rejected.
                    console.error(error);
                }).then(function (values) {
                    console.log(values); // [snap, snap, snap]
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
                console.log(data.val());
                /*var author = data.val().author || 'Anonymous';
                 var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
                 containerElement.insertBefore(
                 createPostElement(data.key, data.val().title, data.val().body, author, data.val().uid, data.val().authorPic),
                 containerElement.firstChild);*/
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
