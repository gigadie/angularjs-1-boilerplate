'use strict';

Base.$inject = [
	'Base.Config'
];

function Base(BaseConfig) {

	var directive = {
		restrict: 'E',
		replace: true,
		templateUrl: BaseConfig.partialPath.concat('base.template.html'),
		scope: {},
		bindToController: {},
		controllerAs: 'ctrl',
		controller: BaseController
	};

	BaseController.$inject = [
	];

	function BaseController() {
		var vm = this; // view model

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

module.exports = Base;
