(function () {
    'use strict';

    angular
        .module('app.dashBoard')
        .factory('addVehicleService', addVehicleService);

    addVehicleService.$inject = ['$firebaseAuth', 'firebaseDataService', '$firebaseArray'];

    function addVehicleService($firebaseAuth, firebaseDataService, $firebaseArray) {

        var service = {
            addVanWithAgent: addVanWithAgent,
            assignVanToAgent: assignVanToAgent,
            isAgentAssigned: isAgentAssigned,
            updateTransactionStatus : updateTransactionStatus,
            closeTransaction:closeTransaction,
            freeVanFromAgent:freeVanFromAgent,
            getVanAndAgentList : getVanAndAgentList
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

        function freeVanFromAgent(vanNumber) {
            console.log('free Van Number :'+ vanNumber);
            firebaseDataService.vanWithAgentService.child(vanNumber).child('isAgentAssignedWithTask').set(false);
        }

        function isAgentAssigned(vanNumber) {
            console.log(vanNumber);
            return firebaseDataService.vanWithAgentService.child(vanNumber)
                .child('isAgentAssignedWithTask').once('value', function (snap) {
                    console.log(snap.val());
                    return snap.val();
                });
        }

        function updateTransactionStatus(userid, carNumber, transactionId, updatedData, selectedItem, processDate){
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
                requestStatus:updatedData.requestStatus,
                agentAssigned:selectedItem.agentName,
                vanNumberAssigned:updatedData.vanNumber,
                serviceProcessDate : processDate
            });
        }

        function closeTransaction(userid, carNumber, transactionId, updatedData){
            firebaseDataService.Transaction.child(userid).child(carNumber).child(transactionId).update({
                requestStatus:"closed",
                serviceCompleteDate:updatedData.serviceCompleteDate
            });
        }

        function getVanAndAgentList(){
            return $firebaseArray(firebaseDataService.vanWithAgentService).$loaded().then(function(snapshot){
                var vehicleList = [];
                snapshot.forEach(function(data, index){
                    console.log(data);
                    vehicleList.push(data);
                })
                return vehicleList;
            });
        }

    }

})();