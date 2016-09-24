(function () {
    'use strict';

    angular
        .module('app.dashBoard')
        .factory('addVehicleService', addVehicleService);

    addVehicleService.$inject = ['$firebaseAuth', 'firebaseDataService', '$q'];

    function addVehicleService($firebaseAuth, firebaseDataService) {

        var service = {
            addVanWithAgent: addVanWithAgent,
            assignVanToAgent: assignVanToAgent,
            isAgentAssigned: isAgentAssigned,
            updateTransactionStatus : updateTransactionStatus
        };

        return service;

        ////////////
        function addVanWithAgent(vehicle) {
            return firebaseDataService.vanWithAgentService.child(vehicle.vehicleNumber).set({
                vanName: vehicle.vehicleName,
                vanNumber: vehicle.vehicleNumber,
                agentName: vehicle.agentName,
                agentMobile: vehicle.agentContact,
                isAgentAssignedWithTask: false,
                vanPresentLocation: {
                    pin: "N/A",
                    currLattitude: "N/A",
                    currLongitude: "N/A"
                }
            }, function (res) {
                //On Complete Listener
                console.log(res);
            }).then(function () {
                    console.log("SuccessFully  Addedd.");
                    return true;
                })
                .catch(function (error) {
                    console.log("Add failed: " + error.message);
                    alert("Add failed: " + error.message);
                    return false
                });
        }

        function assignVanToAgent(vanNumber) {
            firebaseDataService.vanWithAgentService.child(vanNumber).child('isAgentAssignedWithTask').set(true);
        }

        function isAgentAssigned(vanNumber) {
            console.log(vanNumber);
            return firebaseDataService.vanWithAgentService.child(vanNumber)
                .child('isAgentAssignedWithTask').once('value', function (snap) {
                    console.log(snap.val());
                    return snap.val();
                });
        }

        function updateTransactionStatus(userid, carNumber, transactionId, updatedData, $q){
            console.log(updatedData.addressLine1);
            firebaseDataService.Transaction.child(userid).child(carNumber).child(transactionId).child("CarPickAddress").update({
                addressLine1:updatedData.addressLine1,
                addressLine2:updatedData.addressLine2,
                landmark: updatedData.landmark,
                mobileNumber : updatedData.mobileNumber,
                pin : updatedData.pin,
                state : updatedData.state
            }, function(error) {
                if (error) {
                    console.log('Synchronization failed');
                } else {
                    console.log('Synchronization succeeded');
                }
            });//requestStatus : updatedData.requestStatus,

            firebaseDataService.Transaction.child(userid).child(carNumber).child(transactionId).update({
                requestStatus:updatedData.requestStatus
            });
        }

    }

})();