/**
 * Created by vivaldi on 21.3.2014.
 */

angular.module('Cat.Controllers')
	.controller('CatListCtrl', ['$scope', 'CategoryService', function($scope, CategoryService) {
		$scope.categories = CategoryService.get();
	}]);