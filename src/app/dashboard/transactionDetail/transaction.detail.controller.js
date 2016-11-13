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

        vm.openTransactionArray = [];
        vm.progressTransactionArray = [];
        vm.closedTransactionArray = [];

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
            snap.forEach(function (childSnapshot) {
                var key = childSnapshot.getKey();
                var childData = childSnapshot.val();
                vm.vanAndAgents.push(childData);
            });
        });


        firebaseDataService.vanWithAgentService.on('value', function (snap) {//Everytime update the select box on any changed done on agent
            vm.transactionArray = [];

            vm.openTransactionArray = [];
            vm.progressTransactionArray = [];
            vm.closedTransactionArray = [];

            //Array For Open Transactions
            $firebaseArray(firebaseDataService.Transaction.child(vm.transactionId)).$loaded().then(function (snapshot) {

                vm.transactions = [];

                console.log(snapshot.length)
                snapshot.forEach(function (childSnapshot) {
                    vm.obj = [];
                    $firebaseArray(firebaseDataService.Transaction.child(vm.transactionId).child(childSnapshot.$id))
                        .$loaded().then(function (subChildSnap) {
                        var previousTransactionId = "";
                        var serviceListPerCarCount = 0;
                        subChildSnap.forEach(function (data, index) {
                            //console.log(subChildSnap);
                            console.log("Open Tran :"+data.requestStatus);

                            if (data.requestStatus === "open"){
                                var transId = childSnapshot.$id;
                                data.carNumber = transId;
                                vm.transactions.push(data);
                                console.log(vm.obj.length);
                                var carNumber = data.$id;

                                if (transId != previousTransactionId){
                                    previousTransactionId = transId;

                                    vm.obj[index] = [];
                                    vm.obj[index]["serviceRequestList"] = [];
                                    vm.obj[index]["carNumber"] = childSnapshot.$id;
                                    console.log("Transaction Id___hem :"+ childSnapshot.$id);

                                    vm.obj[index]["serviceRequestDate"] = data.serviceRequestDate;
                                    vm.obj[index]["requestStatus"] = data.requestStatus;


                                    vm.obj[index]["transactionId"] = carNumber;
                                    console.log("Car Nuber_hem----- :"+ carNumber);

                                    vm.obj[index]["addressLine1"] = data.CarPickAddress.addressLine1;
                                    vm.obj[index]["addressLine2"] = data.CarPickAddress.addressLine2;
                                    //{{transaction.CarPickAddress.state}}, {{transaction.CarPickAddress.pin}}
                                    vm.obj[index]["state"] = data.CarPickAddress.state;
                                    vm.obj[index]["pin"] = data.CarPickAddress.pin;
                                    vm.obj[index]["landmark"] = data.CarPickAddress.landmark;
                                    vm.obj[index]["mobileNumber"] = data.CarPickAddress.mobileNumber;
                                    
                                    //vm.obj[index]["serviceRequestList"] = data.serviceRequestList;
                                    vm.obj[index]["serviceRequestList"][serviceListPerCarCount] = [];
                                    vm.obj[index]["serviceRequestList"][serviceListPerCarCount]["carNumber"] = carNumber;
                                    vm.obj[index]["serviceRequestList"][serviceListPerCarCount]["services"] = data.serviceRequestList;

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

                                    vm.openTransactionArray.push(vm.obj[index]);
                                    console.log("Open Transaction Arr :"+vm.openTransactionArray);
                                    serviceListPerCarCount ++;
                                    //console.log(vm.openTransactionArray[index]["serviceRequestDate"])
                                }else{
                                    var oldIndex = index-1;
                                    vm.obj[oldIndex]["serviceRequestList"][serviceListPerCarCount] = [];
                                    vm.obj[oldIndex]["serviceRequestList"][serviceListPerCarCount]["carNumber"]  = carNumber;
                                    vm.obj[oldIndex]["serviceRequestList"][serviceListPerCarCount]["services"] = data.serviceRequestList;

                                    //vm.obj[oldIndex]["serviceRequestList"] = vm.obj[oldIndex]["serviceRequestList"].concat(data.serviceRequestList);
                                }
                            }
                        });
                    });
                });
            });

            //Array For In-Progress Transactions
            $firebaseArray(firebaseDataService.Transaction.child(vm.transactionId)).$loaded().then(function (snapshot) {

                vm.transactions = [];

                console.log(snapshot.length)
                snapshot.forEach(function (childSnapshot) {
                    vm.obj = [];
                    $firebaseArray(firebaseDataService.Transaction.child(vm.transactionId).child(childSnapshot.$id))
                        .$loaded().then(function (subChildSnap) {
                        var previousTransactionId = "";
                        var serviceListPerCarCount = 0;
                        subChildSnap.forEach(function (data, index) {
                            //console.log(subChildSnap);
                            console.log("Progress Tran :"+data.requestStatus);

                            if (data.requestStatus === "progress"){
                                var transId = childSnapshot.$id;
                                data.carNumber = childSnapshot.$id;
                                vm.transactions.push(data);
                                console.log(vm.obj.length);
                                var carNumber = data.$id;

                                if (transId != previousTransactionId){
                                    previousTransactionId = transId;

                                    vm.obj[index] = [];
                                    vm.obj[index]["serviceRequestList"] = [];

                                    vm.obj[index]["carNumber"] = childSnapshot.$id;
                                    vm.obj[index]["serviceRequestDate"] = data.serviceRequestDate;
                                    vm.obj[index]["requestStatus"] = data.requestStatus;

                                    console.log("Car Number :"+data.$id);

                                    vm.obj[index]["transactionId"] = data.$id;
                                    vm.obj[index]["addressLine1"] = data.CarPickAddress.addressLine1;
                                    vm.obj[index]["addressLine2"] = data.CarPickAddress.addressLine2;
                                    //{{transaction.CarPickAddress.state}}, {{transaction.CarPickAddress.pin}}
                                    vm.obj[index]["state"] = data.CarPickAddress.state;
                                    vm.obj[index]["pin"] = data.CarPickAddress.pin;
                                    vm.obj[index]["landmark"] = data.CarPickAddress.landmark;
                                    vm.obj[index]["mobileNumber"] = data.CarPickAddress.mobileNumber;

                                    //vm.obj[index]["serviceRequestList"] = data.serviceRequestList;
                                    vm.obj[index]["serviceRequestList"][serviceListPerCarCount] = [];
                                    vm.obj[index]["serviceRequestList"][serviceListPerCarCount]["carNumber"] = carNumber;
                                    vm.obj[index]["serviceRequestList"][serviceListPerCarCount]["services"] = data.serviceRequestList;

                                    //calculate Total Price for this Car
                                    var serviceList = data.serviceRequestList;
                                    var totalPriceForThisCar = 0;
                                    serviceList.forEach(function (serv, k) {
                                        totalPriceForThisCar += parseInt(serv.vehiclegroup);
                                    });

                                    console.log("totalPriceForThisCar = "+totalPriceForThisCar);
                                    vm.obj[index]["totalPriceForThisCar"] = totalPriceForThisCar;
                                    vm.obj[index]["amountPaid"] = "0";
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

                                    vm.progressTransactionArray.push(vm.obj[index]);
                                    serviceListPerCarCount ++;
                                    /*console.log("Progress Trans Arr :" +vm.progressTransactionArray);
                                     console.log(vm.progressTransactionArray[index]["serviceRequestDate"]);*/
                                }else{
                                    var oldIndex = index-1;
                                    vm.obj[oldIndex]["serviceRequestList"][serviceListPerCarCount] = [];
                                    vm.obj[oldIndex]["serviceRequestList"][serviceListPerCarCount]["carNumber"]  = carNumber;
                                    vm.obj[oldIndex]["serviceRequestList"][serviceListPerCarCount]["services"] = data.serviceRequestList;

                                    var serviceList = data.serviceRequestList;
                                    var totalPriceForThisCar = 0;
                                    serviceList.forEach(function (serv, k) {
                                        totalPriceForThisCar += parseInt(serv.vehiclegroup);
                                    });
                                    vm.obj[oldIndex]["totalPriceForThisCar"] += totalPriceForThisCar;
                                    //vm.obj[oldIndex]["serviceRequestList"] = vm.obj[oldIndex]["serviceRequestList"].concat(data.serviceRequestList);
                                }
                            }

                        });
                    });
                });
            });

            //Array for Closed Transactions
            $firebaseArray(firebaseDataService.Transaction.child(vm.transactionId)).$loaded().then(function (snapshot) {

                vm.transactions = [];
                var previousTransactionId = "";
                var serviceListPerCarCount = 0;

                console.log(snapshot.length)
                snapshot.forEach(function (childSnapshot) {
                    vm.obj = [];
                    $firebaseArray(firebaseDataService.Transaction.child(vm.transactionId).child(childSnapshot.$id))
                        .$loaded().then(function (subChildSnap) {
                        subChildSnap.forEach(function (data, index) {
                            console.log("Closed Tran :"+data.requestStatus);

                            if (data.requestStatus === "closed"){
                                var transId = childSnapshot.$id;
                                data.carNumber = childSnapshot.$id;
                                vm.transactions.push(data);
                                console.log(vm.obj.length);
                                var carNumber = data.$id;

                                if (transId != previousTransactionId){
                                    previousTransactionId = transId;
                                    vm.obj[index] = [];
                                vm.obj[index]["serviceRequestList"] = [];

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

                                //vm.obj[index]["serviceRequestList"] = data.serviceRequestList;
                                vm.obj[index]["serviceRequestList"][serviceListPerCarCount] = [];
                                vm.obj[index]["serviceRequestList"][serviceListPerCarCount]["carNumber"] = carNumber;
                                vm.obj[index]["serviceRequestList"][serviceListPerCarCount]["services"] = data.serviceRequestList;


                                    //calculate Total Price for this Car
                                    var serviceList = data.serviceRequestList;
                                    var totalPriceForThisCar = 0;
                                    serviceList.forEach(function (serv, k) {
                                        totalPriceForThisCar += parseInt(serv.vehiclegroup);
                                    });
                                //vm.obj[index]["totalPrice"] = parseInt(data.totalPrice);
                                vm.obj[index]["totalPrice"] = totalPriceForThisCar;
                                vm.obj[index]["amountPaid"] = data.amountPaid;

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

                                vm.closedTransactionArray.push(vm.obj[index]);
                                serviceListPerCarCount++;
                                console.log("Closed Transaction Array :"+vm.closedTransactionArray);
                                console.log(vm.closedTransactionArray[index]["serviceRequestDate"]);
                                }else{
                                    var oldIndex = index-1;
                                    vm.obj[oldIndex]["serviceRequestList"][serviceListPerCarCount] = [];
                                    vm.obj[oldIndex]["serviceRequestList"][serviceListPerCarCount]["carNumber"]  = carNumber;
                                    vm.obj[oldIndex]["serviceRequestList"][serviceListPerCarCount]["services"] = data.serviceRequestList;
                                    //vm.obj[oldIndex]["totalPrice"] += parseInt(data.totalPrice);

                                    var serviceList = data.serviceRequestList;
                                    var totalPriceForThisCar = 0;
                                    serviceList.forEach(function (serv, k) {
                                        totalPriceForThisCar += parseInt(serv.vehiclegroup);
                                    });
                                    vm.obj[oldIndex]["totalPrice"] += totalPriceForThisCar;

                                    //vm.obj[oldIndex]["serviceRequestList"] = vm.obj[oldIndex]["serviceRequestList"].concat(data.serviceRequestList);
                                }
                            }
                        });
                    });
                });
            });
        });

        //vm.vanWithAgents = vanAndAgents;

        function onClick(index) {
            var vanNumber = vm.getVanNumber(index);
            if(vanNumber ==undefined || vanNumber==""){
                alert('Choose an Agent First!');
                return;
            }
            console.log(vm.openTransactionArray[index]);
            var mainObj = vm.openTransactionArray[index];
            vm.serviceProcessDate[index] = vm.today;
            vm.showServiceProcessDate[index] = true;
            //First Add to Assign the Agent
            var personCarNumber = mainObj.carNumber;


            mainObj.requestStatus = "progress";
            mainObj.vanNumber = vanNumber;
            var userId = vm.transactionId;
            var tid = mainObj.carNumber;

            /**
             *  mainObj.carNumber = transactionId
             *
             */
            for (var i=0; i< mainObj.serviceRequestList.length; i++){
                var obj = mainObj.serviceRequestList[i];
                addVehicleService.updateTransactionStatus(userId, tid, obj.carNumber, mainObj, vm.selectedItem[index], vm.serviceProcessDate[index]);
            }
            //addVehicleService.updateTransactionStatus(userId, personCarNumber, mainObj.transactionId, mainObj, vm.selectedItem[index], vm.serviceProcessDate[index]);
            addVehicleService.assignVanToAgent(vanNumber, userId);

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

            console.log(vm.progressTransactionArray[index]);
            var mainObj = vm.progressTransactionArray[index];

            if (parseInt(mainObj.amountPaid)<=0){
                alert('Enter Paid Amount!');
                return;
            }

            var serviceList = mainObj.serviceRequestList;
            var totalPriceForThisCar = 0;
            serviceList.forEach(function (serv, k) {
                var personCarNumber = serv.carNumber;
                serv.services.forEach(function (data, index) {
                    totalPriceForThisCar = parseInt(data.vehiclegroup);
                });
                mainObj.requestStatus = "closed";
                mainObj.serviceCompleteDate = vm.today;
                var userId = vm.transactionId;

                var vanNumber = mainObj.vanNumberAssigned;
                mainObj.vanNumber = vanNumber;
                console.log("Van Number :" + vanNumber);
                var tid = mainObj.carNumber;
                addVehicleService.closeTransaction(userId, personCarNumber, tid, mainObj, mainObj.amountPaid, totalPriceForThisCar);
            });

            addVehicleService.freeVanFromAgent(vanNumber);
        }

    }


})();