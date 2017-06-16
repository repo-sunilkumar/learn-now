
(function () {
    'use strict';

    angular
        .module('app')
        .controller('ContentController', ContentController);

    ContentController.$inject = ['$scope', '$state', 'commonService', '$sce', 'Util_Common'];
    function ContentController($scope, $state, commonService, $sce, Util_Common) {
        var vm = this;

        vm.$sce = $sce;

        initRequest();

        function initRequest() {
            vm.id = $state.params.id || -1;
            vm.pageNo = $state.params.page || 1;
            getTopics();
            getQuestions();
        }

        function getQuestions() {
            var questions = Util_Common.question.getList(vm.id, vm.pageNo, 0);
            if (questions.ques && questions.ques.length > 0) {
                vm.questionList = questions;
                return;
            }

            commonService.getQuestions(vm.id, vm.pageNo, 0).then(function (data) {
                vm.questionList = data;
                Util_Common.question.setList(vm.id, vm.pageNo, 0, data);
            });
        }

        function getTopics() {
            Util_Common.topic.getList(function (lst) { vm.topicList = lst; });
        };
    }
})();
