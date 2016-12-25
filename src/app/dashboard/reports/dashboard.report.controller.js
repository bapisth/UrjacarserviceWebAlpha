(function () {
    'use strict';

    angular
        .module('app.masterReport')
        .controller('ReportController', ReportController);

    ReportController.$inject = ['$scope', '$location', '$firebaseArray', 'firebaseDataService', 'NgTableParams'];


    function ReportController($scope, $location, $firebaseArray, firebaseDataService, NgTableParams) {
        var vm = this;
        //Put the contnets in the ng-include='dashboardContent', it is defined in the dashboard.html
        vm.dashboardContent="app/dashboard/reports/masterreport.html";

        vm.reportDataModel = {
            "date":"",
            "agent":"",
            "van":"",
            "customerName":"",
            "service":"",
            "amount":""
        };

        vm.buttonTitle="Generate Report";

        vm.defaultConfigTableParams = null;
        vm.mobileList = null;
        var mobileList = null;

        $firebaseArray(firebaseDataService.Transaction).$loaded().then(function(snapshot){
            var reportMainListData = [];
            snapshot.forEach(function (data, index) {
                for (var key in data) {
                    if (key !=="$id" && key !== "$priority"){
                        vm.reportDataModel = {};
                        var reportRow = vm.reportDataModel;
                        if (data.hasOwnProperty(key)) {
                            var childData  = data[key];
                            for (var childKey in childData){
                                var childReportRowData = childData[childKey];
                                reportRow.agent = childReportRowData.agentAssigned;
                                reportRow.date = childReportRowData.serviceProcessDate;
                                reportRow.van = childReportRowData.vanNumberAssigned;
                                $firebaseArray(firebaseDataService.customer).$loaded().then(function(customerDet){
                                    reportRow.customerName = customerDet.$getRecord(data.$id).name;
                                });
                                //reportRow.customerName = //data.$id; //Customer Id
                                var amount = 0;
                                var services = "";
                                var serviceRqstList = childReportRowData.serviceRequestList;
                                if (serviceRqstList != undefined){
                                    serviceRqstList.forEach(function (serviceRqstListData, serviceRqstListIndex) {
                                        amount += parseInt(serviceRqstListData.vehiclegroup);
                                        services += serviceRqstListData.desc+ ",";
                                    });
                                }
                                reportRow.amount = amount;
                                reportRow.service = services;

                            }

                               /* .then(function(snapshot){
                                snapshot.forEach(function (customerData, customerIndex) {
                                   if(customerData.$id === data.$id)
                                        reportRow.customerName = customerData.name;
                                });
                            });*/
                            reportMainListData.push(reportRow);
                        }
                    }
                }
            });

            console.log(reportMainListData)

            vm.defaultConfigTableParams = new NgTableParams({}, { dataset: reportMainListData});
            console.log('bahare achhi and table param initialize heijaichi.........');
            vm.defaultConfigTableParams.reload();

        });
    }
})();