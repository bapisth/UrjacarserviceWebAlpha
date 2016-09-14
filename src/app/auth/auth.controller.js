(function() {
  'use strict';

  angular
    .module('app.auth')
    .controller('AuthController', AuthController);

  AuthController.$inject = ['$location', 'authService', '$scope'];

  function AuthController($location, authService) {

    var vm = this;

    vm.error = null;

    vm.register = register;
    vm.login = login;

    /*function checkShowHide(val) {

      if (val=="login"){
        $scope.showLogin=false;
        $scope.showSignUp=true;
      }else
        $scope.showLogin=true;
      $scope.showSignUp=false;
    }*/

    function register(user) {
      return authService.register(user)
        .then(function() {
          return vm.login(user);
        })
        .then(function() {
          return authService.sendWelcomeEmail(user.email);
        })
        .catch(function(error) {
          vm.error = error;
        });
    }

    function login(user) {
      return authService.login(user)
        .then(function() {
          $location.path('/waitlist');
        })
        .catch(function(error) {
          vm.error = error;
        });
    }
  }

})();