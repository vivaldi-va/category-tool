/**
 * Created by vivaldi on 21.3.2014.
 */

angular.module('Cat.Services')
	.factory('ProductService', function($resource) {
		var product = $resource(
			'/api/products/:productController:id/:docController',
			{
				"id": "@id",
				"productController": "@productController",
				"docController": "@docController"
			},
			{
				"search": {
					"method": "GET",
					"isArray": true,
					"params": {
						"productController": "search"
					}
				}
			}
		);

		return product;
	});