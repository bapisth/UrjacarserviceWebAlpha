(function () {
    'use strict';

    angular
        .module('app.dashboard.dailytransaction')
        .config(configFunction);

    configFunction.$inject = ['$routeProvider'];

    function configFunction($routeProvider) {
        $routeProvider
            .when('/dailyTransaction', {
                templateUrl: 'app/dashboard/dailytransaction/dashboard.dailytransaction.html',
                controller: 'DailyTransactionController',
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
