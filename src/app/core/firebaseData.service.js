(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('firebaseDataService', firebaseDataService);

    function firebaseDataService() {
        var root = firebase.database().ref();

        var service = {
            root: root,
            BikeService: root.child('BikeService'),
            Booking: root.child('Booking'),
            CarService: root.child('CarService'),
            ServiceAgent: root.child('ServiceAgent'),
            ServiceAgentAssignmentArea: root.child('ServiceAgentAssignmentArea'),
            ServiceAgentCurrentLocation: root.child('ServiceAgentCurrentLocation'),
            Subscription: root.child('Subscription'),
            Transaction: root.child('Transaction'),
            ValidStatus: root.child('ValidStatus'),
            ValidVehicle: root.child('ValidVehicle'),
            customer: root.child('customer'),
            customerAddress: root.child('customerAddress'),
            emails: root.child('emails'),
            users: root.child('users'),
            vanWithAgentService: root.child('vanwithagent'),
            AdminNotification: root.child('AdminNotification'),
            AdminUser: root.child('AdminUser'),
            AgentDailyWork: root.child('AgentDailyWork'),
            //emails: root.child('emails'),
            textMessages: root.child('textMessages')
        };

        return service;
    }

})();
