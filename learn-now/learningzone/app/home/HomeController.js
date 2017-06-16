(function () {
    'use strict';
    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', '$state', 'Util_Common'];
    function HomeController($scope, $state, Util_Common) {
        var vm = this;
        vm.topicList = [];
        initRequest();

        function initRequest() {
            vm.id = $state.params.id || -1;
            getHomeContent();
        }

        function getHomeContent() {
            Util_Common.topic.getList(function (data) {
                vm.topicList = data;
            });
        }
    }
})();
