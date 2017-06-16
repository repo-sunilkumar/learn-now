(function () {
    'use strict';

    angular
        .module('app')
        .factory('commonService', commonService);

    commonService.$inject = ['$http', '$rootScope', '$q', 'Url', 'Util_Common'];
    function commonService($http, $rootScope, $q, Url,Util_Common) {

        var common =
            {
                getItems: function() {
                    return Util_Common.callWebApi(Url.API_BASE + Url.ITEMS);
                },
                getTopics: function() {
                    return Util_Common.callWebApi(Url.WEBAPI_BASE  + Url.HOME_CONTENT + "&data1=1");
                },
                getQuestions: function(topicId, pageNo, quesType) {
                    return Util_Common.callWebApi(Url.API_BASE + Url.GET_QUESTIONS + "&Data1=" + topicId + "&Data2=" + pageNo + "&Data3=" + quesType);
                },
                getAllQuestions: function(topicId) {
                    return Util_Common.callWebApi(Url.API_BASE + Url.GET_ALL_QUESTIONS + "&Data1=" + topicId);
                },
                saveQuestion: function (inputDTO) {
                    return Util_Common.callWebApi(Url.WEBAPI_BASE +  Url.SAVE_QUESTION,"POST",inputDTO);
                },

            };

        return common;

        

        

        

        
        
    }
})();