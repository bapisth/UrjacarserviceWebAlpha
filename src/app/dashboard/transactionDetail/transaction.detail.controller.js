(function() {
  'use strict';

  angular
    .module('app.dashBoard')
    .controller('TransactionDetailController', TransactionDetailController);

  TransactionDetailController.$inject = ['dashboardService', '$location', '$routeParams', 'firebaseDataService', '$firebaseArray', 'vanAndAgents'];

  function TransactionDetailController(dashboardService, $location, $routeParams, firebaseDataService, $firebaseArray, vanAndAgents) {
    var vm = this;
    vm.selectedAgentName="";
    vm.transactions = [];
    vm.transactionArray = [];
    vm.onClick = onClick;
    vm.changeSelectedItem=changeSelectedItem;
    vm.obj = [];

    vm.transactionId = $routeParams.transactionId;
    $firebaseArray(firebaseDataService.Transaction.child(vm.transactionId)).$loaded().then(function (snapshot) {
        vm.transactions = [];
       console.log(snapshot.length)
       snapshot.forEach(function (childSnapshot) {
        vm.obj = [];
       $firebaseArray(firebaseDataService.Transaction.child(vm.transactionId).child(childSnapshot.$id))
       .$loaded().then(function (subChildSnap){
            subChildSnap.forEach(function (data, index){
                //console.log(subChildSnap);

                data.carNumber = childSnapshot.$id;
                vm.transactions.push(data);
                vm.obj[index] = [];

                vm.obj[index]["carNumber"]=childSnapshot.$id;
                vm.obj[index]["serviceRequestDate"]=data.serviceRequestDate;
                vm.obj[index]["requestStatus"]=data.requestStatus;

                vm.obj[index]["transactionId"]=data.$id;
                vm.obj[index]["addressLine1"]=data.CarPickAddress.addressLine1;
                vm.obj[index]["addressLine2"]=data.CarPickAddress.addressLine2;
                //{{transaction.CarPickAddress.state}}, {{transaction.CarPickAddress.pin}}
                vm.obj[index]["state"]=data.CarPickAddress.state;
                vm.obj[index]["pin"]=data.CarPickAddress.pin;
                vm.obj[index]["landmark"]=data.CarPickAddress.landmark;
                vm.obj[index]["mobileNumber"]=data.CarPickAddress.mobileNumber;
                vm.obj[index]["serviceRequestList"]=data.serviceRequestList;

                vm.obj[index]["buttonId"]=childSnapshot.$id;
                vm.obj[index]["agentNames"]= [];

                vanAndAgents.forEach(function(vanAndAgent, idx){
                    vm.obj[index]["agentNames"][idx] =  vanAndAgent;
                });

                vm.obj[index]["selectedItem"] = vm.obj[index]["agentNames"][0];


                vm.transactionArray.push(vm.obj[index]);
                console.log(vm.transactionArray);
                console.log(vm.transactionArray[index]["serviceRequestDate"])

            });
            console.log("1.----->"+vm.transactionArray);

       });
        console.log("2.----->"+vm.transactionArray);
       /*vm.transactions.push(childSnapshot);*/
        });
        console.log("3.----->"+vm.transactionArray);
    });



    vm.vanWithAgents = vanAndAgents;

    console.log(vm.vanWithAgents);
  function onClick(index){
    //console.log(vm.transactionArray[index]);
    //console.log(vm.obj[index]);

      //First Add to Assign the Agent
      var mainObj = vm.obj[index];
      var vanNumber = mainObj.selectedItem.vehicleNumber;
      console.log("Van Number : "+ vanNumber);
      var vanAgnt = {};
      vanAgnt.
      firebaseDataService.vanWithAgentService.child(vanNumber)

  }

function changeSelectedItem(index){
    //vm.obj[index]["selectedItem"] = vm.obj[index]["agentNames"];
        console.log(vm.obj[index]["selectedItem"]);
    vm.obj[index]["selectedItem"] = vm.obj[index]["selectedItem"];
}

  }



})();