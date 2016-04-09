'use strict';
angular.module('myCartApp', [])
    .factory('localstorage', ['$window', function($window) {
        return {
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }
        }
    }])
    .controller('myCartController', ['$scope', 'localstorage', '$http', function($scope, localstorage, $http) {

        $scope.productList = [];
        $http.get('model/productsList.json').
        success(function(data, status, headers, config) {
            $scope.productList = data;
            $scope.totalProductItems = $scope.productList.length;
        }).
        error(function(data, status, headers, config) {
            $scope.error = status;
        });



        //localstorage.setObject('cartItems', '');
        //console.log( typeof(localstorage.getObject('cartItems').length)  == "undefined");
        if (localstorage.getObject('cartItems').length <= 0 || typeof(localstorage.getObject('cartItems').length) == "undefined") {
            $scope.cartItems = [];
            localstorage.setObject('cartItems', $scope.cartItems);
        }
        $scope.cartDetails = localstorage.getObject('cartItems');

        $scope.totalCartItems = $scope.cartDetails.length;
        $scope.totalCartValue = function() {
            var totalValue = 0;
            angular.forEach($scope.cartDetails, function(value, key) {
                totalValue += value.quantity * value.price;
            });
            return totalValue;
        };

        $scope.removeItemFromCart = function(cartItem) {
            var indx = $scope.cartDetails.indexOf(cartItem);
            if (indx >= 0) {
                $scope.cartDetails.splice(indx, 1);
            }
            $scope.totalCartItems = $scope.cartDetails.length;
            localstorage.setObject('cartItems', $scope.cartDetails);
        };

        $scope.addItemToCart = function(product) {
            if ($scope.itemExsistsInCart(product)) {
                $scope.addItem(product);
            } else {
                var item = product;
                item.quantity = 1;
                $scope.cartDetails.push(item);
                $scope.totalCartItems = $scope.cartDetails.length;
                localstorage.setObject('cartItems', $scope.cartDetails);
            }
        };

        $scope.itemExsistsInCart = function(product) {
            if ($scope.cartDetails.length > 0) {
                var itemExsist = $scope.cartDetails.filter(function(prod) {
                    return prod.productId == product.productId
                }).length;
                if (itemExsist > 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        };

        $scope.addItem = function(product) {
            var itemExsist = $scope.cartDetails.filter(function(prod) {
                return prod.productId == product.productId
            })[0];
            itemExsist.quantity++;
            localstorage.setObject('cartItems', $scope.cartDetails);
        };

        $scope.removeItem = function(product) {
            var itemExsist = $scope.cartDetails.filter(function(prod) {
                return prod.productId == product.productId
            })[0];
            if (itemExsist.quantity > 1) {
                itemExsist.quantity--;
            } else {
                $scope.removeItemFromCart(itemExsist);
            }
            localstorage.setObject('cartItems', $scope.cartDetails);
        };
    }]);
