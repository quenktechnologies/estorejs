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
			name: '@',
			model: '=',
			required: '@'
		},
		restrict: 'E',
		template: require('./email.html'),
	};

};
