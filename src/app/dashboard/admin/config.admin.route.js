(function () {
    'use strict';

    angular
        .module('app.dashBoard.admin')
        .config(configFunction);

    configFunction.$inject = ['$routeProvider'];

    function configFunction($routeProvider) {
        $routeProvider
            .when('/userSettings', {
                templateUrl: 'app/dashboard/admin/dashboard.admin.html',
                controller: 'AdminSettingsController',
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

    /*getAllTransactionData.$inject = ['dashboardService'];
    function getAllTransactionData(dashboardService) {
        return dashboardService.getAllTransactions();
    }*/

})();
