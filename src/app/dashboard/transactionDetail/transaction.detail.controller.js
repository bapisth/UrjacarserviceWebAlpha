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
        vm.onCloseTransaction = onCloseTransaction;
        vm.getVanNumber = getVanNumber;
        vm.obj = [];
        vm.selectedItem = [];
        vm.vanAndAgents = [];
        vm.showServiceProcessDate = [];
        vm.serviceProcessDate = [];
        vm.showServiceEndDate = []
        vm.serviceCompleteDate = [];

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        vm.today = dd + '/' + mm + '/' + yyyy;

        vm.transactionId = $routeParams.transactionId;
        console.log(vm.transactionId);

        firebaseDataService.vanWithAgentService.on('value', function (snap) {
            vm.vanAndAgents = [];
            console.log('Asila re Asila.........');
            snap.forEach(function (childSnapshot) {
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
                                if (!vanAndAgent.isAgentAssignedWithTask) {
                                    vm.obj[index]["agentNames"][counter] = vanAndAgent;
                                    counter++;
                                }
                            });

                            vm.selectedItem[index] = [];
                            vm.obj[index]["agentAssigned"] = data.agentAssigned;
                            vm.obj[index]["serviceProcessDate"] = data.serviceProcessDate;
                            vm.obj[index]["serviceCompleteDate"] = data.serviceCompleteDate;
                            vm.obj[index]["vanNumberAssigned"] = data.vanNumberAssigned;

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

            vm.serviceProcessDate[index] = vm.today;
            vm.showServiceProcessDate[index] = true;

            console.log(vm.transactionArray[index]);
            var mainObj = vm.transactionArray[index];
            //First Add to Assign the Agent
            var personCarNumber = mainObj.carNumber;

            var vanNumber = vm.getVanNumber(index);
            mainObj.requestStatus = "progress";
            mainObj.vanNumber = vanNumber;
            var userId = vm.transactionId;

            addVehicleService.updateTransactionStatus(userId, personCarNumber, mainObj.transactionId, mainObj, vm.selectedItem[index], vm.serviceProcessDate[index]);
            addVehicleService.assignVanToAgent(vanNumber);

        }

        function changeSelectedItem(index) {
            console.log('Index = ' + index);
            console.log(vm.obj[index]["selectedItem"]);
            var vanNumber = vm.getVanNumber(index);
            var isAsgn = false;
        }

        function getVanNumber(index) {
            console.log('Inside getVanNumber');
            var mainObj = vm.selectedItem[index];//vm.transactionArray[index];
            var vanNumber = mainObj.vanNumber;// mainObj.selectedItem.vehicleNumber;
            return vanNumber;
        }

        function onCloseTransaction(index) {
            /*vm.showServiceEndDate[index]= true;
             vm.serviceCompleteDate[index] = vm.today;*/

            //vm.obj[index]["serviceProcessDate"] = vm.today;

            console.log(vm.transactionArray[index]);
            var mainObj = vm.transactionArray[index];

            mainObj.requestStatus = "closed";
            mainObj.serviceCompleteDate = vm.today;
            var userId = vm.transactionId;
            var personCarNumber = mainObj.carNumber;
            var vanNumber = mainObj.vanNumberAssigned;
            mainObj.vanNumber = vanNumber;
            console.log("Van Number :" + vanNumber);

            addVehicleService.closeTransaction(userId, personCarNumber, mainObj.transactionId, mainObj);
            addVehicleService.freeVanFromAgent(vanNumber);
        }

    }


})();