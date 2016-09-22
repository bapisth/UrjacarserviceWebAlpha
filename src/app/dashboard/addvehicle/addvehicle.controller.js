/**
 * Created by BAPI1 on 9/22/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.dashBoard')
        .controller('AddVehicleController', AddVehicleController);

    AddVehicleController.$inject = ['dashboardService', '$scope'];

    function AddVehicleController(dashboardService, $scope) {
        var vm = this;

        //Put the contnets in the ng-include='dashboardContent', it is defined in the dashboard.html
        vm.dashboardContent="app/dashboard/addvehicle/addvehicle.html";
        vm.addVehicle = addVehicle;

        function addVehicle(vehicle) {
            alert('Inside AddVehicle Method!!'+vehicle);
        }
        
    }



})();
