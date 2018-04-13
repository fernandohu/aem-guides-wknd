/*
 *  Copyright 2016 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
;(function (angular, undefined) {

    "use strict";

    angular.module('weRetail')
        .service('LocationService', ['$http', '$q', function ($http, $q) {

            var locations = [];

            /** Converts numeric degrees to radians */
            if (typeof Number.prototype.toRad == 'undefined') {
                Number.prototype.toRad = function() {
                    return this * Math.PI / 180;
                }
            }

            function compareDistance(a,b) {
                if (a.distance == undefined || b.distance == undefined) return 0;
                if (a.distance < b.distance)
                    return -1;
                if (a.distance > b.distance)
                    return 1;
                return 0;
            }

            function calculateDistance(start, end) {
                var d = 0;
                if (start && end) {
                    var R = 6371;
                    var lat1 = start.lat.toRad(), lon1 = start.lng.toRad();
                    var lat2 = end.lat.toRad(), lon2 = end.lng.toRad();
                    var dLat = lat2 - lat1;
                    var dLon = lon2 - lon1;

                    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                        Math.cos(lat1) * Math.cos(lat2) *
                            Math.sin(dLon/2) * Math.sin(dLon/2);
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                    d = R * c;
                }
                return d;
            }

            function applyDistance(origin) {
                if (origin.lat && origin.lng) {
                    for (var i=0; i < locations.length; i++) {
                        var loc = locations[i];
                        loc["distance"] = calculateDistance(origin, loc.coordinates);
                    }
                }
            }

            return {

                position: undefined,
                selectedLocation: undefined,

                locations:function () {
                    return locations;
                },
                hasLocations:function () {
                    return (locations != undefined && locations.length > 0);
                },
                add:function (items) {
                    if (items == null || items == undefined) return;
                    if (!angular.isArray(items)) {
                        items = [items];
                    }
                    locations = locations.concat(items);
                },
                reset:function (items) {
                    locations = [];
                    this.add(items);
                },
                sort:function (origin) {
                    applyDistance(origin);
                    return locations.sort(compareDistance);
                },
                fetch:function(url, params) {
                    var def = $q.defer();
                    $http.get(url, {
                        params: params
                    }).success(function(data, status) {
                        locations = data.locations;
                        def.resolve(data);
                    }).error(function(data,status){
                        def.reject(data);
                    });
                    return def.promise;
                }
            };
        }
    ]);

}(angular));
