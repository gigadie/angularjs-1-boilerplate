'use strict';

var angular = require('angular');
var AboutComponent = require('./about.component');

angular.module('App.About', [])
	.constant('About.Config', {
		partialPath: './js/about/'
	})
	.config(config)
	.directive('about', AboutComponent);

config.$inject = [
	'$stateProvider'
];

function config($stateProvider) {
	$stateProvider.
		state('about', {
			url: '/about',
			template: '<about></about>'
		});
}
