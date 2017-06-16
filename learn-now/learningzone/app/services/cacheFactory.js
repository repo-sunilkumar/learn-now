(function () {
    "use strict";
    angular.module('app').factory("cacheFactory", function () {
        var cacheStorage =
            {
                cacheEntity: {},
                storageLocation: 'sessionStorage',
                get: function (key, defaultValue) {
                    if (Object.keys(this.cacheEntity).length === 0) {
                        this.load();
                    }

                    var val = this.cacheEntity[key];
                    if (val) {
                        return val;
                    }
                    return defaultValue || null;
                },
                set: function (key, value) {
                    this.cacheEntity[key] = value;
                    this.save();
                },
                append: function (key, value) {
                    var currentValue = this.cacheEntity[key] || [];
                    angular.forEach(value, function (val) {
                        if (!cacheStorage.containsObject(val, currentValue)) {
                            currentValue.push(val);
                        }
                    });

                    this.set(key, currentValue);
                },
                save: function () {
                    if (window[this.storageLocation]) {
                        window[this.storageLocation].setItem('infonexusCache', JSON.stringify(this.cacheEntity));
                        this.load();
                    }
                },
                load: function () {
                    if (window.sessionStorage) {
                        this.cacheEntity = JSON.parse(window[this.storageLocation].getItem('infonexusCache')) || {};
                    }
                },
                containsObject: function (obj, list) {
                    return list.filter(function (listItem) {
                        return angular.equals(listItem, obj)
                    }).length > 0;
                }
            };
        return cacheStorage;
    });
}());