/**
 * Created by BAPI1 on 9/22/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.dashBoard')
        .controller('AddVehicleController', AddVehicleController);

    AddVehicleController.$inject = ['addVehicleService', '$scope', '$location'];

    function AddVehicleController(addVehicleService, $scope, $location) {
        var vm = this;

        //Put the contnets in the ng-include='dashboardContent', it is defined in the dashboard.html
        vm.dashboardContent="app/dashboard/addvehicle/addvehicle.html";
        vm.addVehicle = addVehicle;
        vm.vanAddedMsg = "";
        vm.buttonTitle="Add Record";

        function addVehicle(vehicle) {
            var isAdded = addVehicleService.addVanWithAgent(vehicle);
            if(isAdded){
                vm.vanAddedMsg = "Successfully Added";
                //$location.path('/dashboard');
            }
        }
        
    }



})();
