var StandardCartAssistantHandler = require('./StandardCartAssistantHandler');
/**
 * BufferedStandardAssistantHandler
 * @alias BufferedStandardAssistantHandler
 * @memberOf core/cart
 * @param {Response} res
 * @constructor
 * @extends {StandardCartAssistantHandler}
 *
 */
function BufferedStandardAssistantHandler(res) {
	this.res = res;
	this.buffer = [];

}

BufferedStandardAssistantHandler.prototype = Object.create(StandardCartAssistantHandler.prototype);

BufferedStandardAssistantHandler.prototype.render = function(status, view, error, product) {

	this.buffer.push({
		error: error,
		product: product
	});

};

BufferedStandardAssistantHandler.prototype.onItemAddedToCart = function(item) {
};

BufferedStandardAssistantHandler.prototype.onItemHasBeenRemoved = function(item) {
};

BufferedStandardAssistantHandler.prototype.flush = function() {

	if (this.buffer.length > 0) {
		this.res.locals.$cartErrors = this.buffer;
		return this.res.render('cart.html');

	}

	this.res.redirect('/cart');




};

module.exports = BufferedStandardAssistantHandler;
