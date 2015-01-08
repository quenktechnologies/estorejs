var _ = require('lodash');
/**
 * CartAssistant provides useful methods for manipulating the visitors cart.
 * @alias CartAssistant
 * @param {Array} cart
 * @param {CartAssistantHandler} handler
 * @constructor
 *
 */
function CartAssistant(cart, handler) {
	this.cart = cart;
	this.handler = handler;
}

/**
 * addToCart adds an item to the cart.
 *
 * @param {Object} item The item to add.
 * @param {Product} product Product data to compare the item against.
 * @return
 *
 */
CartAssistant.prototype.addToCart = function(item, product) {

	var Big = require('bignumber.js');

	if (!item.quantity)
		item.quantity = 1;

	if (_.isNaN(item.quantity))
		item.quantity = 1;

	if (item.quantity === 0)
		return this.removeFromCart(item.uuid);

	if (product.stock.balance < 1)
		return this.handler.onProductOutOfStock(product);


	if (item.quantity > product.stock.balance)
		return this.handler.onQuantityMoreThanBalance(item.quantity,
			product.stock.balance, product);

	if (item.quantity < product.order.min)
		return this.handler.onQuantityLessThanMin(item.quantity,
			product.order.min, product);

	if (item.quantity > product.order.max)
		return this.handler.onQuantityMoreThanMax(item.quantity,
			product.order.max, product);

	this.cart.forEach(function(cartItem, index) {

		if (item.uuid === cartItem.uuid)
			this.cart.splice(index, 1);
	}.bind(this));


	item = {
		_id: product._id,
		uuid: product.uuid,
		name: product.name,
		price: product.price,
		slug: product.slug,
		stock: product.stock,
		order: product.order,
		attributes: product.attributes,
		image: product.image,
		quantity: item.quantity,
		subtotal: new Big(product.price).times(item.quantity).toString()

	};

	this.cart.push(item);
	this.handler.onItemAddedToCart(item);

};


/**
 * removeFromCart
 *
 * @param {ItemHash} item
 *
 */
CartAssistant.prototype.removeFromCart = function(uuid) {

	var found;

	this.cart.forEach(function(item, index) {

		if (uuid === item.uuid) {
			this.cart.splice(index, 1);
			found = item;
		}

	}.bind(this));

	if (found)
		this.handler.onItemHasBeenRemoved(found);



};








module.exports = CartAssistant;
