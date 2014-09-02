/**
 * EmailElementDirective for checkout that explicitly requests an email address.
 * @class EmailElementDirective
 *
 * @constructor
 *
 */
module.exports = function EmailElementDirective() {

	return {

		scope: {
			ngModel: '=bind'
		},
		restrict: 'AE',
                require:'ngModel',
		controllerAs: 'emailElement',
		template: require('./email.html'),
	};

};
