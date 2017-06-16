(function () {
    'use strict';
    angular
        .module('app')
        .controller('EditController', EditController)

    EditController.$inject = ['$scope', '$state', 'Util_Common', 'commonService', '$sce'];
    function EditController($scope, $state, Util_Common, commonService, $sce) {
        var vm = this;
        vm.topicList = [];
        vm.getQuestions = getQuestions;
        vm.editQuestion = editQuestion;
        initRequest();

        function initRequest() {
            vm.id = $state.params.id || -1;
            getTopics();
        }

        function getTopics() {
            commonService.getTopics(vm.id).then(function (data) {
                vm.topicList = data;
                vm.inputTopic = vm.topicList[0].id;
                getQuestions();
                InitCleditor();

            });
        }

        function getQuestions() {
            commonService.getAllQuestions(vm.inputTopic).then(function (data) {
                vm.questionList = data.ques;
            });
        }

        function editQuestion(ques) {
            vm.inputId = ques.id;
            vm.inputQuestion = ques.q;
            vm.inputAnswer = ques.a;
            setTimeout(function () {
                $(window).resize();
            }, 200);
        }

        vm.saveQuestion = function () {
            var inputDTO = {
                id: vm.inputId,
                ques: vm.inputQuestion,
                ans: $("#txtAnswer").val(),
                topic: vm.inputTopic
            };

            commonService.saveQuestion(inputDTO).then(function (data) {

            });
            
            console.log(inputDTO);
        }


        function InitCleditor() {
            var HTMLEDITCONT = "bold italic underline strikethrough subscript superscript | font size style | color highlight removeformat | undo redo | link unlink | cut copy paste pastetext | print source";
            try {
                $("#txtAnswer").cleditor({ width: '100%', height: 350, useCSS: true });
            }
            catch (e)
            { }
        }
    }
})();
