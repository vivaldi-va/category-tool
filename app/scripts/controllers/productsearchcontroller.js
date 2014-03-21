/**
 * Created by vivaldi on 21.3.2014.
 */

angular.module('Cat.Controllers').
	controller('ProductSearchCtrl', ['$scope', 'ProductService', function($scope, ProductService) {
		$scope.search = function() {
			$scope.products = ProductService.search({"docController": $scope.term});
		};
	}]);