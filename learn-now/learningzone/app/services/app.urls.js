(function () {
    'use strict';

    angular
        .module('app')
        .constant('Url', {
            WEBAPI_BASE: 'http://localhost/learn-now-api/api/',
            API_BASE: '/learningzone/query.ashx/',
            BASIC_INFO: '?action=basicinfo',
            HOME_CONTENT: "topic",
            GET_QUESTIONS: "?action=GetQuestions",
            GET_ALL_QUESTIONS: "?action=GetAllQuestions",
            SAVE_QUESTION: "question/SaveQuestion"
        });
})();