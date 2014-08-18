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
			bind: "=bind",
			disable: "="

		},
                require:'ngModel',
		restrict: 'AE',
		templateUrl: '/assets/partials/seller/checkout/address.html',
		controller: [

			function() {




			}
		]
	};

};
