(function() {
  'use strict';

  angular
    .module('app.dashBoard')
    .factory('addVehicleService', addVehicleService);

  addVehicleService.$inject = ['$firebaseAuth', 'firebaseDataService'];

  function addVehicleService($firebaseAuth, firebaseDataService) {

    var service = {
      addVanWithAgent: addVanWithAgent
    };

    return service;

    ////////////
    function addVanWithAgent(vehicle){
        return firebaseDataService.vanWithAgentService.push({
            vanName: vehicle.vehicleName,
            vanNumber: vehicle.vehicleNumber,
            agentName: vehicle.agentName,
            agentMobile: vehicle.agentContact,
            isAgentAssignedWithTask: false,
            vanPresentLocation:{
                pin:"N/A",
                currLattitude: "N/A",
                currLongitude: "N/A"
            }
        }, function(res){
            //On Complete Listener
            console.log(res);
        }).then(function() {
              console.log("SuccessFully  Addedd.");
              return true;
            })
            .catch(function(error) {
              console.log("Add failed: " + error.message);
              alert("Add failed: "+ error.message);
              return false
            });
    }

  }

})();