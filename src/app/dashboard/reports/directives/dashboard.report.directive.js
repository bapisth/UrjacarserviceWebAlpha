/**
 * Created by BAPI1 on 9/15/2016.
 */
(function() {
    'use strict';

    angular
        .module('app.dashBoard')
        .directive('urjaReport', urjaReport)
        // this is the important bit:
        .directive('datepickerPopup', function (){
            return {
                restrict: 'EAC',
                require: 'ngModel',
                link: function(scope, element, attr, controller) {
                    //remove the default formatter from the input directive to prevent conflict
                    controller.$formatters.shift();
                }
            }
        });

    function urjaReport() {
        return {
            templateUrl: 'app/dashboard/reports/directives/masterreport.form.html',
            restrict: 'E',
            controller: ReportDirectiveController,
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                error: '=',
                buttonTitle: '@',
                vanAddedmessage: '@',
                submitAction: '&',
                vehicles : '='
            }
        };
    }

    ReportDirectiveController.$inject = ['firebaseDataService', '$firebaseArray'];

    function ReportDirectiveController(firebaseDataService, $firebaseArray) {
        var vm = this;
        vm.openCalender = openCalender;
        vm.openCalender2 = openCalender2;
        //vm.dateFieldOpened1 = false;




        //Populate Agent Names
        $firebaseArray(firebaseDataService.vanWithAgentService).$loaded().then(function(snapshot){
            vm.agentNames = [];

            vm.agent = {
                name:'',
                vanNumber:''
            }
            snapshot.forEach(function (data, index) {
                vm.agent = {};
                vm.agent.vanNumber = data.vanNumber;
                vm.agent.name = data.agentName;

                vm.agentNames.push(vm.agent);
            });
        });


        //Datepicker popup
        function openCalender($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.dateFieldOpened1 = true;
        };

        function openCalender2($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.dateFieldOpened2 = true;
        };


        //Report Model
        vm.report = {
            agentVanNumber: '',
            fromDate: '',
            endDate: ''
        };

        vm.today = function() {
            vm.report.startDate = new Date();
            vm.report.endDate = new Date();
        };
        vm.today();

        vm.clear = function() {
            vm.report.fromDate = null;
            vm.report.endDate = null;
        };

        vm.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        vm.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
                mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }

        vm.toggleMin = function() {
            vm.inlineOptions.minDate = vm.inlineOptions.minDate ? null : new Date();
            vm.dateOptions.minDate = vm.inlineOptions.minDate;
        };

        vm.toggleMin();

        vm.setDate = function(year, month, day) {
            vm.report.startDate = new Date(year, month, day);
            vm.endDate = new Date(year, month, day);
        };

        vm.formats = ['yyyy/MM/dd', 'dd-MMMM-yyyy',  'dd.MM.yyyy', 'shortDate'];
        vm.format = vm.formats[0];
        vm.altInputFormats = ['M!/d!/yyyy'];

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        vm.events = [
            {
                date: tomorrow,
                status: 'full'
            },
            {
                date: afterTomorrow,
                status: 'partially'
            }
        ];

        function getDayClass(data) {
            var date = data.date,
                mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0);

                for (var i = 0; i < vm.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                        return vm.events[i].status;
                    }
                }
            }

            return '';
        }
    }

})();
