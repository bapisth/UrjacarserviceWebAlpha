/**
 * Created by BAPI1 on 9/15/2016.
 */
(function() {
    'use strict';

    angular
        .module('app.dashBoard')
        .directive('urjaReport', urjaReport);

    function urjaReport() {
        return {
            templateUrl: 'app/dashboard/reports/directives/masterreport.form.html',
            restrict: 'E',
            controller: ReportDirectiveController,
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                error: '=',
                buttonTitle: '@',
                vanAddedmessage: '@',
                submitAction: '&',
                vehicles : '='
            }
        };
    }

    ReportDirectiveController.$inject = ['dashboardService'];

    function ReportDirectiveController(dashboardService) {
        var vm = this;
        vm.report = {
            vehicleNumber: '',
            fromDate: '',
            endDate: ''
        };
    }

})();
