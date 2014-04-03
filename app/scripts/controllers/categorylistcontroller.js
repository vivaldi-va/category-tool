/**
 * Created by vivaldi on 21.3.2014.
 */

angular.module('Cat.Controllers')
	.controller('CatListCtrl', ['$scope', '$log', 'CategoryService', function($scope, $log, CategoryService) {
		$scope.categories = CategoryService.get();

		$scope.makeCategory = function(parent, name) {
			parent = parent || 0;

		};
	}]);