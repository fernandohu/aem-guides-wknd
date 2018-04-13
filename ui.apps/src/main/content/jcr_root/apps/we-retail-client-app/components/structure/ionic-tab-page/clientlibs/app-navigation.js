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
;(function (angular, contentUpdate, contentPackageSwitcher, undefined) {

    'use strict';

    /**
     * Module to handle general navigation in the app
     */
    angular.module( 'cqAppNavigation', ['ionic', 'irisnet.phonegap'] )

        .controller( 'AppNavigationController', ['$scope', '$window', '$location', '$timeout', 'deviceready', 'AuthService', 'ProfileService', 'TargetService', '$rootElement', '$rootScope', 'AEMServerService',
            function( $scope, $window, $location, $timeout, deviceready, AuthService, ProfileService, TargetService, $rootElement, $rootScope, AEMServerService) {

                $scope.updating = false;
                var authToken;

                //set the target service data mapping object
                TargetService.setMapping({
                    'gender' : 'profile.gender'
                });

                // this should not be required if we move to using resolve on the states
                deviceready().then(function() {
                    AuthService.login(true).then(function() {

                        AuthService.getAuth().getToken(function(error, token) {
                            authToken = token;

                            ProfileService.loadProfile().then(
                                function(profileData){
                                    processProfile(profileData);
                                    TargetService.setData(profileData);
                                },
                                function() {
                                    console.error("Unable to load user profile information");
                                }
                            );
                        });
                    });
                });

                // Request headers for Content Sync
                var reqHeaderObject = {
                    // Basic auth example:
                    //Authorization: "Basic " + btoa("username:password")
                };

                // Use app name as ContentSync package ID
                var appName = $rootElement.attr('ng-app');
                var contentUpdater = contentUpdate({
                    id: appName,
                    requestHeaders: reqHeaderObject,
                    // Indicate that self-signed certificates should be trusted
                    // should be set to `false` in production.
                    trustAllHosts: false
                });

                // Make platform available to $scope for setting tab spacing on Android
                $scope.platform = ionic.Platform;

                /**
                 * Handle navigation to app pages
                 */
                $scope.go = function( path, trackingTitle, transitionDirection, $event ) {
                    $event.stopPropagation();
                    window.location.hash = path;
                };


                /**
                 * Handle navigation to product pages
                 */
                $scope.goProduct = function( templatePath, skuPrefix, productName ) {
                    window.location.hash = templatePath + '/' + skuPrefix + '/' + productName

                    console.log( '[nav] app navigated to library item: [' + productName + '].' );
                };

                /**
                 * Trigger an app update
                 */
                $scope.updateApp = function() {
                    // don't start updating again if we're already updating.
                    if($scope.updating) return;

                    // Check if an update is available
                    contentUpdater.isContentPackageUpdateAvailable($scope.contentPackageName,
                        function callback(error, isUpdateAvailable) {
                            if (error) {
                                // Alert the error details.
                                return navigator.notification.alert(error, null, 'Content Update Error');
                            }

                            if (isUpdateAvailable) {
                                // Confirm if the user would like to update now
                                navigator.notification.confirm('Update is available, would you like to install it now?',
                                    function onConfirm(buttonIndex) {
                                        if (buttonIndex == 1) {
                                            // user selected 'Update'
                                            $scope.updating = true;
                                            contentUpdater.updateContentPackageByName($scope.contentPackageName,
                                                function callback(error, pathToContent) {
                                                    if (error) {
                                                        return navigator.notification.alert(error, null, 'Error');
                                                    }
                                                    // else
                                                    console.log('Update complete; reloading app.');
                                                    window.location.reload( true );
                                                });
                                        }
                                        else {
                                            // user selected Later
                                            // no-op
                                        }
                                    },
                                    'Content Update',       // title
                                    ['Update', 'Later'] // button labels
                                );
                            }
                            else {
                                navigator.notification.alert('App is up to date.', null, 'Content Update', 'Done');
                            }
                        }
                    );
                };

                /**
                 * Switch to an alternate content package
                 */
                $scope.switchContentPackage = function(packageName) {
                    var spec = {
                        id: appName, 
                        name: packageName
                    };
                    var switcher = contentPackageSwitcher(spec);
                    switcher.usePackage();
                };

                /**
                 * Record analytics data for state changes
                 */
                $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams) {
                    var trackingTitle = toState.trackingTitle || toParams.name || toState.url;
                    if (window.ADB) {
                        ADB.trackState(trackingTitle, {});
                    }
                });

                // Store scroll position for each page
                var scrollPositions = {};
                $scope.setScrollPosition = function(path, scrollTopPosition) {
                    scrollPositions[path] = scrollTopPosition;
                };
                $scope.getScrollPosition = function(path) {
                    var scrollPosition = scrollPositions[path] || 0;
                    return scrollPosition;
                };

                // Store slider position for each slider page
                var sliderIndexes = {};
                $scope.setSliderIndex = function(path, sliderIndex) {
                    sliderIndexes[path] = sliderIndex;
                };
                $scope.getSliderIndex = function(path) {
                    var sliderIndex = sliderIndexes[path] || 0;
                    return sliderIndex;
                };

                function getFullLibraryPagePath( base, skuPrefix, name ) {
                    return base + '/' + skuPrefix + '/' + name;
                }

                var loadProfileImage = function(path) {

                    AEMServerService.getServer().then(function(server) {
                        var profileImageUrl = server + path + '/photos/primary/image';
                        var headers = {
                            "Authorization": "Bearer " + authToken
                        };

                        var sync = ContentSync.sync({
                            id: '1',
                            type: "local",
                            src: profileImageUrl,
                            headers: headers
                        });

                        sync.on('complete', function(entry) {
                            $scope.imageUrl = "file://" + entry.localPath;
                            $scope.$apply();
                        });

                        sync.on('error', function(error) {
                            console.error('[more-page-controller] Error loading profile image from server: ["%s"]', + error);
                        });
                    });
                };

                var collectPII = function(profile) {
                    // if a collectPII postback has been configured in AMS, collect any relevant PII
                    // from the user's profile
                    if (window.ADB) {
                        window.ADB.collectPII({
                            userKey: profile.user.authorizableId || profile.email,
                            email: profile.email,
                            firstName: profile.givenName,
                            lastName: profile.familyName
                        }, function win() {
                            console.log('[we-retail][Campaign] collectPII success');
                        }, function fail(error) {
                            console.error('[we-retail][Campaign] error: ' + error);
                        });
                    }
                };

                var processProfile = function(profileData) {
                    $scope.profile = profileData;

                    if (profileData) {
                        var givenName  = profileData['givenName'] || '',
                            familyName = profileData['familyName'] || '',
                            path       = profileData['path'] || '',
                            email      = profileData['email'];

                        // this could be moved into the ProfileService however, it's pretty simple to
                        // pull the values from the profile and generate what the UI needs
                        $scope.fullName = givenName + " " + familyName;
                        $scope.email    = email;

                        loadProfileImage(path);
                        collectPII(profileData);
                    }
                };
            }
        ]
    );
})(angular, CQ.mobile.contentUpdate, weRetailClient.contentPackageSwitcher);