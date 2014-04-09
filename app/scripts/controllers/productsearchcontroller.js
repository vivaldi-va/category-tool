/**
 * Created by vivaldi on 21.3.2014.
 */

angular.module('Cat.Controllers').
	controller('ProductSearchCtrl', ['$scope', '$rootScope', 'filterFilter', 'ProductService', 'CategoryService', function($scope, $rootScope, filterFilter, ProductService, CategoryService) {
		$scope.search = function() {
			$scope.products = ProductService.search({"docController": $scope.term});
		};

		$scope.selectedProducts = [];

		/*$scope.selectedProducts = function selectedProducts() {
			return filterFilter($scope.products, {selected: true});
		};*/

		$scope.$watch('products | filter:{selected:true}', function(nv) {
			/*$scope.selectedProducts = nv.map(function(product) {
				return product.id;
			});*/

			if(nv && nv.length) {
				$scope.selectedProducts = nv.map(function(product) {
					return product.id;
				});
			} else {
				$scope.selectedProducts = [];
			}
			console.log($scope.selectedProducts);
		}, true);


		$scope.createCatFromSearch = function() {
			var catId		= $rootScope.categoryRoot.id;
			var name		= $scope.term;
			var products	= $scope.selectedProducts.length>0 ? $scope.selectedProducts : null;

			// TODO errorz
			if(catId === 0) {
				return;
			}

			CategoryService.create({
				"parent": catId,
				"name": name,
				"products": products
			});
		};








	}]);