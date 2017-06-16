
(function () {
    'use strict';

    angular
        .module('app')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['$scope', '$rootScope','$sce', '$state'];
    function HeaderController($scope, $rootScope, $sce, $state) {
        var vm = this;

        vm.menuRow1 = [
            { 'label': 'Infonexus', state : 'default' },
            { 'label': 'Courses', state: 'edit-topic' },
            { 'label': 'Interview Questions', state: 'default' },
        ];
    }
})();
