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

        $firebaseArray(firebaseDataService.Transaction).$loaded().then(function(snapshot){
            var reportMainListData = [];
            snapshot.forEach(function (data, index) {
                $firebaseObject(firebaseDataService.customer.child(data.$id).child("name")).$loaded().then(function (customerName) {
                    var dataArray = _.values(data, alert);


                    var kadali = _.toArray(dataArray);
                    console.log(kadali);

                    var evens = _.each(dataArray, function(dataArrObj){
                        var childDataArrObjArray = _.values(dataArrObj);
                        var filterdData = _.filter(childDataArrObjArray, function (subObject) {
                            console.log(subObject);
                            var fromDate = convertStringToDate('12/11/2016');
                            var toDate = convertStringToDate('14/11/2016');
                            var processDate = subObject.serviceProcessDate;
                            var dateCheckResult = dateCheck(fromDate, toDate, processDate);
                            console.log(dateCheckResult);
                            return dateCheckResult;
                        });
                        if (filterdData[0] && filterdData[0].hasOwnProperty('requestStatus')){
                            vm.searchFilterReportData.push(filterdData);
                        }
                    });

                    console.log(vm.searchFilterReportData);

                    _.allKeys(data, function (objInData) {
                        console.log(objInData);
                    });
                    return;//testing remove it once test completes
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
                                /**
                                 * Testing dates
                                 * 14/11/2016
                                 * 12/11/2016
                                 * 13/11/2016
                                 */
                                var fromDate = convertStringToDate('12/11/2016');
                                var toDate = convertStringToDate('14/11/2016');
                                var processDate = "";
                                if (reportRow.date != undefined)
                                 processDate = convertStringToDate(reportRow.date);

                                if(dateCheck(fromDate, toDate, processDate))
                                    reportMainListData.push(reportRow);
                            }
                        }
                    }
                });
            });

            vm.defaultConfigTableParams = new NgTableParams({}, { dataset: reportMainListData});
            vm.defaultConfigTableParams.reload();

        });
        
        function generateReport(report) {
            alert("Inside generate report!!");

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

            if((cDate <= lDate && cDate >= fDate)) {
                return true;
            }
            return false;
        }
    }
})();