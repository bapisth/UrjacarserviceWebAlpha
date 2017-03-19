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
        vm.generateReport = generateReport;
        vm.convertStringToDate = convertStringToDate;

        vm.reportDataModel = {
            "date":"",
            "agent":"",
            "van":"",
            "customerName":"",
            "service":"",
            "amount":""
        };

        vm.searchFilterReportData = [];


        vm.vanAddedMsg = "";
        vm.buttonTitle="Generate Report";

        vm.defaultConfigTableParams = null;
        vm.mobileList = null;
        var mobileList = null;
        var customerName = "";


        
        function generateReport(report) {
            console.log("==========================================="+ (report.agentVanNumber == "" || report.agentVanNumber == null));
            if (report.fromDate != "" && report.endDate != ""){ // && report.agentVanNumber!=""
                $firebaseArray(firebaseDataService.Transaction).$loaded().then(function(snapshot){
                    var reportMainListData = [];
                    snapshot.forEach(function (data, index) {
                        $firebaseObject(firebaseDataService.customer.child(data.$id).child("name")).$loaded().then(function (customerName) {
                            var dataArray = _.values(data, alert);

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

                                        //if ((report.fromDate != "" && report.endDate != "")){
                                            var fromDate = report.fromDate.toLocaleDateString();
                                            var toDate = report.endDate.toLocaleDateString();
                                            var processDate = "";
                                            if (reportRow.date != undefined){
                                                processDate = reportRow.date;

                                                //Processdate is in the form of dd/mm/yyyy
                                                //but other two fileds 'fromDate, toDate' are in mm/dd/yyyy
                                                var splitProcessDate = processDate.split("/");
                                                var newProcessDate = splitProcessDate[1]+"/"+splitProcessDate[0]+"/"+splitProcessDate[2]; // mm/dd/yyyy
                                                //reportRow.date = newProcessDate;
                                                if(dateCheck(fromDate, toDate, newProcessDate) && (report.agentVanNumber == reportRow.van))
                                                    reportMainListData.push(reportRow);

                                            }else if((report.agentVanNumber == "" || report.agentVanNumber == null)){
                                                reportMainListData.push(reportRow);
                                            }
                                        /*}else{
                                            reportMainListData.push(reportRow);
                                        }*/


                                    }
                                }
                            }
                        });
                    });

                    vm.defaultConfigTableParams = new NgTableParams({}, { dataset: reportMainListData});
                    vm.defaultConfigTableParams.reload();

                });
            }else {
                alert("From and To date are mandatory!!")
            }


        }

        function convertStringToDate(dateString){
            var parts =dateString.split('/');
            return new Date(parts[2],parts[0]-1,parts[1]);
        }

        function dateCheck(from,to,check) {
            if (check=="")
                return false;

            var fDate,lDate,cDate;
            fDate = Date.parse(from);
            lDate = Date.parse(to);
            cDate = Date.parse(check);

            if((cDate >= fDate && cDate <= lDate)) {
                return true;
            }
            return false;
        }
    }
})();