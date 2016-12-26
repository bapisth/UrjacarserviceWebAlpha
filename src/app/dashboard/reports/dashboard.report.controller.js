(function () {
    'use strict';

    angular
        .module('app.masterReport')
        .controller('ReportController', ReportController);

    ReportController.$inject = ['$scope', '$location', '$firebaseArray', '$firebaseObject', 'firebaseDataService', 'NgTableParams'];


    function ReportController($scope, $location, $firebaseArray, $firebaseObject, firebaseDataService, NgTableParams) {
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
        var customerName = "";

        $firebaseArray(firebaseDataService.Transaction).$loaded().then(function(snapshot){
            var reportMainListData = [];
            snapshot.forEach(function (data, index) {
                $firebaseObject(firebaseDataService.customer.child(data.$id).child("name")).$loaded().then(function (customerName) {
                    customerName = customerName.$value;
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
                                    reportRow.customerName = customerName;
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
                                reportMainListData.push(reportRow);
                            }
                        }
                    }
                });
            });

            vm.defaultConfigTableParams = new NgTableParams({}, { dataset: reportMainListData});
            vm.defaultConfigTableParams.reload();

        });
    }
})();