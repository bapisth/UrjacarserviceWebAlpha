(function() {
  'use strict';

  angular
    .module('app.dashBoard')
    .config(configFunction);

  configFunction.$inject = ['$routeProvider'];

  function configFunction($routeProvider) {
    $routeProvider.when('/dashboard', {
      templateUrl: 'app/dashboard/dashboard.html',
      controller: 'DashBoardController',
      controllerAs: 'vm',
      resolve: {user: resolveUser}
    });
  }

  resolveUser.$inject = ['authService'];

  function resolveUser(authService) {
    return authService.firebaseAuthObject.$requireSignIn();
  }

})();
