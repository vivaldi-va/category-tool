/**
 * Created by vivaldi on 21.3.2014.
 */

angular.module('Cat.Services')
	.factory('CategoryService', function($rootScope, $http, $q, $resource) {

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
					"isArray": true
				},
				create: {
					"method": "POST"
				}
			}
		);


		return categories;


	});