(function () {
    'use strict';
    angular.module('app')
      .directive('dirPagination', function () {
          return {
              restrict: 'E',
              scope: {
                  total: '@',
                  perpage: '=',
                  currentpage: '@',
                  topicurl: '@',
                  pagetype: '@'
              },
              link: function (scope, element, attrs) {
                  attrs.$observe('total', function (val) {
                      scope.currentpage = parseInt(scope.currentpage);
                      scope.url = scope.topicurl;
                      scope.pgs = parseInt(scope.total / scope.perpage) + 1;
                      scope.nextpage = scope.currentpage < scope.pgs ? scope.currentpage + 1 : scope.currentpage;
                  });
              },
              templateUrl: "/learningzone/app/directives/dir_Pagination.html"
          };
      }).directive('postRepeatDirective', function () {
          return {
              scope: {
                  islast: '=',
                  postaction: '&'
              },
              link: function (scope, element, attrs) {

                  if (scope.islast) {
                      if (scope.postaction && typeof scope.postaction === "function") {
                          var timer = window.setTimeout(function () {
                              scope.postaction();
                              window.clearTimeout(timer);

                          }, 500);
                      }
                  }
              }
          };
      })
})();