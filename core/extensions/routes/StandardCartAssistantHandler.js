/** @module */

/**
 * StandardCartAssistantHandler is the CartAssistantHandler for standard requests.
 *
 * @alias StandardCartAssistantHandler
 * @param {Request} req
 * @param {Response} res
 * @constructor
 * @implements {CartAssistantHandler}
 *
 */
module.exports = function StandardCartAssistantHandler(res) {

	var render = function(status, view, error) {
		res.locals.$cartError = error;
		res.status(status);
		res.render(view);
	};

	this.onProductOutOfStock = function(product) {

		render(409, 'cart.html', 'That product is out of stock!');

	};

	this.onQuantityMoreThanBalance = function(qty, balance, product) {

		render(409, 'cart.html',
			'The quantity you selected is more than that available!');

	};

	this.onQuantityLessThanMin = function(qty, min, product) {

		render(409, 'cart.html',
			'Please select a minimum quantity of ' +
			min + ' ' + product.name + ' (s).');

	};

	this.onQuantityMoreThanMax = function(qty, max, product) {

		render(409, 'cart.html',
			'Please select a maximum quantity of ' +
			max + ' ' + product.name + ' (s).');

	};

	this.onItemCanBeAddedToCart = function(item) {

		res.status(201);
		res.redirect('/cart');

	};

	this.onItemMustBeRemoved = function(item) {

		res.status(204);
		res.redirect('/cart');

	};

};
