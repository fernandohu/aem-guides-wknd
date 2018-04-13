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
    .controller('LocationDetailsCtrl', ["$scope", "$window", "$timeout", "cqDeviceUtils", "LocationService", "StorageService",
        function($scope, $window, $timeout, cqDeviceUtils, cqLocationService, StorageService) {


            $scope.myStore = false;

            if ($window.plugin && $window.plugin.google) {
                var map = plugin.google.maps.Map.getMap();
                map.addEventListener(plugin.google.maps.event.MAP_READY, onMapInit);
            }

            function onMapInit(map) {
                $scope.map = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var coords = $scope.location.coordinates,
                        target = new plugin.google.maps.LatLng(coords.lat, coords.lng);
                    map.moveCamera({
                        'target': target,
                        'tilt': 0,
                        'zoom': 15
                    });
                    map.showDialog();
                };
            }

            $scope.init = function(dataName) {
                if (!cqLocationService.selectedLocation) {
                    //Watch page scope for store location
                    $scope.$watch(dataName, function(newValue) {
                        if (newValue) {
                            cqLocationService.add(newValue);
                            cqLocationService.selectedLocation = newValue;
                            buildScope();
                        }
                    }, true);
                } else {
                    //Use selected location from location service
                    buildScope();
                }
            };

            $scope.phone = function(e) {
                window.open("tel:" + $scope.location.phone, '_system');
                e.preventDefault();
                e.stopPropagation();
            };

            $scope.directions = function(e) {
                var dest = $scope.location;
                var dcoords = dest.coordinates.lat + "," + dest.coordinates.lng;

                // Open the device's map application with the current location as the destination
                var url;
                if (cqDeviceUtils.isiOS()) {
                    url = "maps:daddr=" + dcoords;
                } else if (cqDeviceUtils.isAndroid()) {
                    url = "geo:" + dcoords;
                }
                if (url) {
                    window.open(url , '_system');
                } else {
                    console.log("Unable to open native maps app");
                }
                e.preventDefault();
                e.stopPropagation();
            };

            $scope.phone = function(e) {
                window.open("tel:" + $scope.location.phone, '_system');
                e.preventDefault();
            };

            $scope.saveStore = function(value) {
                if (!value) {
                    StorageService.remove("myStore");
                } else {
                    StorageService.save("myStore", $scope.location);
                }
            };

            function buildScope() {
                $scope.location = cqLocationService.selectedLocation;
                if ($scope.location) {
                    $scope.location.formattedHours = formatHours($scope.location.hours);

                    if ($scope.location.coordinates) {
                        $scope.origin = $scope.location.coordinates;
                        $scope.showMap = true;

                        var savedStore = StorageService.fetch("myStore");
                        if (savedStore) {
                            var coords = savedStore.coordinates;
                            $scope.myStore = (coords.lat == $scope.origin.lat && coords.lng == $scope.origin.lng);
                        }
                    }
                }
            }

            /**
             * Convert [Monday|9:00-5:00,...] to [{day: Monday, time: 9:00-5:00},...]
             */
            function formatHours(hours) {
                var newHours = [];
                if (hours && angular.isArray(hours)) {
                    for (var i=0; i < hours.length; i++) {
                        var hour = hours[i];
                        if (angular.isObject(hour)) {
                            continue;
                        }
                        var hourList = hour.split("|"),
                            day = "";
                        if (hourList.length > 1) {
                            day = hourList.splice(0,1)[0];
                        }
                        hour = hourList.join(" ");
                        newHours.push({day: day, time: hour});
                    }
                }
                return newHours;
            }

        }
    ])
    .filter('coordinates', function() {
        function formatCoordinates(coords) {
            var lat = coords.lat;
            var lng = coords.lng;
            var latResult, lngResult, dmsResult;

            lat = parseFloat(lat);
            lng = parseFloat(lng);

            latResult = getDms(lat);
            latResult += " " + (lat >= 0)? 'N' : 'S';

            lngResult = getDms(lng);
            lngResult += " " + (lng >= 0)? 'E' : 'W';

            dmsResult = latResult + ' / ' + lngResult;
            return dmsResult;
        }
        function getDms(val) {

            var valDeg, valMin, valSec, result;

            val = Math.abs(val);

            valDeg = Math.floor(val);
            result = valDeg + "º";

            valMin = Math.floor((val - valDeg) * 60);
            result += valMin + "'";

            return result;
        }
        return function(input) {
            return formatCoordinates(input);
        }
    })
    .filter('phonenumber', function() {
        function formatPhone(phone) {
            var regexObj = /^(?:\+?1[-. ]?)?(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})$/;
            if (regexObj.test(phone)) {
                var parts = phone.match(regexObj);
                var formatted = "";
                if (parts[1]) {
                    formatted += "(" + parts[1] + ") ";
                }
                formatted += parts[2] + "-" + parts[3];
                return formatted;
            }
            else {
                //invalid phone number
                return phone;
            }
        }

        return function(input) {
            return formatPhone(input);
        }
    })
    ;

})(angular);