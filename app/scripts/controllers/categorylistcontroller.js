/**
 * Created by vivaldi on 21.3.2014.
 */

angular.module('Cat.Controllers')
	.controller('CatListCtrl', ['$scope', '$rootScope', '$log', 'CategoryService', function($scope, $rootScope, $log, CategoryService) {
		$scope.categories		= CategoryService.get();
		$scope.catHistory		= [];
		$scope.categoryDepth	= 0;
		$scope.categories.$promise.then(function(data) {
			$rootScope.categoryRoot	= data.root;
		});
		$scope.activeCatMenu = null

		$scope.expandedCategory	= null;

		$scope.expandCategory = function(elem) {
			if($scope.expandedCategory === null || $scope.expandedCategory !== elem) {
				$scope.expandedCategory = elem;
			} else {
				$scope.expandedCategory = null;
			}
		};

		$scope.navigateDown = function(category) {
			$scope.catHistory.push($rootScope.categoryRoot);
			$rootScope.categoryRoot = category;
			$scope.categoryDepth++;
			$log.info('CatHistory', $scope.catHistory, $scope.categoryDepth);
		};

		$scope.navigateUp = function() {
			$rootScope.categoryRoot = $scope.catHistory[$scope.categoryDepth-1];
			$scope.catHistory.pop();
			$scope.categoryDepth--;
			$log.info('CatHistory', $scope.catHistory, $scope.categoryDepth);
		};

		$scope.openNewRootCatForm = function() {
			$scope.categoryRoot.formOpen = true;
		};

		$scope.openNewCatForm = function(category) {
			category.formOpen = true;
		};

		$scope.toggleCatMenu = function(category) {
			if($scope.activeCatMenu === category) {
				$scope.activeCatMenu = null;
			} else {
				$scope.activeCatMenu = category;
			}
		};

		$scope.makeCategory = function(parent, name) {
			parent = parent || 0;

			CategoryService.create({"parent": parent, "name": name}).$promise
				.then(function(res) {
					$log.info(res);
				});
		};
	}]);