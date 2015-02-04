var fmt = require('string-template');
var OUT_OF_STOCK = 'Sorry, {name} is out of stock!';

var QUANTITY_MORE_THAN_BALANCE =
	'Sorry, we don\'t have that many {name} right now!';

var MIN = 'Please select a minimum quantity of {min} {name}(s).';
var MAX = 'Please select a maximum quantity of {max} {name}(s).';
/**
 * StandardCartAssistantHandler is the CartAssistantHandler for standard requests.
 *
 * @param {Response} res
 * @constructor
 * @implements {CartAssistantHandler}
 *
 */
function StandardCartAssistantHandler(res) {
	this.res = res;
}

StandardCartAssistantHandler.prototype.render = function(status, view, error, product) {
	this.res.locals.$cartError = error;
	this.res.locals.$cartErrorProduct = product;
	this.res.status(status);
	this.res.render(view);
};

StandardCartAssistantHandler.prototype.onProductOutOfStock = function(product) {

	this.render(409, 'cart.html', fmt(OUT_OF_STOCK, {name: product.name}), product);

};

StandardCartAssistantHandler.prototype.onQuantityMoreThanBalance = function(qty, balance, product) {

	this.render(409, 'cart.html',
		fmt(QUANTITY_MORE_THAN_BALANCE, {name:product.name}), product);

};

StandardCartAssistantHandler.prototype.onQuantityLessThanMin = function(qty, min, product) {

	this.render(409, 'cart.html', fmt(MIN, {
			name: product.name,
			min: product.order.min
		}),
		product);

};

StandardCartAssistantHandler.prototype.onQuantityMoreThanMax = function(qty, max, product) {

	this.render(409, 'cart.html', fmt(MAX, {
			name: product.name,
			max: product.order.max
		}),
		product);
};

StandardCartAssistantHandler.prototype.onItemAddedToCart = function(item) {

	this.res.redirect(303, '/cart');

};

StandardCartAssistantHandler.prototype.onItemHasBeenRemoved = function(item) {

	this.res.redirect(303, '/cart');

};

module.exports = StandardCartAssistantHandler;
