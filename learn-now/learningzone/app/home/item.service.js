(function () {
    'use strict';

    angular
        .module('app')
        .factory('itemService', itemService);

    itemService.$inject = ['$http', 'Url', '$rootScope', 'StorageService', '$q', 'Util_Common', 'Util_Content'];
    function itemService($http, Url, $rootScope, StorageService, $q, Util_Common, Util_Content) {

        var headerTokens = {};
        var service = {
            getItems: getItems,
            getItem: getItem,
            getVersions: getVersions,
            
            saveItem: saveItem,
            deleteItem: deleteItem,
            
            saveItemUnitMapping: saveItemUnitMapping,
            saveItemTrackMapping: saveItemTrackMapping,
            saveItemCourseMapping: saveItemCourseMapping,
            getDataForItemUnitMapping: getDataForItemUnitMapping,
            getDataForItemCourseMapping: getDataForItemCourseMapping,
            saveItemUnitSequence: saveItemUnitSequence,
            saveItemCourseSequence: saveItemCourseSequence,
            createVersion: createVersion,
            saveMultilingual: saveMultilingual,
            getFlag: getFlag,
        };

        return service;

        //////////////

        function getFlag(guid, contentType) {
            return Util_Common.callWebApi(Url.API_BASE + Url.CONTENT + "/" + guid + "?contentType=" + contentType);
        }

        function getItems() {
            return Util_Common.callWebApi(Url.API_BASE + Url.ITEMS);
        }

        function getItem(id) {
            return Util_Common.callWebApi(Url.API_BASE + Url.ITEMS + "/" + id);
        }

        function getVersions(id) {
            var url = Url.ITEMS; 
            return Util_Common.callWebApi(Url.API_BASE + url + "?code=" + id);
        }

        

        function saveItem(item, id, action) {
            var method = Util_Content.getMethodName(action);
            return Util_Common.callWebApi(Url.API_BASE + Url.ITEMS, method, item);
        }

        function deleteItem(id) {
            return Util_Common.callWebApi(Url.API_BASE + Url.ITEMS + "/" + id, "DELETE");
        }

        function saveItemUnitMapping(mapObj, action) {
            var method = Util_Content.getMethodName(action);
            return Util_Common.callWebApi(Url.API_BASE + Url.ITEM_UNIT_ASSIGNMENT, method, mapObj);
        }

        function saveItemTrackMapping(mapObj, action) {
            var method = Util_Content.getMethodName(action);
            return Util_Common.callWebApi(Url.API_BASE + Url.ITEM_TRACK_ASSIGNMENT, method, mapObj);
        }

        function saveItemCourseMapping(mapObj, action) {
            var method = Util_Content.getMethodName(action);
            return Util_Common.callWebApi(Url.API_BASE + Url.ITEM_COURSE_ASSIGNMENT, method, mapObj);
        }

        function getDataForItemUnitMapping(id) {
            return Util_Common.callWebApi(Url.API_BASE + Url.ITEM_UNIT_ASSIGNMENT + "/" + id);
        }

        function getDataForItemCourseMapping(id) {
            return Util_Common.callWebApi(Url.API_BASE + Url.ITEM_COURSE_ASSIGNMENT + "/" + id);
        }

        function saveItemUnitSequence(mapObj) {
            return Util_Common.callWebApi(Url.API_BASE + Url.UNIT_ITEM_ASSIGNMENT, "POST", mapObj);
        }

        function saveItemCourseSequence(mapObj) {
            return Util_Common.callWebApi(Url.API_BASE + Url.ITEM_COURSE_ASSIGNMENT, "POST", mapObj);
        }

        function createVersion(code, obj, action) {
            var method = Util_Content.getMethodName(action);
            if (method == "undefined") {
                method = "POST";
            }
            return Util_Common.callWebApi(Url.API_BASE + Url.CREATE_VERSION + "/?code=" + code, method, obj);
        }

        function saveMultilingual(guid, obj)
        {
            return Util_Common.callWebApi(Url.API_BASE + Url.ITEMS + "?guid=" + guid, "POST", obj);
        }

        function getAllTests() {
            return Util_Common.callWebApi(Url.API_BASE + Url.TESTS);
        }

        //////////////////
    }
})();