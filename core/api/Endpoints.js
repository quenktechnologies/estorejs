/**
 * Endpoints provides a key value list of uri mappings used by the vendorlize api.
 * @class Endpoints
 *
 * @constructor
 *
 */
module.exports = function Endpoints() {

	var slug = '([a-z0-9-]{1,128})';

	return {

		PRODUCTS: '/_/products',
		PRODUCT: new RegExp('^/_/products/' + slug + '$'),

		CART_ITEMS: '/_/cart/items',
		CART_ITEMS_COUNT: '/_/cart/items/count',
		CART_ITEM: new RegExp('^/_/cart/items/' + slug + '$'),
		CART_ITEM_QUANTITY: new RegExp('^/_/cart/items/' + slug + '/@quantity$'),
		CART_ITEM_QUANTITY_VALUE: new RegExp('^/_/cart/items/' + slug + '/@quantity/([\\d]{1,16})$'),

		CHECKOUT_OPTIONS: '/_/checkout/@options',
		CHECKOUT_TRANSACTIONS: '/_/checkout/transactions',

		DELIVERY_RATES: '/_/delivery/options/rates'



	};


};
