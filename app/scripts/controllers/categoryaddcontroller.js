/**
 * Created by vivaldi on 26.3.2014.
 */

angular.module('Cat.Controllers')
	.controller('CatAddCtrl', function($scope, $log, CategoryService) {


		$scope.categories = CategoryService.get();

		$scope.submit = function() {
			var data = {
				"name": $scope.catName
			};

			if($scope.catParent) data.parent = $scope.catParent;

			/*var res = CategoryService.create(data);
			res.then(
					function(status) {
						$log.info('Cat Create:', status);
					},
					function(err, d) {
						$log.warn('Cat Create Err:', err);
					}
				);

			$log.info(res);*/


			CategoryService.create(data).$promise
				.then(
					function(success) {
						$log.info('SUCCESS');
					},
					function(err) {
						$log.warn('ERR', err);
					}
				);

		}
	});