(function () {
    'use strict';
    angular.module('app')
        .factory('Util_Common', Util_Common);

    Util_Common.$inject = ['$http', 'Url', '$state', '$rootScope', '$q', 'cacheFactory'];
    function Util_Common($http, Url, $state, $rootScope, $q, cacheFactory) {
        var common = {};

        common.topicList = [];
        common.questionList = [];

        common.topic = {
            setList: function (lst) {
                common.topicList = lst;
                cacheFactory.set('topics', lst);
            },
            getList: function (callback) {
             
                var lst = cacheFactory.get('topics', []);
                if (lst.length > 0) {
                    callback(lst);
                    return;
                }

                common.callWebApi(Url.API_BASE + Url.HOME_CONTENT + "&data1=1").then(function (data) {
                    lst = data;
                    cacheFactory.set('topics', lst);
                }).finally(function () {
                    callback(lst);
                });
            }
        };

        common.question = {
            key: function (url, pageNo, quesType) { return 'questions-' + url + "-" + pageNo + "-" + quesType; },
            setList: function (url, pageNo, quesType, lst) {

                if (common.questionList.length > 25) {
                    common.questionList.splice(0, 20);
                }

                var key = this.key(url, pageNo, quesType);
                common.questionList[key] = lst;
                cacheFactory.set(key, lst);
            },
            getList: function (url, pageNo, quesType) {
                var key = this.key(url, pageNo, quesType);
                return cacheFactory.get(key, []);
            }
        };


        common.callWebApi = function (url, method, data) {
            /* RESULT - Calls WEB API. This is common function to hit API from anywhere.

             url - URL of the API to hit
             method - method type of request (GET/POST/PUT/DELETE)
             data - data to be posted with the request
             */


            method = method || 'GET';
            data = data || '';

            var deferred = $q.defer();
            var req = { method: method, url: url, data: data };

            $rootScope.promise = $http(req).success(function (response) {

                deferred.resolve(response);
            }).error(function (response, statusCode) {
                switch (statusCode) {
                    case 404:
                        response = { items: [] };
                        deferred.resolve(response);
                        break;
                    default:
                        if (response)
                            common.showAlert("Error", response.message || '');

                        deferred.reject(response);
                        break;
                }
            });
            return deferred.promise;
        }

        return common;
    }
})();



