/**
 * AddressElementDirective for checkout that explicitly requests an email address.
 * @class AddressElementDirective
 *
 * @constructor
 *
 */
module.exports = function AddressElementDirective() {

	return {

		scope: {
			title: "@",
			bind: "=ngModel",
			disable: "="

		},
		require: 'ngModel',
		restrict: 'AE',
		template: require('./address.html'),
	};

};
