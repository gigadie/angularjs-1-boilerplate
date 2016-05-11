'use strict';

var angular = require('angular');
var HomeComponent = require('./home.component');

angular.module('App.Home', [])
	.constant('Home.Config', {
		partialPath: './js/home/'
	})
	.config(config)
	.directive('home', HomeComponent);

config.$inject = [
	'$stateProvider'
];

function config($stateProvider) {
	$stateProvider.
		state('home', {
			url: '/',
			template: '<home></home>'
		});
}
