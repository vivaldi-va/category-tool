/**
 * Created by vivaldi on 21.3.2014.
 */

angular.module('Cat.Services')
	.factory('CategoryService', function($rootScope, $log, $http, $q, $resource) {

		var categories = $resource(
			'/api/categories/:catController:id/:docController',
			{
				"id": "@id",
				"catController": "@catController",
				"docController": "@docController"
			},
			{
				get: {
					"method": "GET",
					"isArray": false
				},
				create: {
					"method": "POST",
					"isArray": true,
					"responseType": 'json'
				}
			}
		);

		function _create(data) {
			var dfd = $q.defer();

			$http({
				url: "/api/categories",
				method: 'POST',
				data: data,
				responseType: 'json'
			})
				.success(function(data, status) {
					dfd.resolve(data);
				})
				.error(function(reason, status) {
					$log.warn('ERR', reason, status);
					dfd.reject(reason);
				});

			return dfd.promise;
		}


		return categories;


	});