/**
 * @module
 */

var _ = require('lodash');

/**
 * CartAssistantHandlerWrapper wraps other CartAssistantHandlers to give
 * them common functionality.
 *
 * @todo casts to string on object ids are temporary until we start using slugs instead.
 * @alias CartAssistantHandlerWrapper
 * @param {Object} session
 * @param {CartAssistantHandler} name description
 * @constructor
 * @implements {CartAssistantHandler}
 *
 */
module.exports = function CartAssistantHandlerWrapper(session, handler) {

	this.onProductOutOfStock = function(product) {

		return handler.onProductOutOfStock(product);

	};

	this.onQuantityMoreThanBalance = function(qty, balance, product) {

		return handler.onQuantityMoreThanBalance(qty, balance, product);

	};

	this.onQuantityLessThanMin = function(qty, min, product) {

		return handler.onQuantityLessThanMin(qty, min, product);

	};

	this.onQuantityMoreThanMax = function(qty, max, product) {

		return handler.onQuantityMoreThanMax(qty, max, product);

	};

	this.onItemMustBeRemoved = function(item) {

		console.log(item._id);
		session.cart = _.reject(session.cart, {
			'_id': String(item._id)
		});

		handler.onItemMustBeRemoved(item);
	};

	this.onItemCanBeAddedToCart = function(item) {

		session.cart = _.reject(session.cart, function(cartItem) {

			return (String(item._id) === String(cartItem._id));

		});

		session.cart.push(item);

		handler.onItemCanBeAddedToCart(item);
	};

};
