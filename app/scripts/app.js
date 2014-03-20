'use strict';

angular.module('Cat.Controllers', []);
angular.module('Cat.Services', []);
angular.module('Cat.Router', ['ngRoute']);

angular.module('Cat', [
		'Cat.Router',
		'Cat.Services',
		'Cat.Controllers',
		'ngCookies',
		'ngResource',
		'ngSanitize'
	]);