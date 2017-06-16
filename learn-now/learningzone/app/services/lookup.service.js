(function () {
    'use strict';
    angular.module('app')
        .factory('LookupService', LookupService);
    LookupService.$inject = ['Util_Common', 'Url', 'StorageService', '$rootScope']
    function LookupService(Util_Common, Url, StorageService, $rootScope) {
        var LookupService = {};

        
        LookupService.loading = false;
        LookupService.callback = [];

        LookupService.init = function (callback) {
            var lookupfromCache = Util_Common.localStorage.read('basicInfo', null);

            if (lookupfromCache != null) {
                LookupService.lookups = lookupfromCache.basicInfo;
                if (callback != undefined)
                    callback();

                return;
            }

            if (LookupService.loading) {
                LookupService.callback.push(callback);
                return;
            }

            LookupService.loading = true;
            LookupService.callback.push(callback);

            LookupService.getBasicInfo(function (data) {

                LookupService.loading = false;

                if (data == undefined)
                    return;

                LookupService.lookups = data;

                Util_Common.localStorage.save('basicInfo', LookupService.lookups);
                while (LookupService.callback.length > 0) {
                    var call = LookupService.callback.pop();
                    if (call != undefined)
                        call();
                }
            });
        }

        LookupService.getBasicInfo = function (callback)
        {
            var resp = Util_Common.callWebApi(Url.API_BASE + Url.BASIC_INFO);
            resp.then(function (data) {
                if (callback != undefined)
                    callback(data);
            }, function () {
                if (callback != undefined)
                    callback();
            });
        }
        return LookupService;
    };
})();