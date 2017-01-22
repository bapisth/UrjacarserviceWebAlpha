/**
 * Created by BAPI1 on 9/15/2016.
 */
(function() {
    'use strict';

    angular
        .module('app.dashBoard')
        .directive('urjaAddvehicle', urjaAddvehicle);

    function urjaAddvehicle() {
        return {
            templateUrl: 'app/dashboard/addvehicle/directives/addvehicle.form.html',
            restrict: 'E',
            controller: AddVehicleDirectiveController,
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

    AddVehicleDirectiveController.$inject = ['dashboardService'];

    function AddVehicleDirectiveController(dashboardService) {
        var vm = this;

        vm.vehicle = {
            vehicleName: '',
            vehicleNumber: '',
            agentName: '',
            agentContact: '',
            agentAddress:''
        };


    }

})();
