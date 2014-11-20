var _ = require('lodash');
/**
 * CartAssistant provides useful methods for manipulating the visitors cart.
 * @alias CartAssistant
 * @param {Product} product
 * @param {CartAssistantHandler} handler
 * @constructor
 *
 */
module.exports = function CartAssistant(handler) {

	/**
	 * addToCart adds an item to the cart.
	 *
	 * @method addToCart
	 * @param {Object} item The item to add.
	 * @param {Product} product Product data to compare the item against.
	 * @return
	 *
	 */
	this.addToCart = function(item, product) {

		var Big = require('bignumber.js');

		//@todo this is temporary to support standard cart forms
		//In future we will remove items from the cart only through DELETE requests
		//either through method overloading or actual DELETEs.
		if ((_.isNaN(item.quantity)) || (item.quantity === 0) || (_.isArray(item.quantity)))
			return handler.onItemMustBeRemoved(item);

		if (product.stock.balance < 1)
			return handler.onProductOutOfStock(product);


		if (item.quantity > product.stock.balance)
			return handler.onQuantityMoreThanBalance(item.quantity,
				product.stock.balance, product);

		if (item.quantity < product.order.min)
			return handler.onQuantityLessThanMin(item.quantity,
				product.order.min, product);

		if (item.quantity > product.order.max)
			return handler.onQuantityMoreThanMax(item.quantity,
				product.order.max, product);

		handler.onItemCanBeAddedToCart({
			_id: product._id,
			name: product.name,
			price: product.price,
			slug: product.slug,
			stock: product.stock,
			order: product.order,
			attributes: product.attributes,
			image: product.image,
			quantity: item.quantity,
			subtotal: new Big(product.price).times(item.quantity).toString()

		});

	};





};
