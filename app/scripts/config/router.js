/**
 * Created by vivaldi on 20.3.2014.
 */

angular.module('Cat.Router')
	.config(function ($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'partials/main',
				controller: 'MainCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});

		$locationProvider.html5Mode(true);
	});