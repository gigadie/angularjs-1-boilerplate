'use strict';

Home.$inject = [
	'Home.Config'
];

function Home(HomeConfig) {

	var directive = {
		restrict: 'E',
		replace: true,
		templateUrl: HomeConfig.partialPath.concat('home.template.html'),
		scope: {},
		bindToController: {},
		controllerAs: 'ctrl',
		controller: HomeController
	};

	HomeController.$inject = [

	];

	function HomeController() {
		var vm = this; // view model

		vm.msg = 'This is Home!';

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

module.exports = Home;
