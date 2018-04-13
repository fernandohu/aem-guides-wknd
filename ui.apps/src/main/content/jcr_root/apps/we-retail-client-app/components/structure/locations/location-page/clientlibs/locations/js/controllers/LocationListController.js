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

    var settings = {
            locationURI: "",
            sensor: false,
            offline: false,
            mapHeight: 0
        };

    function LocationListCtrl($window, $scope, $timeout, $ionicScrollDelegate, $ionicLoading, cqDeviceUtils, cqMapUtils, toaster, LocationService, StorageService) {

        /**
         * Sort the locally provided location list or fetch a sorted list from server
         */
        function sortLocations() {
            if (settings.offline) {
                //Use local locations
                if (!$scope.origin) {
                    $scope.locations = LocationService.locations();
                } else {
                    $scope.locations = LocationService.sort($scope.origin);
                }
                $scope.$apply();
            } else {
                //Fetch locations from server
                if (cqDeviceUtils.isConnected()) {
                    var options = {};
                    if ($scope.origin) {
                        options.data = {lat: $scope.origin.lat, lng: $scope.origin.lng};
                    } else if ($scope.query) {
                        options.data = {q: $scope.query};
                    }
                    if (!options.data) return;
                    LocationService.fetch(settings.locationURI, options.data)
                        .then(function(data) {
                            if (data.origin) {
                                $scope.origin = data.origin.coordinates;
                            }
                            $scope.locations = LocationService.locations();
                        });
                } else {
                    toaster.pop("No connection");
                }
            }
        }

        $scope.init = function(dataName) {
            // Defer location loading for 300ms
            $timeout(function() {
                // Combine default settings with scope
                settings = angular.extend({}, settings, $scope.$eval(dataName));

                $scope.$watchCollection(dataName+".locations", function(newValue) {
                    if (!LocationService.hasLocations()) {
                        LocationService.reset(newValue);
                    }
                    $scope.locate();
                }, true);
            }, 300);
        };

        $scope.scrollTop = function() {
            $ionicScrollDelegate.scrollTop();
        };

        $scope.scrollBottom = function() {
            $ionicScrollDelegate.scrollBottom();
        };

        $scope.clearSearch = function() {
            $scope.query = "";
        };

        $scope.details = function(location, path) {
            LocationService.selectedLocation = location;
            if (cordova && cordova.plugins && cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.close();
            }
            window.location.hash = path;
        };

        $scope.showMap = false;
        $scope.origin = null;
        $scope.locations = null;
        $scope.myStoreList = [];

        $scope.toggleMap = function(active) {
            $scope.showMap = active;
            $scope.scrollTop();
        };

        $scope.locate = function(forceLocation) {
            $scope.origin = null;
            //Determine device location
            if (!$scope.query) {
                if (!forceLocation) {
                    //use cached location
                    $scope.origin = LocationService.position;
                }
                if (!$scope.origin) {
                    //use geolocation
                    $ionicLoading.show();
                    cqDeviceUtils.getPosition(function(position) {
                        $scope.origin = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        LocationService.position = $scope.origin;
                        $ionicLoading.hide();
                        sortLocations();
                    }, function(error){
                        if (error.POSITION_UNAVAILABLE == error.code || error.PERMISSION_DENIED == error.code) {
                            console.log("Please enable location services and try again.");
                        } else {
                            console.log('Location error code: ' + error.code + '\n'+ 'message: ' + error.message);
                        }
                        $ionicLoading.hide();
                        toaster.pop("Location unavailable");
                        sortLocations();
                    });
                } else {
                    $timeout(sortLocations);
                }
            } else {
                if (settings.offline) {
                    if (google && cqDeviceUtils.isConnected()) {
                        //geocode the query on client
                        var geocoder = new google.maps.Geocoder();
                        $ionicLoading.show();
                        console.log("Searching for location...");
                        geocoder.geocode( { 'address': $scope.query}, function(results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                var result = results[0];
                                toaster.pop("Location set to: " + cqMapUtils.getAddressName(result.address_components, "locality"));
                                $scope.origin = cqMapUtils.fromLatLng(result.geometry.location);
                                LocationService.position = $scope.origin;
                                sortLocations();
                            } else {
                                console.log('Geocode was not successful for the following reason: ' + status);
                                toaster.pop("Location not found");
                            }
                            $ionicLoading.hide();
                        });
                    } else {
                        toaster.pop("No connection");
                    }
                } else {
                    $timeout(sortLocations);
                }
            }
        };
    }

    angular.module('weRetail')
        .controller('LocationListCtrl',
            ["$window", "$scope", "$timeout", "$ionicScrollDelegate", "$ionicLoading", "cqDeviceUtils", "cqMapUtils", "cqToastService", "LocationService", "StorageService",
                LocationListCtrl])
        .filter('myStore', ["StorageService", function(StorageService) {
            return function(items) {
                var filtered = [],
                    myStore = StorageService.fetch("myStore");
                if (!myStore || !items) {
                    return filtered;
                }
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (myStore.coordinates.lat == item.coordinates.lat &&
                        myStore.coordinates.lng == item.coordinates.lng) {
                        filtered.push(item);
                    }
                }
                return filtered;
            }
        }])
        .directive('weMap', ['$window', '$timeout', 'phonegapReady', 'cqMapUtils', function($window, $timeout, phonegapReady, cqMapUtils) {

            function link(scope, element, attrs) {

                var map,
                    markerList = [],
                    mapOptions = {};

                var markerHandlers = cqMapUtils.getEventHandlers(attrs, "info"); // map events -> handlers

                if ($window.plugin && $window.plugin.google) {
                    // Defer map loading for 1 second
                    $timeout(function() {
                        initMap();
                    }, 1000);
                }

                function initMap() {

                    //zoom as attribute
                    if(attrs.zoom && parseInt(attrs.zoom)) {
                        mapOptions.zoom = parseInt(attrs.zoom) || 12;
                    }
                    //maptype as attribute
                    if(attrs.maptype){
                        switch(attrs.maptype.toLowerCase()){
                            case 'hybrid':
                                mapOptions.mapType = plugin.google.maps.MapTypeId.HYBRID;
                                break;
                            case 'satellite':
                                mapOptions.mapType = plugin.google.maps.MapTypeId.SATELLITE;
                                break;
                            case 'terrain':
                                mapOptions.mapType = plugin.google.maps.MapTypeId.TERRAIN;
                                break;
                            case 'roadmap':
                            default:
                                mapOptions.mapType = plugin.google.maps.MapTypeId.ROADMAP;
                                break;
                        }
                    }

                    //Get map instance
                    if (!map) {
                        map = plugin.google.maps.Map.getMap(element[0], mapOptions);
                        map.on(plugin.google.maps.event.MAP_READY, onMapInit);
                        map.on(plugin.google.maps.event.MAP_CLOSE, function() {
                            map.setDiv(element[0]);
                        });
                    } else {
                        map.setOptions(options);
                    }

                    function onMapInit() {

                        //
                        // Watches
                        //
                        if (attrs.hasOwnProperty("center")) {
                            updateCenter(scope.center);
                            scope.$watch('center', function (newValue) {
                                updateCenter(newValue);
                            }, true);
                        }

                        if (attrs.hasOwnProperty("markers")) {
                            updateMarkers(scope.markers);
                            scope.$watch("markers", function(newMarkers) {
                                updateMarkers(newMarkers);
                            }, true);
                        }

                        if (attrs.hasOwnProperty("refresh")) {
                            if (scope.refresh) {
                                resizeMap();
                            }
                            scope.$watch("refresh", function(value) {
                                if (value) {
                                    resizeMap();
                                }
                            }, true);
                        }

                    }
                }

                function updateCenter(latLng) {
                    latLng = objToLatLng(latLng);
                    clearMarkers(scope.$id+"-center");
                    if (latLng) {
                        map.moveCamera({
                            'target': latLng,
                            'zoom': mapOptions.zoom,
                            'tilt': 30
                        });
                    }
                }

                function objToLatLng(obj) {
                    var lat,lng;
                    if (obj instanceof  plugin.google.maps.LatLng) {
                        return obj;
                    }
                    if (angular.isObject(obj)) {
                        lat = obj.lat || obj.latitude || null;
                        lng = obj.lng || obj.longitude || null;
                    } else if (angular.isString(obj)) {
                        obj = obj.split(",");
                        if (angular.isArray(obj) && obj.length == 2) {
                            lat = parseFloat(obj[0]) || null;
                            lng = parseFloat(obj[1]) || null;
                        }
                    }

                    var ok = !(lat == null || lng == null) && !(isNaN(lat) || isNaN(lng));
                    if (ok) {
                        return new plugin.google.maps.LatLng(lat, lng);
                    }
                    return null;
                }

                function updateMarkers(markers) {
                    clearMarkers(scope.$id);
                    if (markers) {
                        if (!angular.isArray(markers)) {
                            markers = [markers];
                        }

                        //Add current location of user
                        var onSuccess = function(location) {
                            map.addMarker({
                                'position': location.latLng,
                                'icon': 'blue',
                            }, function(marker) {
                                marker.showInfoWindow();
                            });
                        };

                        var onError = function(error) {
                            navigator.notification.alert(error, null, 'Error Getting Location');
                        };
                        map.getMyLocation(onSuccess, onError);

                        //Add new markers to map
                        angular.forEach(markers, function(location, i) {
                            var latlng = objToLatLng(location.coordinates || location);
                            map.addMarker({
                                'position': latlng,
                                'title': location.name,
                                'snippet': location.address
                            }, function(marker) {
                                var id = marker.getId();
                                if (id) {
                                    if (markerList[scope.$id] == null) {
                                        markerList[scope.$id] = {};
                                    }
                                    markerList[scope.$id][id] = {marker:marker, location:location};
                                }
                                angular.forEach(markerHandlers, function(handler, event) {
                                    marker.addEventListener(plugin.google.maps.event.INFO_CLICK, function() {
                                        $timeout(function() {
                                            handler(scope.$parent, {
                                                object: location,
                                                marker: marker
                                            });
                                        });
                                    });
                                });


                            });
                        });
                    }
                }

                function clearMarkers (scopeId) {
                    if (markerList[scopeId] != null) {
                        angular.forEach(markerList[scopeId], function(object, i) {
                            if (object) {
                                object.marker.remove();
                            }
                        });
                        markerList[scopeId] = null;
                        delete markerList[scopeId];
                    }
                }

                function resizeMap() {
                    map.refreshLayout();
                }

            }

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    center: '=',
                    markers: '=',
                    positions: '=',
                    refresh: '=',
                    mapOptions: '&'
                },
                template: "<div></div>",
                link: link
            };
        }])
    ;

}(angular));
