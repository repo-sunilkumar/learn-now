(function () {
    'use strict';
    angular.module('app', ['ui.router'])
    .config(config);
    config.$inject = ['$httpProvider', '$stateProvider', '$urlRouterProvider', '$provide', '$sceDelegateProvider'];
    function config($httpProvider, $stateProvider, $urlRouterProvider, $provide, $sceDelegateProvider) {
        $stateProvider
            .state('header', {
                templateUrl: '/learningzone/app/layout/header.view.html',
                abstract: true
            })
            .state('default', {
                url: '/',
                parent: 'header',
                templateUrl: '/learningzone/app/home/home.html',
                controller: 'HomeController',
                controllerAs: 'vm'
            }).state('quiz', {
                url: '/quiz/:id/:page',
                parent: 'header',
                templateUrl: '/learningzone/app/quiz/quiz.html',
                controller: 'QuizController',
                controllerAs: 'vm'
            })
            .state('topic', {
                url: '/topic/:id/:page',
                parent: 'header',
                templateUrl: '/learningzone/app/content/content.html',
                controller: 'ContentController',
                controllerAs: 'vm'
            }).state('edit', {
                url: '/edit',
                parent: 'header',
                templateUrl: '/learningzone/app/edit/edit.html',
                controller: 'EditController',
                controllerAs: 'vm'
            }).state('edit-topic', {
                url: '/edit-topic',
                parent: 'edit',
                templateUrl: '/learningzone/app/edit/edit-topic.html'
            });

        $urlRouterProvider.otherwise('/');

        $sceDelegateProvider.resourceUrlWhitelist(['self']);

        $httpProvider.interceptors.push(['$q', '$rootScope',
        function ($q, $rootScope) {
            return {
                response: function (response) {
                    return $q.resolve(response);
                },
                responseError: function (response) {
                    return $q.reject(response);
                }
            }
        }]);

        $provide.decorator('$exceptionHandler', globalExceptionHandler);

        globalExceptionHandler.$inject = ['$delegate', '$injector'];
        function globalExceptionHandler($delegate, $injector) {
            return function (exception, cause) {
                $delegate(exception, cause);
                var errorData = {
                    exception: exception,
                };
            };
        }

        run.$inject = ['$rootScope', '$location', '$http', '$state'];
        function run($rootScope, $location, $http, $state) {
            //$http.defaults.headers.common['XSRF-TOKEN'] = $rootScope.xsrf;
        }
    }
})();

