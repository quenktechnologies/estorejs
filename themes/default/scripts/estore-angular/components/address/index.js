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
			title: '@',
			bind: '=ngModel',
			disable: '=',
			required: {
                          name: '@'

                        }

		},
		require: 'ngModel',
		restrict: 'AE',
		template: require('./address.html'),
		controller: ['$scope',
			function($scope) {

				if ($scope.required == undefined) {

					$scope.required = {
						name: true,
						company: false,
						city: true,
						phone: true,
						country: true
					};

				}


			}
		]
	};

};
