(function () {
    'use strict';

    angular
        .module('app.dashBoard')
        .directive('urjaNavbar', urjaNavbar);

    function urjaNavbar() {
        return {
            templateUrl: 'app/dashboard/directives/navbar.html',
            restrict: 'E',
            controller: NavbarController,
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                parties: '='
            }
        };
    }

    NavbarController.$inject = ['firebaseDataService', 'authService', '$location'];

    function NavbarController(firebaseDataService, authService, $location) {
        var vm = this;
        vm.messageCount = 0;
        vm.newTransactionCounter = 0;
        vm.logout = logout;

        //Display user count if new user comes
        firebaseDataService.customer.on('value', function (data) {
            vm.messageCount += 1;
        });

        //Show New Transaction Message when Added

        firebaseDataService.AdminNotification.limitToLast(1).on("child_added", function (newMessSnapshot) {

            console.log('new record', newMessSnapshot.getKey());
            vm.newTransactionCounter += 1;

            var adminNotification = newMessSnapshot.exportVal();


            var msgListHtml = '<li>' +
                '<a href="#/transactionDetail/'+adminNotification.customerId+'">' +
                '<img src="http://placehold.it/300" alt="" class="user-face">' +
                '<strong>'+adminNotification.customerName + ' has requested new service.  <i class="icon-attachment2"></i></strong>' +
                '<span>Transaction Id :' +adminNotification.transactionId+'</span>' +
                '</a>' +
                '</li>'
            var transactionMsgWindow = angular.element(document.querySelector('#transactionMsgWindow'));
            transactionMsgWindow.prepend(msgListHtml);


        });

        /*.once("value", function(snap) {
         var keys = Object.keys(snap.val()||{});
         var lastIdInSnapshot = keys[keys.length-1];



         firebaseDataService.Transaction.orderByKey().startAt(lastIdInSnapshot).
         });*/

        function logout() {
            $location.path("/login");
            authService.logout();
        }
    }

})();


//Examples

/*var author = data.val().author || 'Anonymous';
 var containerElement = sectionElement.getElementsByClassName('posts-container')[0];
 containerElement.insertBefore(
 createPostElement(data.key, data.val().title, data.val().body, author, data.val().uid, data.val().authorPic),
 containerElement.firstChild);*/