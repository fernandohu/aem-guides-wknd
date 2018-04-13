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

    function formatDistance(d) {
        d = d || 0;
        if (d > 1) {
            return Math.round(d) + " km";
        } else {
            d = d * 1000;
            return Math.round(d) + " m";
        }
    }

    function formatHours(h) {
        var hours = getTodayHours(h);
        return hours != null ? hours + " today" : "";
    }

    function formatOpen(state) {
        switch (state) {
            case 1:
                return "Open";
            case 2:
                return "Closing soon";
            default:
                return "Closed";
        }
    }

    function openState(h, tz) {
        var hours = getTodayHours(h);
        if (hours == null) return "";
        hours = hours.split("-");
        if (hours.length != 2) return "";
        var open = hours[0].trim(),
            close = hours[1].trim(),
            now = moment();

        open = moment.tz(open, "hh:mma", tz);
        close = moment.tz(close, "hh:mma", tz);

        if (now.isBetween(open, close)) {
            close.subtract(1, "hours");
            if (now.isBetween(open, close)) {
                return 1;
            } else {
                return 2;
            }
        }

        return 0;

    }

    function getTodayHours(h) {
        var d = new Date();
        if (angular.isArray(h)) {
            //get day of week and convert so that Monday is day 0
            var day = d.getDay() -1;
            if (day < 0) {
                day = 6;
            }
            if (day < h.length) {
                var hours = h[day].split("|");
                if (hours.length >=2) {
                    //found what we want!
                    return hours[1];
                }
            }
        }
        return null;
    }

    function LocationItemCtrl($scope, cqLocationService) {

        $scope.details = function(path) {
            cqLocationService.selectedLocation = $scope.location;
            window.location.hash = path;
        };

        $scope.open = openState($scope.location.hours, $scope.location.timeZone);

    }

    angular.module('weRetail')
        .controller('LocationItemCtrl', ["$scope", "LocationService",
            LocationItemCtrl])
        .filter('distance', function() {
            return function(input) {
                return formatDistance(input);
            }
        })
        .filter('today', function() {
            return function(input) {
                return formatHours(input);
            }
        })
        .filter('open', function() {
            return function(input) {
                return formatOpen(input);
            }
        })

    ;


}(angular));
