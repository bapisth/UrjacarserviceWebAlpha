(function() {
  'use strict';

  angular
    .module('app.dashBoard')
    .config(transactionDetailConfigFunction);

  transactionDetailConfigFunction.$inject = ['$routeProvider'];

  function transactionDetailConfigFunction($routeProvider) {
    $routeProvider.when('/transactionDetail/:transactionId', {
      templateUrl: 'app/dashboard/transactionDetail/sampleDetail.html',
      controller: 'TransactionDetailController',
      controllerAs: 'vm',
      resolve: {user: resolveUser}
    });
  }

  resolveUser.$inject = ['authService'];

  function resolveUser(authService) {
    return authService.firebaseAuthObject.$requireSignIn();
  }

})();
