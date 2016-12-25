(function () {
    'use strict';

    angular
        .module('app.dashBoard.admin')
        .controller('AdminSettingsController', AdminSettingsController);

    AdminSettingsController.$inject = ['$firebaseObject', 'authService', 'dashboardService', 'firebaseDataService'];

    function AdminSettingsController($firebaseObject, authService, dashboardService, firebaseDataService) {
        var vm = this;
        //Put the contnets in the ng-include='dashboardContent'
        vm.dashboardAdminContent = "app/dashboard/admin/adminsettings.html";
        vm.adminUser = {
            name:'',
            email:'',
            mobile:''
        };
        vm.updateAdminProfile = updateAdminProfile;

        //get the email address of the currently loggedin user
        vm.AuthObj = authService.isLoggedIn();

        vm.updateFiledsWithServerAdminData = updateFiledsWithServerAdminData;
        //Always put the loggedIn email address
        if (vm.AuthObj){
            vm.adminUser.email = vm.AuthObj.email;
            updateFiledsWithServerAdminData();

        }
        
        function updateAdminProfile(adminData) {
            firebaseDataService.AdminUser.child(vm.AuthObj.uid).set(adminData, function (error) {
                console.log(callbackData);
                if (error != null){
                    alert('Error updating Profile. Error :'+error);
                    return;
                }
                alert('Successfully Updated!!');
                updateFiledsWithServerAdminData();//Refresh the filed
            });

        }

        function updateFiledsWithServerAdminData() {
            var serverAdminData = $firebaseObject(firebaseDataService.AdminUser.child(vm.AuthObj.uid)).$loaded().then(function (snapshot) {
                vm.adminUser.name= snapshot.name;
                vm.adminUser.mobile= snapshot.mobile;
            });

        }
    }

})();