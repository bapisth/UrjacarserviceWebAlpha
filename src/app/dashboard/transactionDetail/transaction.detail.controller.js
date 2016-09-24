(function () {
    'use strict';

    angular
        .module('app.dashBoard')
        .controller('TransactionDetailController', TransactionDetailController);

    TransactionDetailController.$inject = ['dashboardService', '$location', '$routeParams', 'firebaseDataService', '$firebaseArray', 'addVehicleService'];

    function TransactionDetailController(dashboardService, $location, $routeParams, firebaseDataService, $firebaseArray, addVehicleService) {
        var vm = this;
        vm.selectedAgentName = "";
        vm.transactions = [];
        vm.transactionArray = [];
        vm.onClick = onClick;
        vm.changeSelectedItem = changeSelectedItem;
        vm.getVanNumber = getVanNumber;
        vm.obj = [];
        vm.selectedItem = [];
        vm.vanAndAgents = [];

        vm.transactionId = $routeParams.transactionId;
        console.log(vm.transactionId);

        firebaseDataService.vanWithAgentService.on('value', function (snap) {
            vm.vanAndAgents = [];
            console.log('Asila re Asila.........');
            snap.forEach(function(childSnapshot) {
                var key = childSnapshot.getKey();
                var childData = childSnapshot.val();
                vm.vanAndAgents.push(childData);
            });
        });


        firebaseDataService.vanWithAgentService.on('value', function (snap) {//Everytime update the select box on any changed done on agent
            vm.transactionArray = [];

            $firebaseArray(firebaseDataService.Transaction.child(vm.transactionId)).$loaded().then(function (snapshot) {

                vm.transactions = [];

                console.log(snapshot.length)
                snapshot.forEach(function (childSnapshot) {
                    vm.obj = [];
                    $firebaseArray(firebaseDataService.Transaction.child(vm.transactionId).child(childSnapshot.$id))
                        .$loaded().then(function (subChildSnap) {
                        subChildSnap.forEach(function (data, index) {
                            //console.log(subChildSnap);

                            data.carNumber = childSnapshot.$id;
                            vm.transactions.push(data);
                            console.log(vm.obj.length);
                            vm.obj[index] = [];

                            vm.obj[index]["carNumber"] = childSnapshot.$id;
                            vm.obj[index]["serviceRequestDate"] = data.serviceRequestDate;
                            vm.obj[index]["requestStatus"] = data.requestStatus;

                            vm.obj[index]["transactionId"] = data.$id;
                            vm.obj[index]["addressLine1"] = data.CarPickAddress.addressLine1;
                            vm.obj[index]["addressLine2"] = data.CarPickAddress.addressLine2;
                            //{{transaction.CarPickAddress.state}}, {{transaction.CarPickAddress.pin}}
                            vm.obj[index]["state"] = data.CarPickAddress.state;
                            vm.obj[index]["pin"] = data.CarPickAddress.pin;
                            vm.obj[index]["landmark"] = data.CarPickAddress.landmark;
                            vm.obj[index]["mobileNumber"] = data.CarPickAddress.mobileNumber;
                            vm.obj[index]["serviceRequestList"] = data.serviceRequestList;

                            vm.obj[index]["buttonId"] = childSnapshot.$id;
                            vm.obj[index]["agentNames"] = [];

                            var counter = 0;
                            vm.vanAndAgents.forEach(function (vanAndAgent, idx) {//If the Agent is already assigned then do not show him.
                                if (!vanAndAgent.isAgentAssignedWithTask){
                                    vm.obj[index]["agentNames"][counter] = vanAndAgent;
                                    counter++;
                                }
                            });

                            vm.transactionArray.push(vm.obj[index]);
                            console.log(vm.transactionArray);
                            console.log(vm.transactionArray[index]["serviceRequestDate"])

                        });
                    });
                });
            });
        });

        //vm.vanWithAgents = vanAndAgents;

        function onClick(index) {

            console.log(vm.transactionArray[index]);
            var mainObj = vm.transactionArray[index];
            //First Add to Assign the Agent
            var personCarNumber = mainObj.carNumber;
            console.log("personCarNumber : " + personCarNumber);
            var vanNumber = vm.getVanNumber(index);
            console.log("Van Number : " + vanNumber);
            mainObj.requestStatus="progress";
            var userId = vm.transactionId;

            addVehicleService.updateTransactionStatus(userId, personCarNumber, mainObj.transactionId, mainObj);
            addVehicleService.assignVanToAgent(vanNumber);

        }

        function changeSelectedItem(index) {
            console.log('Index = '+ index);
            console.log(vm.obj[index]["selectedItem"]);
            var vanNumber = vm.getVanNumber(index);
            var isAsgn = false;
            /*if (vanNumber != undefined)
                isAsgn = ;
            console.log('isAsign :'+isAsgn);*/
            /*if(addVehicleService.isAgentAssigned(vanNumber)){
                vm.obj[index]["selectedItem"] = -1;
                //vm.obj[index]["selectedItem"] = vm.obj[index]["agentNames"][0];
                alert('The agent is already assigned with the task, Choose different One.')
                return;
            }*/
        }

        function getVanNumber(index) {
            console.log('Inside getVanNumber');
            var mainObj = vm.selectedItem[index];//vm.transactionArray[index];
            var vanNumber = mainObj.vanNumber;// mainObj.selectedItem.vehicleNumber;
            return vanNumber;
        }

    }


})();