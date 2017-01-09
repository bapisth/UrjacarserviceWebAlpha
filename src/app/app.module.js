(function () {
    'use strict';

    angular
        .module('app', [
            // Angular modules.
            'ngRoute',

            // Third party modules.
            'firebase',
            'datatables',
            'ui.bootstrap',
            'ngTable',
            //'ngAudio',
            'angular-underscore',

            // Custom modules.
            'app.auth',
            'app.core',
            'app.landing',
            'app.layout',
            'app.waitList',
            'app.dashBoard',
            'app.dashBoard.admin',
            'app.dashboard.dailytransaction',
            'app.masterReport'
        ])
        .config(configFunction)
        .run(runFunction);

    configFunction.$inject = ['$routeProvider'];

    function configFunction($routeProvider) {
        $routeProvider.otherwise({
            redirectTo: '/'
        });
    }

    runFunction.$inject = ['$rootScope', '$location'];

    function runFunction($rootScope, $location) {
        $rootScope.$on('$routeChangeError', function (event, next, previous, error) {
            if (error === "AUTH_REQUIRED") {
                $location.path('/');
            }
        });
    }

})();
