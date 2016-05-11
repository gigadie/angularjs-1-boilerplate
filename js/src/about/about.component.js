'use strict';

About.$inject = [
	'About.Config'
];

function About(AboutConfig) {

	var directive = {
		restrict: 'E',
		replace: true,
		templateUrl: AboutConfig.partialPath.concat('about.template.html'),
		scope: {},
		bindToController: {},
		controllerAs: 'ctrl',
		controller: AboutController
	};

	AboutController.$inject = [

	];

	function AboutController() {
		var vm = this; // view model

		vm.msg = 'This is About!';

		return init();

		/**
		 * This is the init method
		 */
		function init() {
			// init code here
		}
	}

	return directive;

}

module.exports = About;
