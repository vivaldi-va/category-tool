/**
 * Created by vivaldi on 21.3.2014.
 */

angular.module('Cat.Controllers')
	.controller('CatListCtrl', ['$scope', '$rootScope', '$log', 'CategoryService', function($scope, $rootScope, $log, CategoryService) {
		$scope.categories		= CategoryService.get();

		$scope.categories.$promise.then(function(data) {
			$rootScope.categoryRoot		= data.root;
		});


		$scope.expandedCategory	= null;


		$scope.expandCategory = function(elem) {
			if($scope.expandedCategory === null || $scope.expandedCategory !== elem) {
				$scope.expandedCategory = elem;
			} else {
				$scope.expandedCategory = null;
			}
		};

		$scope.navigateDown = function(category) {
			$rootScope.categoryRoot = category;
		};

		$scope.makeCategory = function(parent, name) {
			parent = parent || 0;
		};
	}]);