'use strict';

config.$inject = [
	'$urlRouterProvider'
];

function config($urlRouterProvider) {
	$urlRouterProvider.otherwise('/');
}

module.exports = config;
