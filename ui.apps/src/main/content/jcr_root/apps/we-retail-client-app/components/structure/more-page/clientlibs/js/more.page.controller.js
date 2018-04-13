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

    var MorePageCtrl = function($scope, $timeout, auth, profile, $ionicLoading, AuthService, AEMServerService, ProfileService, TargetService) {
        var authToken;

        if (window.cordova && AuthService.getAuth()) {
            AuthService.getAuth().getToken(function(error, token) {
                authToken = token;
            });
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

        $scope.isLoggedIn = auth.isLoggedIn;
        processProfile(profile);

        $scope.signIn = function() {
            // only perform logins while on the device running within cordova
            if (window.cordova) {
                $ionicLoading.show();

                AuthService.login()
                    .then(function() {
                        $scope.isLoggedIn = true;

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

                    }, function(error) {
                        $scope.isLoggedIn = false;

                        // need to hide if there is a config error
                        $ionicLoading.hide();

                        navigator.notification.alert(error);
                    }, function() {

                        // we can hide when we've been notified
                        $ionicLoading.hide();
                    });
            }
        };
    };

    angular.module('weRetail')
        .controller('MorePageCtrl', [
                '$scope', '$timeout', 'auth', 'profile', '$ionicLoading', 'AuthService', 'AEMServerService', 'ProfileService', 'TargetService',
                MorePageCtrl
            ]
        );

}(angular));