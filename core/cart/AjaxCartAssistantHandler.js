/** @module */

/**
 * AjaxCartAssistantHandler is the CartAssistantHandler for ajax requests.
 *
 * @alias AjaxCartAssistantHandler
 * @param {Response} res
 * @constructor
 * @implements {CartAssistantHandler}
 *
 */
module.exports = function AjaxCartAssistantHandler(res) {

	this.onProductOutOfStock = function(product) {

		res.send(409, {
			message: 'Sorry! That product is out of stock'
		});
	};

	this.onQuantityMoreThanBalance = function(qty, balance, product) {

		res.send(409, {
			message: 'The quantity you selected is more than that available!'
		});

	};

	this.onQuantityLessThanMin = function(qty, min, product) {

		res.send(409, {
			message: 'Please select a minimum quantity of ' +
				min + ' ' + product.name + ' (s).'
		});

	};

	this.onQuantityMoreThanMax = function(qty, max, product) {

		res.send(409, {
			message: 'Please select a maximum quantity of ' +
				max + ' ' + product.name + ' (s).'
		});

	};

	this.onItemCanBeAddedToCart = function(item) {

		res.status(201);

	};


	this.onItemHasBeenRemoved = function(item) {

		res.status(204);

	};







};
