/**
 * PhoneElementDirective for checkout that explicitly requests an email address.
 * @class PhoneElementDirective
 * @param {TextElementDirective} input
 * @constructor
 *
 */
module.exports = function PhoneElementDirective() {

	return {

		scope: {
			model: '=model',
			disable: '=',
			required: '@',
			placeholder: '@',
                        name:'@'
		},
		replace: true,
		restrict: 'E',
		template: require('./phone.html')
	};
};
