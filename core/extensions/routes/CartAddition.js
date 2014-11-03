/**
 * CartAddition is used to add items to the cart.
 * @class CartAddition
 * @param {Product} product 
 * @param {CartAdditionHandler} handler 
 * @constructor
 *
 */
module.exports = function CartAddition(product, handler) {

	/**
	 * add
	 *
	 * @method add
	 * params
	 * @return
	 *
	 */
	this.add = function(item) {

		var Big = require('bignumber.js');

		if (product.stock.balance < 1)
			return handler.onProductOutOfStock(product);

		if (item.quantity > product.stock.balance)
			return handler.onQuantityMoreThanBalance(item.quantity, product.stock.balance, product);

		if (item.quantity < product.order.min)
			return handler.onQuantityLessThanMin(item.quantity, product.order.min, product);

		if (item.quantity > product.order.max)
			return handler.onQuantityMoreThanMax(item.quantity, product.order.max, product);


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
