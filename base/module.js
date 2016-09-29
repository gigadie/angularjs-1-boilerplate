'use strict';

var angular = require('angular');
var BaseComponent = require('./base.component');

angular.module('App.Base', [])
	.constant('Base.Config', {
		partialPath: './js/base/'
	})
	.config(config)
	.directive('base', BaseComponent)


config.$inject = [
	'$stateProvider'
];

function config($stateProvider) {
	$stateProvider.
		state('base', {
			url: '/base',
			template: '<base></base>'
		});
}
