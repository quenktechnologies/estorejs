var _ = require('lodash');
var Big = require('bignumber.js');

/**
 * CartAssistant provides useful methods for manipulating the visitors cart.
 * @alias CartAssistant
 * @param {Cart} cart
 * @param {CartAssistantHandler} handler
 * @constructor
 *
 */
function CartAssistant(cart, handler) {
	this.cart = cart;
	this.handler = handler;
}

/**
 * addProductToCart adds an item to the cart.
 *
 * @param {Object} item The item to add.
 * @param {Product} product Product data to compare the item against.
 * @return
 *
 */
CartAssistant.prototype.addProductToCart = function(item, product) {


	if (!item.quantity)
		item.quantity = 0;

	if (isNaN(item.quantity))
		item.quantity = 0;

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

	item = {
		_id: product._id,
		uuid: product.uuid,
		name: product.name,
		price: product.price,
		slug: product.slug,
                stock: product.stock,
                charges: product.charges,
		order: product.order,
		attributes: product.attributes,
		image: product.image,
		quantity: item.quantity,
		subtotal: new Big(product.price).times(item.quantity).toString()

	};

	this.cart.add(item);
	this.handler.onItemAddedToCart(item);

};


/**
 * removeFromCart
 *
 * @param {ItemHash} item
 *
 */
CartAssistant.prototype.removeFromCart = function(uuid) {

	var item = this.cart.removeUUID(uuid);
	if (item)
		this.handler.onItemHasBeenRemoved(item);

};


/**
 * addProductsToCart
 *
 * @param {Array} items
 * @param {Array} products
 *
 */
CartAssistant.prototype.addProductsToCart = function(items, products) {

	var self = this;

	items.forEach(function(item) {
		products.forEach(function(product) {

			if (product.uuid === item.uuid)
				self.addProductToCart(item, product);

		});
	});



};







module.exports = CartAssistant;
