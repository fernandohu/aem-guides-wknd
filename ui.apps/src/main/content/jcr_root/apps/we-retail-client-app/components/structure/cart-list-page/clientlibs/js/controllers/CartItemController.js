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

    var CartItemController = function($scope, $window, $ionicModal, wishList) {

        $scope.items = wishList.items;

        $scope.$watchCollection(wishList.items, function(newList, oldList) {
            if (newList !== undefined) {
                $scope.items = newList;
            }
        });

        $scope.removeProductFromWishList = function(product) {
            var message;
            if(wishList.removeProduct(product)) {
                message = "Product " + product.title + " has been removed from your list.";
            }
        };
    };

    angular.module('weRetail')
        .controller('CartItemController', ["$scope", "$window", "$ionicModal", "wishList",
            CartItemController
        ]);

})(angular);