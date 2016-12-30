(function () {
  'use strict';

  angular
      .module('app.masterReport')
      .config(configFunction);

  configFunction.$inject = ['$routeProvider'];

  function configFunction($routeProvider) {
    $routeProvider
        .when('/masterReport', {
          templateUrl: 'app/dashboard/dashboard.html',
          controller: 'ReportController',
          controllerAs: 'vm',
            resolve: {
                user: resolveUser
            }
        });
  }
    resolveUser.$inject = ['authService'];

    function resolveUser(authService) {
        return authService.firebaseAuthObject.$requireSignIn();
    }

})();
