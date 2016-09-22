(function() {
  'use strict';

  angular
    .module('app.dashBoard')
    .controller('TransactionDetailController', TransactionDetailController);

  TransactionDetailController.$inject = ['dashboardService', '$location', '$routeParams', 'firebaseDataService', '$firebaseArray'];

  function TransactionDetailController(dashboardService, $location, $routeParams, firebaseDataService, $firebaseArray) {
    var vm = this;
    vm.transactions = [];
    vm.transactionId = $routeParams.transactionId;
    $firebaseArray(firebaseDataService.Transaction.child(vm.transactionId)).$loaded().then(function (snapshot) {
        vm.transactions = [];
       console.log(snapshot.length)
       snapshot.forEach(function (childSnapshot) {
       console.log("kan kala se........."+childSnapshot)
       vm.transactions.push(childSnapshot);
        });
    });
  }

})();