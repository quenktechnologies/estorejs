/**
 * @module
 */

var _ = require('lodash');

/**
 * CartAssistantHandlerWrapper wraps other CartAssistantHandlers to give
 * them common functionality.
 *
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

		session.cart = _.reject(session.cart, {
			'_id': item._id
		});

		handler.onItemMustBeRemoved(item);
	};

	this.onItemCanBeAddedToCart = function(item) {

		session.cart = _.reject(session.cart, {
			_id: item._id
		});

		session.cart.push(item);

		handler.onItemCanBeAddedToCart(item);
	};

};
