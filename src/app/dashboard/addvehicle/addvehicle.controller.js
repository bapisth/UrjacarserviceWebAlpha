/**
 * Created by BAPI1 on 9/22/2016.
 */
(function () {
    'use strict';

    angular
        .module('app.dashBoard')
        .controller('AddVehicleController', AddVehicleController);

    AddVehicleController.$inject = ['addVehicleService', '$scope', '$location', '$firebaseArray', 'firebaseDataService', 'NgTableParams'];

    function AddVehicleController(addVehicleService, $scope, $location, $firebaseArray, firebaseDataService, NgTableParams) {
        var vm = this;

        //Put the contnets in the ng-include='dashboardContent', it is defined in the dashboard.html
        vm.dashboardContent="app/dashboard/addvehicle/addvehicle.html";
        vm.addVehicle = addVehicle;
        vm.vanAddedMsg = "";
        vm.buttonTitle="Add Record";
        vm.vehicles = [];
        var vehicleList = null;

        vm.defaultConfigTableParams = null;
        vm.mobileList = null;
        var mobileList = null;

        //Initially populate the data
        firebaseDataService.vanWithAgentService.limitToLast(1).on("value", function(newChild){
            vehicleList = [];
            mobileList = [];
            vm.mobileList = [];
            $firebaseArray(firebaseDataService.vanWithAgentService).$loaded().then(function(snapshot){
                vehicleList = [];
                vm.phoneList = [];
                snapshot.forEach(function(data, index){
                    mobileList.push(data.agentMobile);
                    vehicleList.push(data);
                });
                vm.defaultConfigTableParams = new NgTableParams({}, { dataset: vehicleList});
                console.log('bahare achhi and table param initialize heijaichi.........');
                vm.defaultConfigTableParams.reload();
            });

        });

        vm.vehicles = vehicleList;
        vm.mobileList = mobileList;



        function addVehicle(vehicle) {
            var isAdded = addVehicleService.addVanWithAgent(vehicle);
            if(isAdded){
                vm.vanAddedMsg = "Successfully Added";
                /*agentName = '';
                agentAddress = '';
                agentContact = '';
                vehicleName = '';
                vehicleNumber = '';*/

                //$location.path('/dashboard');
            }
        }
        console.log("11111---------11111111111 :"+vm.vehicles);
    }



})();
