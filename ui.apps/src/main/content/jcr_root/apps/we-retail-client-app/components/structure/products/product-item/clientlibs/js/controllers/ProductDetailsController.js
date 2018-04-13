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

    var ProductDetailsController = function($scope, $window, $ionicModal, wishList) {

        $scope.detailsOpen = false;
        $scope.isWishListItem = false;
        $scope.store = JSON.parse(localStorage.getItem('we.retail.myStore'));

        $scope.$watch('product', function(newProduct, oldProduct) {
            if (newProduct) {
                $scope.isWishListItem = wishList.isWishListProduct($scope.product);
            }
        });

        $scope.callStore = function() {
            window.open("tel:" + $scope.store.phone, '_system');
        };

        $scope.$watchCollection(function() {
            return wishList.getWishList();
        }, function(newList, oldList) {
            if (newList && $scope.product) {
                $scope.isWishListItem = wishList.isWishListProduct($scope.product);
            }
        });

        $ionicModal.fromTemplateUrl('product-item-modal.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.openModal = function() {
            $scope.detailsOpen = true;
            $scope.modal.show();
        };

        $scope.closeModal = function() {
            $scope.detailsOpen = false;
            $scope.modal.hide();
        };

        // Cleanup the modal when we're done with it
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        $scope.addProductToWishList = function() {
            if(!$scope.isWishListItem) {
                wishList.addProduct($scope.product)
            } else {
                wishList.removeProduct($scope.product);
            }
        };

    };

    angular.module('weRetail')
        .controller('ProductDetailsController', ["$scope", "$window", "$ionicModal", "wishList", ProductDetailsController])

})(angular);