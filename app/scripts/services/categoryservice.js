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
				},
				remove: {
					"method": "DELETE"
				}
			}
		);


		return categories;


	});