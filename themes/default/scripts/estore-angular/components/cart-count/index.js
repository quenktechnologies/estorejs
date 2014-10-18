/**
 * CartCountDirective is a directive that retrieves the current cart count
 * and binds it to the innerHTML of an element.
 * @class CartCountDirective
 *
 * @constructor
 *
 */
module.exports = function CartCountDirective() {


	return {

		restrict: 'A',
		scope: {},
		controller: ['$rootScope', 'CartService',
			function($rootScope, cartService) {
				cartService.count().
				then(function(res) {
					$rootScope.$broadcast('CART_COUNT_CHANGED', res.data.count);
				});



			}
		],
		link: function(scope, elem) {

			scope.$on('CART_COUNT_CHANGED', function(evt, val) {
				elem.html(val);
			});


		}




	};




};
