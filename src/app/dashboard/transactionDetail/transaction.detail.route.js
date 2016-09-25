(function () {
    'use strict';

    angular
        .module('app.dashBoard')
        .config(transactionDetailConfigFunction);

    transactionDetailConfigFunction.$inject = ['$routeProvider'];

    function transactionDetailConfigFunction($routeProvider) {
        $routeProvider.when('/transactionDetail/:transactionId', {
            templateUrl: 'app/dashboard/transactionDetail/transactiondetail.html',
            controller: 'TransactionDetailController',
            controllerAs: 'vm',
            resolve: {
                user: resolveUser
                /*vanAndAgents: vanAndAgents*/
            }
        });
    }

    resolveUser.$inject = ['authService'];

    function resolveUser(authService) {
        return authService.firebaseAuthObject.$requireSignIn();
    }

    vanAndAgents.$inject = ['dashboardService'];
    function vanAndAgents(dashboardService) {
        return dashboardService.GetAllVanAndAgents();
    }

})();
