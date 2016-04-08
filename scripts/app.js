    angular.module('myCartApp',[])
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
	.controller('myCartController',['$scope','localstorage','$http', function($scope, localstorage, $http) {
		
		$scope.productList = [];
		$http.get('model/productsList.json').
		  success(function(data, status, headers, config) {
			  $scope.productsList = data;
		  }).
		  error(function(data, status, headers, config) {
			  $scope.error = status;
		});
	
		
		 
		//localstorage.setObject('cartItems', '');
		//console.log(localstorage.getObject('cartItems').length == 0);
		if(localstorage.getObject('cartItems').length <= 0){
			 $scope.cartItems = [{
				"productId": "productId1",
				"productImage": "http://placehold.it/320x150",
				"productName": "ProductName1",
				"brandName": "ProductName1",
				"quantity": 2,
				"price": 200,
				"packingDetails": "packingDetails1"
			  },{
				"productId": "productId2",
				"productImage": "http://placehold.it/320x150",
				"productName": "ProductName2",
				"brandName": "ProductName2",
				"quantity": 3,
				"price": 500,
				"packingDetails": "packingDetails2"
			  },{
				"productId": "productId6",
				"productImage": "http://placehold.it/320x150",
				"productName": "ProductName6",
				"brandName": "brandName6",
				"quantity": 1,
				"price": 250,
				"packingDetails": "packingDetails6"
			 }];
			  
			localstorage.setObject('cartItems', $scope.cartItems);
		}
		$scope.cartDetails = localstorage.getObject('cartItems');
		
		$scope.totalProductItems = $scope.productList.length;
		$scope.totalCartItems = $scope.cartDetails.length;
		$scope.totalCartValue = function(){
			var totalValue = 0;
			angular.forEach($scope.cartDetails, function(value, key){
				totalValue += value.quantity * value.price;
			});
			return totalValue;
		};
		
		$scope.removeItemFromCart = function(cartItem){
			var indx = $scope.cartDetails.indexOf(cartItem);
			if(indx >= 0 ){
				$scope.cartDetails.splice(indx,1);
			}
			$scope.totalCartItems = $scope.cartDetails.length;
			localstorage.setObject('cartItems', $scope.cartDetails);
		};
		
		$scope.addItemToCart = function(product){
			var item = product;
			item.quantity = 1;
			$scope.cartDetails.push(item);
			$scope.totalCartItems = $scope.cartDetails.length;
			localstorage.setObject('cartItems', $scope.cartDetails);
		};
		
		$scope.itemExsistsInCart = function(product){
			var itemExsist = $scope.cartDetails.filter( function(prod){return prod.productId == product.productId} ).length;
			if(itemExsist > 0){
				return true;
			} else {
				return false;
			}
		};
		
		$scope.addItem = function(product){
			var itemExsist = $scope.cartDetails.filter( function(prod){return prod.productId == product.productId} )[0];
			itemExsist.quantity++;
			localstorage.setObject('cartItems', $scope.cartDetails);
		};
		
		$scope.removeItem = function(product){
			var itemExsist = $scope.cartDetails.filter( function(prod){return prod.productId == product.productId} )[0];
			if(itemExsist.quantity > 1){
				itemExsist.quantity--;
			} else {
				$scope.removeItemFromCart(itemExsist);
			}
			localstorage.setObject('cartItems', $scope.cartDetails);
		};
    }]);