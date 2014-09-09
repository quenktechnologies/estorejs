/**
 * TextElementDirective for checkout that explicitly requests an email address.
 * @class TextElementDirective
 *
 * @constructor
 *
 */
module.exports = function TextElementDirective() {

	return {

		scope: {
			title: '@',
			model: '=model',
			disable: '=',
			required: '@',
			placeholder: '@',
			esClass: '@class',
			pattern: '@',
                        name: '@'
		},
		replace: true,
		restrict: 'E',
		template: require('./text.html')
	};

};
