'use strict';

// Angular dependencies
var angular = require('angular');
require('angular-aria');
require('angular-animate');
require('angular-ui-router');

// Restangular expects underscore or lodash
window._ = require('lodash');

// Load config
var generalConfig = require('./config/config');
var routeConfig = require('./config/route.config');
var apiConfig = require('./config/api.config');

// Load modules
require('./home/module');
require('./about/module');
require('./templates/module');

// Run Block
Run.$inject =  ['$rootScope'];
function Run($rootScope) {
	$rootScope.$on('$stateChangeStart', onStateChange);

	/**
	 * On state change set the root scope's return to state values,
	 * which are used on successful login to load next state.
	 * @param  {event} event
	 * @param  {Object} toState
	 * @param  {string[]} toParams
	 */
	function onStateChange(event, toState, toParams) {
		if (toState.name !== 'login') {
			$rootScope.returnToState = toState;
			$rootScope.returnToStateParams = toParams;
		}
	}
}

// App
angular
	.module('App', [
		// Angular Dependencies
		'ui.router',
		'ngAria',
		'ngAnimate',
		// App Modules
		'App.Home',
		'App.About',
		'templates'
	])
	// conf
	.config(generalConfig)
	.config(routeConfig)
	.constant('apiConfig', apiConfig)
	// run
	.run(Run);
