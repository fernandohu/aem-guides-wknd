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

    var ProfileCtrl = function($scope, AuthService, ProfileService, AEMServerService) {

        $scope.isLoggedIn = false;
        $scope.imageUrl = "";
        $scope.fullName = "";
        $scope.email = "";

        $scope.$watch(function() {
            return AuthService.isLoggedIn;
        }, function(isLoggedIn) {
            $scope.isLoggedIn = isLoggedIn || false;
        });

        $scope.$watch(
            function() {
                return ProfileService.userProfile;
            },
            function(profile) {
                if (profile) {
                    var givenName  = profile['givenName'] || '',
                        familyName = profile['familyName'] || '',
                        path       = profile['path'] || '',
                        email      = profile['email'];

                    // this could be moved into the ProfileService however, it's pretty simple to
                    // pull the values from the profile and generate what the UI needs
                    $scope.fullName = givenName + " " + familyName;
                    $scope.email    = email;
                    AEMServerService.getServer().then(function(server) {
                        $scope.imageUrl = server + path + '/photos/primary/image';
                    });
                }
            },
            true
        );
    };

    angular.module('weRetail')
        .controller('ProfileCtrl', ['$scope', 'AuthService', 'ProfileService', 'AEMServerService', ProfileCtrl]);

}(angular));