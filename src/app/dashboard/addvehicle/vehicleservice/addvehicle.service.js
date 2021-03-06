(function () {
    'use strict';

    angular
        .module('app.dashBoard')
        .factory('addVehicleService', addVehicleService);

    addVehicleService.$inject = ['$firebaseAuth', 'firebaseDataService', '$firebaseArray','CLD_MSG_KEY', '$http'];

    function addVehicleService($firebaseAuth, firebaseDataService, $firebaseArray, CLD_MSG_KEY, $http) {

        var service = {
            addVanWithAgent: addVanWithAgent,
            assignVanToAgent: assignVanToAgent,
            isAgentAssigned: isAgentAssigned,
            updateTransactionStatus : updateTransactionStatus,
            closeTransaction:closeTransaction,
            freeVanFromAgent:freeVanFromAgent,
            getVanAndAgentList : getVanAndAgentList,
            sendPushNotification : sendPushNotification,
            agentDailyWorkService : agentDailyWorkService
        };

        return service;

        ////////////
        function addVanWithAgent(vehicle) {
            console.log(vehicle.agentName+"================"+vehicle.agentAddress);
            return firebaseDataService.vanWithAgentService.child(vehicle.vehicleNumber).set({
                vanName: vehicle.vehicleName,
                vanNumber: vehicle.vehicleNumber,
                agentName: vehicle.agentName,
                agentMobile: vehicle.agentContact,
                agentAddress: vehicle.agentAddress,
                idType:vehicle.idType,
                idNumber:vehicle.idNumber,
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

        function assignVanToAgent(vanNumber, userId) {
            firebaseDataService.vanWithAgentService.child(vanNumber).child('isAgentAssignedWithTask').set(true);
            sendPushNotification(userId);
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

        function updateTransactionStatus(userid, transactionId, carNumber, updatedData, selectedItem, processDate){
            firebaseDataService.Transaction.child(userid).child(transactionId).child(carNumber).child("CarPickAddress").update({
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
            });//requestStatus : updatedData.requestStatus,carNumber

            firebaseDataService.Transaction.child(userid).child(transactionId).child(carNumber).update({
                requestStatus:updatedData.requestStatus,
                agentAssigned:selectedItem.agentName,
                vanNumberAssigned:updatedData.vanNumber,
                serviceProcessDate : processDate
            });
        }

        function closeTransaction(userid, carNumber, transactionId, updatedData, amountPaid, totalPrice){
            firebaseDataService.Transaction.child(userid).child(transactionId).child(carNumber).update({
                requestStatus:"closed",
                serviceCompleteDate:updatedData.serviceCompleteDate,
                amountPaid :parseInt(amountPaid),
                totalPrice:totalPrice
            });
        }

        function getVanAndAgentList(){
            return $firebaseArray(firebaseDataService.vanWithAgentService).$loaded().then(function(snapshot){
                var vehicleList = [];
                snapshot.forEach(function(data, index){
                    console.log(data);
                    vehicleList.push(data);
                });
                return vehicleList;
            });
        }
        
        function sendPushNotification(userId) {
            firebaseDataService.customer.child(userId).once('value', function (dataSnapshot) {
                var snapShot = dataSnapshot.val();
                var customerName = snapShot.name;
                var regToken = snapShot.regToken;
                var data = {};
                data.to = regToken;
                data.notification = {};
                data.notification.title="Request Status";
                data.notification.body="Hi,"+customerName+"\n We have processed your request,\n The agent is assigned , he will be arriving in the address specified very shortly. ";
                $http.post('https://fcm.googleapis.com/fcm/send', data,
                    {headers: { 'Authorization': "key="+CLD_MSG_KEY, 'Content-Type': 'application/json'}})
                    .then(function(response) {
                        console.log(response);
                    });
            });

        }
        
        function agentDailyWorkService(vanNumber) {
            firebaseDataService.AgentDailyWork.child(vanNumber)
        }

    }

})();